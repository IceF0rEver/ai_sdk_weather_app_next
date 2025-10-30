"use client";

import { GlobeIcon } from "lucide-react";
import {
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputButton,
	PromptInputModelSelect,
	PromptInputModelSelectContent,
	PromptInputModelSelectItem,
	PromptInputModelSelectTrigger,
	PromptInputModelSelectValue,
} from "@/components/ai-elements/prompt-input";
import { useI18n } from "@/locales/client";
import { useChatContext } from "./_providers/chat-provider";

export function ToolBarInputActionMenu() {
	return (
		<PromptInputActionMenu>
			<PromptInputActionMenuTrigger />
			<PromptInputActionMenuContent>
				<PromptInputActionAddAttachments />
			</PromptInputActionMenuContent>
		</PromptInputActionMenu>
	);
}

export function ToolBarInputButton() {
	const { setWebSearch, webSearch } = useChatContext();
	const t = useI18n();
	return (
		<PromptInputButton variant={webSearch ? "default" : "ghost"} onClick={() => setWebSearch(!webSearch)}>
			<GlobeIcon size={16} />
			<span>{t("button.search")}</span>
		</PromptInputButton>
	);
}

export function ToolBarInputModelSelect() {
	const { setModel, model, models } = useChatContext();

	const currentModel = model || models[0]?.value;

	return (
		<PromptInputModelSelect onValueChange={(value) => setModel(value)} value={currentModel}>
			<PromptInputModelSelectTrigger>
				<PromptInputModelSelectValue />
			</PromptInputModelSelectTrigger>

			<PromptInputModelSelectContent>
				{models.map((m) => (
					<PromptInputModelSelectItem key={m.value} value={m.value}>
						{m.name}
					</PromptInputModelSelectItem>
				))}
			</PromptInputModelSelectContent>
		</PromptInputModelSelect>
	);
}
