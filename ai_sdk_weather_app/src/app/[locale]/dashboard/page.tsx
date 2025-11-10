import { ChatProvider } from "@/components/utils/ai/_providers/chat-provider";
import AiChat from "@/components/utils/ai/ai-chat";

export default async function Page() {
	const models = [
		{
			name: "Mistral small",
			value: "mistral-small-latest",
		},
	];

	return (
		<ChatProvider models={models}>
			<AiChat disabledFile disabledModelSelect disabledwebSearch />
		</ChatProvider>
	);
}
