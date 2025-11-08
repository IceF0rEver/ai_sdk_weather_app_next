"use client";

import type { ReasoningUIPart } from "ai";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Image } from "@/components/ai-elements/image";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "./_providers/chat-provider";
import type { MyUIMessage } from "./_types/types";

interface AiMessageHeaderPartProps {
	message: MyUIMessage;
}

interface AiMessageHeaderPartFileProps
	extends Pick<AiMessageHeaderPartProps, "message"> {}

export function AiMessageHeaderPartSources({
	...props
}: AiMessageHeaderPartProps) {
	return (
		props.message.parts.filter((part) => part.type === "source-url").length >
			0 && (
			<Sources
				className={cn(
					props.message.role !== "user" ? "justify-start" : "justify-end",
					"flex m-0",
				)}
			>
				<SourcesTrigger
					count={
						props.message.parts.filter((part) => part.type === "source-url")
							.length
					}
				/>
				{props.message.parts
					.filter((part) => part.type === "source-url")
					.map((part, i) => (
						<SourcesContent key={`${props.message.id}-${i}`}>
							<Source
								key={`${props.message.id}-${i}`}
								href={part.url}
								title={part.url}
							/>
						</SourcesContent>
					))}
			</Sources>
		)
	);
}

export function AiMessageHeaderPartReasoning({
	...props
}: AiMessageHeaderPartProps) {
	const { status } = useChatContext();

	const reasoningPart = props.message.parts.find(
		(part) => part.type === "reasoning",
	) as ReasoningUIPart;

	return reasoningPart?.text ? (
		<Reasoning
			className={cn("w-full", status === "streaming" && "animate-pulse")}
			isStreaming={reasoningPart.state === "streaming"}
			duration={props.message.metadata?.reasoningDuration}
		>
			<ReasoningTrigger />
			<ReasoningContent>{reasoningPart.text}</ReasoningContent>
		</Reasoning>
	) : null;
}

export function AiMessageHeaderPartFile({
	...props
}: AiMessageHeaderPartFileProps) {
	const filtredMessages = props.message.parts.filter(
		(part) => part.type === "file",
	);

	const [showAll, setShowAll] = useState(false);

	const handleShowAll = () => setShowAll((prev) => !prev);

	if (filtredMessages.length === 0) return null;

	const messagesToShow = showAll
		? filtredMessages
		: filtredMessages.slice(0, 1);

	return (
		<div
			className={cn(
				props.message.role !== "user" ? "justify-start" : "justify-end",
				"flex flex-nowrap gap-1 items-center",
			)}
		>
			<div className="flex gap-1 flex-wrap justify-evenly">
				{messagesToShow.map((msg) => {
					if (msg.mediaType?.startsWith("image")) {
						return (
							<Image
								key={nanoid()}
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
								variant={
									props.message.role !== "user" ? "default" : "secondary"
								}
								key={nanoid()}
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
