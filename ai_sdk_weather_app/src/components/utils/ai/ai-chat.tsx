"use client";

import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import AiConversation from "@/components/utils/ai/ai-conversation";
import AiPromptInput from "@/components/utils/ai/ai-prompt-input";
import { ChatProvider } from "./_providers/chat-provider";

interface Model {
	name: string;
	value: string;
}

interface AiChatProps {
	disabledFile?: boolean;
	disabledwebSearch?: boolean;
	disabledModelSelect?: boolean;
	disabledAvatar?: boolean;
	models: Model[];
}

export default function AiChat({ ...props }: AiChatProps) {
	return (
		<div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
			<div className="flex flex-col h-full">
				<ChatProvider>
					<PromptInputProvider>
						<AiConversation {...props} />
						<AiPromptInput {...props} />
					</PromptInputProvider>
				</ChatProvider>
			</div>
		</div>
	);
}
