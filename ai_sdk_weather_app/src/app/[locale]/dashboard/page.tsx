import AiChat from "@/components/utils/ai/ai-chat";

export default async function Page() {
	const models = [
		{
			name: "Pixtral",
			value: "pixtral-large-latest",
		},
		{
			name: "Mistral 3b",
			value: "ministral-3b-latest",
		},
		{
			name: "Magistral",
			value: "magistral-small-2506",
		},
	];

	return <AiChat models={models} />;
}
