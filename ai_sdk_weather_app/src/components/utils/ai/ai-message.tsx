"use client";

import { BotMessageSquare } from "lucide-react";
import { Branch, BranchMessages } from "@/components/ai-elements/branch";
import { Loader } from "@/components/ai-elements/loader";
import {
	Message,
	MessageAvatar,
	MessageContent,
} from "@/components/ai-elements/message";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "@/lib/auth/auth-client";
import { useChatContext } from "./_providers/chat-provider";
import type { MyUIMessage } from "./_types/types";
import { AiMessageFooterPartAction } from "./ai-message-part-footer";
import {
	AiMessageHeaderPartFile,
	AiMessageHeaderPartReasoning,
	AiMessageHeaderPartSources,
} from "./ai-message-part-header";
import { AiMessageMainPart } from "./ai-message-part-main";

interface AiMessageProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

interface AiMessageAvatarProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

export function AiMessageAvatar({ ...props }: AiMessageAvatarProps) {
	const { data: session } = useSession();

	return !props.disabledAvatar ? (
		props.message.role === "user" ? (
			<MessageAvatar
				name={session?.user.name?.slice(0, 2).toUpperCase() ?? ""}
				src={session?.user.image ?? ""}
			/>
		) : (
			<Avatar className="flex justify-center items-center size-8 ring-1 ring-border bg-muted">
				<BotMessageSquare />
			</Avatar>
		)
	) : null;
}

export function AiMessage({ ...props }: AiMessageProps) {
	const { setCurrentBranchId, editingMessageId, messages, status } =
		useChatContext();

	const allMessagesByBranch = [
		props.message,
		...messages.filter(
			(msg) =>
				props.message.metadata?.parentMessageId ===
					msg.metadata?.parentMessageId &&
				props.message.metadata?.branchId !== msg.metadata?.branchId,
		),
	].sort((a, b) => (a.metadata?.createdAt ?? 0) - (b.metadata?.createdAt ?? 0));

	const currentIndex = allMessagesByBranch.findIndex(
		(msg) => msg.id === props.message.id,
	);

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
				{allMessagesByBranch.map((message, i) => {
					return (
						<div key={`${message.id}-${i}`} className="grid gap-2">
							{message.parts.some((part) => part.type === "text") ||
							status === "streaming" ||
							status === "submitted" ? (
								<>
									<AiMessageHeaderPartReasoning {...props} />
									<AiMessageHeaderPartSources {...props} />
									<AiMessageHeaderPartFile {...props} />

									<Message from={message.role} className="p-1 overflow-auto">
										<MessageContent
											variant={
												message.id === editingMessageId
													? "editing"
													: "contained"
											}
										>
											{message.parts.some((part) => part.type === "text") ? (
												<AiMessageMainPart message={message} />
											) : (
												(status === "streaming" || status === "submitted") && (
													<Loader />
												)
											)}
										</MessageContent>
										<AiMessageAvatar {...props} />
									</Message>

									<AiMessageFooterPartAction {...props} />
								</>
							) : null}
						</div>
					);
				})}
			</BranchMessages>
		</Branch>
	);
}
