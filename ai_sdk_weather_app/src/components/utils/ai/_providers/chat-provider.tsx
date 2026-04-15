"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";

type ToolsType = Record<
	string,
	{
		component: React.ComponentType<{ part: unknown }>;
	}
>;

interface Model {
	name: string;
	value: string;
}
interface ChatProviderProps {
	children: React.ReactNode;
	models: Model[];
	toolsRender?: ToolsType;
	apiURL?: string;
}

interface ChatContextValue {
	messages: MyUIMessage[];
	sendMessage: ReturnType<typeof useChat<MyUIMessage>>["sendMessage"];
	regenerate: ReturnType<typeof useChat<MyUIMessage>>["regenerate"];
	status: ReturnType<typeof useChat<MyUIMessage>>["status"];
	stop: ReturnType<typeof useChat<MyUIMessage>>["stop"];
	clearError: ReturnType<typeof useChat<MyUIMessage>>["clearError"];
	error: ReturnType<typeof useChat<MyUIMessage>>["error"];
	setMessages: ReturnType<typeof useChat<MyUIMessage>>["setMessages"];
	addToolOutput: ReturnType<typeof useChat<MyUIMessage>>["addToolOutput"];
	resumeStream: ReturnType<typeof useChat<MyUIMessage>>["resumeStream"];
	addToolApprovalResponse: ReturnType<typeof useChat<MyUIMessage>>["addToolApprovalResponse"];

	model: string;
	setModel: (val: string) => void;

	models: Model[];
	setModels: (val: Model[]) => void;

	webSearch: boolean;
	setWebSearch: (val: boolean) => void;

	editingMessageId: string | null;
	setEditingMessageId: (val: string | null) => void;

	currentBranchId: string;
	setCurrentBranchId: (val: string) => void;

	toolsRender: ToolsType;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ ...props }: ChatProviderProps) => {
	const [models, setModels] = useState<Model[]>(props.models);
	const [model, setModel] = useState<string>(props.models[0]?.value);
	const [webSearch, setWebSearch] = useState<boolean>(false);

	const toolsRender = props.toolsRender ?? {};

	const apiURL = props.apiURL ?? "/api/chat";

	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [currentBranchId, setCurrentBranchId] = useState<string>(() => uuidv4());

	const {
		messages,
		sendMessage,
		regenerate,
		status,
		stop,
		clearError,
		error,
		setMessages,
		addToolOutput,
		resumeStream,
		addToolApprovalResponse,
	} = useChat<MyUIMessage>({
		generateId: () => uuidv4(),
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		transport: new DefaultChatTransport({
			api: apiURL,
		}),
		async onToolCall({ toolCall }) {
			if (toolCall.dynamic) {
				return;
			}
			switch (toolCall.toolName) {
				case "getLocation": {
					navigator.geolocation.getCurrentPosition((position) => {
						addToolOutput({
							tool: "getLocation",
							toolCallId: toolCall.toolCallId,
							output: {
								latitude: position.coords.latitude,
								longitude: position.coords.longitude,
							},
						});
					});
					break;
				}
			}
		},
	});

	return (
		<ChatContext.Provider
			value={{
				messages,
				sendMessage,
				regenerate,
				stop,
				clearError,
				status,
				error,
				setMessages,
				addToolOutput,
				resumeStream,
				model,
				setModel,
				models,
				setModels,
				webSearch,
				setWebSearch,
				editingMessageId,
				setEditingMessageId,
				currentBranchId,
				setCurrentBranchId,
				toolsRender,
				addToolApprovalResponse,
			}}
		>
			{props.children}
		</ChatContext.Provider>
	);
};

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
};
