"use client";

import type { TextUIPart } from "ai";
import { BotMessageSquare } from "lucide-react";
import { Branch, BranchMessages } from "@/components/ai-elements/branch";
import { Message, MessageAvatar, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth/auth-client";
import { useChatContext } from "./_providers/chat-provider";
import type { MyUIMessage } from "./_types/types";
import { AiMessageFooterPartAction } from "./ai-message-part-footer";
import { AiMessageHeaderPartFile, AiMessageHeaderPartSources } from "./ai-message-part-header";

interface AiMessageMainPartAvatarProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

interface AiMessageMainPartTextProps extends Pick<AiMessageMainPartAvatarProps, "message"> {
	part: TextUIPart;
}

export function AiMessageMainPartAvatar({ ...props }: AiMessageMainPartAvatarProps) {
	const { data: session } = useSession();

	return !props.disabledAvatar ? (
		props.message.role === "user" ? (
			<MessageAvatar name={session?.user.name?.slice(0, 2).toUpperCase() ?? ""} src={session?.user.image ?? ""} />
		) : (
			<Avatar className="flex justify-center items-center size-8 ring-1 ring-border bg-muted">
				<BotMessageSquare />
			</Avatar>
		)
	) : null;
}

export function AiMessageMainPartText({ ...props }: AiMessageMainPartTextProps) {
	const { setCurrentBranchId, editingMessageId, messages } = useChatContext();

	const allMessagesByBranch = [
		props.message,
		...messages.filter(
			(msg) =>
				props.message.metadata?.parentMessageId === msg.metadata?.parentMessageId &&
				props.message.metadata?.branchId !== msg.metadata?.branchId,
		),
	].sort((a, b) => (a.metadata?.createdAt ?? 0) - (b.metadata?.createdAt ?? 0));

	const currentIndex = allMessagesByBranch.findIndex((msg) => msg.id === props.message.id);

	const handleBranchChange = (index: number) => {
		if (allMessagesByBranch[index].metadata) {
			setCurrentBranchId(allMessagesByBranch[index].metadata?.branchId);
		}
	};

	return (
		<Branch
			defaultBranch={currentIndex >= 0 ? currentIndex : 0}
			onBranchChange={handleBranchChange}
			className="group"
		>
			<BranchMessages>
				{allMessagesByBranch.map((message, i) => (
					<div key={`${message.id}-${i}`} className="grid gap-2">
						<AiMessageHeaderPartSources {...props} />
						<AiMessageHeaderPartFile {...props} />
						<Message from={message.role} className="p-0">
							<MessageContent variant={message.id === editingMessageId ? "editing" : "contained"}>
								<Response>{props.part.text}</Response>
							</MessageContent>
							<AiMessageMainPartAvatar {...props} />
						</Message>
						<AiMessageFooterPartAction {...props} />
					</div>
				))}
			</BranchMessages>
		</Branch>
	);
}
