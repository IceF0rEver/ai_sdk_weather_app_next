import { ChatProvider } from "@/components/utils/ai/_providers/chat-provider";
import AiChat from "@/components/utils/ai/ai-chat";
import { AiToolWeather } from "./_components/_ai/_tools/ai-tool-weather";
import { AiToolWeathersList } from "./_components/_ai/_tools/ai-tool-weathers-list";

export default async function Page() {
	const models = [
		{
			name: "Mistral small",
			value: "mistral-small-latest",
		},
	];

	const tools = {
		"tool-getCurrentWeatherByLocation": { component: AiToolWeather },
		"tool-getCurrentWeatherByName": { component: AiToolWeather },
		"tool-getWeatherByName": { component: AiToolWeathersList },
		"tool-getWeatherByLocation": { component: AiToolWeathersList },
	};

	return (
		<ChatProvider models={models} tools={tools}>
			<AiChat disabledModelSelect disabledwebSearch />
		</ChatProvider>
	);
}
