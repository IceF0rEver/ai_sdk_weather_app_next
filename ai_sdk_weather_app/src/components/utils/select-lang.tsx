"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales/client";

interface SelectLangProps {
	className?: string;
}
export default function SelectLang({ className }: SelectLangProps) {
	const t = useI18n();
	const changeLocale = useChangeLocale();
	const currentLocale = useCurrentLocale();

	const langs = [
		{ key: "fr", label: t("components.utils.selectLang.fr") },
		{ key: "en", label: t("components.utils.selectLang.en") },
	];

	return (
		<div className={cn(className)}>
			<Select
				onValueChange={(value) => changeLocale(value as "fr" | "en")}
				value={currentLocale}
			>
				<SelectTrigger>
					<SelectValue placeholder={t("components.utils.selectLang.select")} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{langs?.map((item) => (
							<SelectItem key={item.key} value={item.key}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
