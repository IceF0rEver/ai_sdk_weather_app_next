import { ChatProvider } from "@/components/utils/ai/_providers/chat-provider";
import AiChat from "@/components/utils/ai/ai-chat";

export default async function Page() {
	const models = [
		{
			name: "Mistral small",
			value: "mistral-small-latest",
		},
		{
			name: "Mistral 3b",
			value: "ministral-3b-latest",
		},
		{
			name: "Pixtral",
			value: "pixtral-large-latest",
		},
		{
			name: "Magistral",
			value: "magistral-small-2506",
		},
	];

	return (
		<ChatProvider models={models}>
			<AiChat />
		</ChatProvider>
	);
}
