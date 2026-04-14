"use client";

import type { ReasoningUIPart } from "ai";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import { useState } from "react";
import { Image } from "@/components/ai-elements/image";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MyUIMessage } from "./_types/types";

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
	const filtredMessages = message.parts.filter((part) => part.type === "file");

	const [showAll, setShowAll] = useState(false);

	const handleShowAll = () => setShowAll((prev) => !prev);

	if (filtredMessages.length === 0) return null;

	const messagesToShow = showAll ? filtredMessages : filtredMessages.slice(0, 1);

	return (
		<div
			className={cn(
				message.role !== "user" ? "justify-start" : "justify-end",
				"flex flex-nowrap gap-1 items-center",
			)}
		>
			<div className="flex gap-1 flex-wrap justify-evenly">
				{messagesToShow.map((msg) => {
					if (msg.mediaType?.startsWith("image")) {
						return (
							<Image
								key={`${message.id}-${msg.url.slice(-8)}`}
								base64={msg.url.split(",")[1]}
								mediaType={msg.mediaType}
								uint8Array={new Uint8Array([])}
								className="h-[250px]"
							/>
						);
					} else {
						const condensedFileName = `${msg.filename?.slice(0, 3)}...${msg.filename?.split(".")[0].slice(-2)}.${msg.filename?.split(".")[1]}`;
						return (
							<Badge
								variant={message.role !== "user" ? "default" : "secondary"}
								key={`${message.id}-${msg.filename}`}
							>
								<FileIcon />
								<span>{condensedFileName}</span>
							</Badge>
						);
					}
				})}
			</div>
			{filtredMessages.length > 1 && (
				<Button
					type="button"
					variant={"ghost"}
					size={"icon-sm"}
					className="cursor-pointer"
					onClick={handleShowAll}
				>
					{showAll ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</Button>
			)}
		</div>
	);
}
