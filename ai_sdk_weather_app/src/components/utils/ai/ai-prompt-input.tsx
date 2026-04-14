"use client";

import { type UUIDTypes, v4 as uuidv4 } from "uuid";
import {
	PromptInput,
	PromptInputAttachment,
	PromptInputAttachments,
	PromptInputBody,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
	PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import { useChatContext } from "./_providers/chat-provider";
import type { MessageMetadata } from "./_types/types";
import { ToolBarInputActionMenu, ToolBarInputButton, ToolBarInputModelSelect } from "./ai-toolbar";

interface PromptInputToolbarSectionProps {
	disabledFile?: boolean;
	disabledwebSearch?: boolean;
	disabledModelSelect?: boolean;
}

interface AiPromptInputProps extends PromptInputToolbarSectionProps {
	className?: string;
}

export function PromptInputBodySection() {
	const { input, setInput } = useChatContext();
	return (
		<PromptInputBody>
			<PromptInputAttachments>
				{(attachment) => <PromptInputAttachment data={attachment} />}
			</PromptInputAttachments>

			<PromptInputTextarea onChange={(e) => setInput(e.target.value)} value={input} />
		</PromptInputBody>
	);
}

export function PromptInputToolbarSection({ ...props }: PromptInputToolbarSectionProps) {
	const { status, input } = useChatContext();
	return (
		<PromptInputToolbar>
			<PromptInputTools>
				{!props.disabledFile ? <ToolBarInputActionMenu /> : null}

				{!props.disabledwebSearch ? <ToolBarInputButton /> : null}

				{!props.disabledModelSelect ? <ToolBarInputModelSelect /> : null}
			</PromptInputTools>

			<PromptInputSubmit disabled={!input && !status} status={status} />
		</PromptInputToolbar>
	);
}

export default function AiPromptInput({ ...props }: AiPromptInputProps) {
	const {
		stop,
		status,
		clearError,
		editingMessageId,
		messages,
		currentBranchId,
		sendMessage,
		model,
		webSearch,
		setInput,
		setCurrentBranchId,
		setEditingMessageId,
	} = useChatContext();
	const t = useI18n();

	const handleSubmit = (message: PromptInputMessage) => {
		const hasText = Boolean(message.text);
		const hasAttachments = Boolean(message.files?.length);

		if (!(hasText || hasAttachments)) {
			return;
		}

		let branchId: UUIDTypes;
		let parentMessageId: string | null;

		if (editingMessageId) {
			const editedMessage = messages.find((m) => m.id === editingMessageId);
			parentMessageId = editedMessage?.metadata?.parentMessageId ?? null;
			branchId = uuidv4();
		} else {
			const lastMessage = messages[messages.length - 1];
			parentMessageId = lastMessage?.id ?? null;
			branchId = currentBranchId;
		}
		sendMessage(
			{
				text: message.text || t("components.ai.input.DefaultAttachmentText"),
				files: message.files,
				metadata: {
					branchId: branchId,
					parentMessageId: parentMessageId,
					createdAt: Date.now(),
				} as MessageMetadata,
			},
			{
				body: {
					model: model,
					webSearch: webSearch,
				},
			},
		);

		setInput("");
		if (editingMessageId) {
			setCurrentBranchId(branchId);
		}
		setEditingMessageId(null);
	};

	return (
		<PromptInput
			onSubmit={status === "streaming" ? stop : status === "error" ? clearError : handleSubmit}
			className={cn("mt-4", `${props.className}`)}
			globalDrop
			multiple
		>
			<PromptInputBodySection />
			<PromptInputToolbarSection {...props} />
		</PromptInput>
	);
}
