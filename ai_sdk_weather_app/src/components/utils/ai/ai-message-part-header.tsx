"use client";

import type { ReasoningUIPart } from "ai";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Image } from "@/components/ai-elements/image";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MyUIMessage } from "./_types/types";
import { Attachment, AttachmentInfo, AttachmentPreview, Attachments } from "@/components/ai-elements/attachments";

interface AiMessageProps {
	message: MyUIMessage;
}

export function AiMessageHeaderPartSources({ message }: AiMessageProps) {
	const sourceParts = message.parts.filter((part) => part.type === "source-url");
	if (sourceParts.length === 0) return null;

	return (
		<Sources className={cn(message.role !== "user" ? "justify-start" : "justify-end", "flex m-0")}>
			<SourcesTrigger count={sourceParts.length} />
			{sourceParts.map((part, i) => (
				<SourcesContent key={`${message.id}-${i}`}>
					<Source href={part.url} title={part.url} />
				</SourcesContent>
			))}
		</Sources>
	);
}

export function AiMessageHeaderPartReasoning({ message }: AiMessageProps) {
	const reasoningPart = message.parts.find((part) => part.type === "reasoning") as ReasoningUIPart;

	return reasoningPart?.text ? (
		<Reasoning
			className={cn("w-full")}
			isStreaming={reasoningPart.state === "streaming"}
			duration={message.metadata?.reasoningDuration}
		>
			<ReasoningTrigger />
			<ReasoningContent>{reasoningPart.text}</ReasoningContent>
		</Reasoning>
	) : null;
}

export function AiMessageHeaderPartFile({ message }: AiMessageProps) {
	const [showAll, setShowAll] = useState(false);

	const files = useMemo(
		() =>
			message.parts
				.filter((part) => part.type === "file")
				.map((part, index) => ({
					...part,
					id: `${message.id}-${index}`,
				})),
		[message],
	);

	if (files.length === 0) return null;

	const displayedFiles = showAll ? files : files.slice(0, 1);

	return (
		<div className={cn(message.role !== "user" ? "justify-start" : "justify-end", "flex items-center gap-1")}>
			<Attachments variant="grid">
				{displayedFiles.map((file) => (
					<Attachment key={file.id} data={file}>
						<AttachmentPreview />
						<AttachmentInfo />
					</Attachment>
				))}
			</Attachments>

			{files.length > 1 && (
				<Button
					type="button"
					variant="ghost"
					size={"icon"}
					className="cursor-pointer h-full"
					onClick={() => setShowAll((prev) => !prev)}
				>
					{showAll ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</Button>
			)}
		</div>
	);
}
