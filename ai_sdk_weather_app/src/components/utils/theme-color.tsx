"use client";

import { useTheme } from "next-themes";
import { useThemeContext } from "@/components/providers/theme-color-provider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import type { ThemeColors } from "@/types/theme-types";

export default function ThemeColor() {
	const { themeColor, setThemeColor } = useThemeContext();
	const { theme } = useTheme();
	const t = useI18n();

	const availableThemeColors = [
		{
			name: t("components.utils.themeColor.color.default"),
			key: "Default",
			light: "bg-zinc-900",
			dark: "bg-zinc-700",
		},
		{
			name: t("components.utils.themeColor.color.red"),
			key: "Red",
			light: "bg-red-600",
			dark: "bg-red-700",
		},
		{
			name: t("components.utils.themeColor.color.rose"),
			key: "Rose",
			light: "bg-rose-600",
			dark: "bg-rose-700",
		},
		{
			name: t("components.utils.themeColor.color.orange"),
			key: "Orange",
			light: "bg-orange-600",
			dark: "bg-orange-700",
		},
		{
			name: t("components.utils.themeColor.color.green"),
			key: "Green",
			light: "bg-green-600",
			dark: "bg-green-700",
		},
		{
			name: t("components.utils.themeColor.color.blue"),
			key: "Blue",
			light: "bg-blue-600",
			dark: "bg-blue-700",
		},
		{
			name: t("components.utils.themeColor.color.yellow"),
			key: "Yellow",
			light: "bg-yellow-500",
			dark: "bg-yellow-600",
		},
		{
			name: t("components.utils.themeColor.color.violet"),
			key: "Violet",
			light: "bg-violet-600",
			dark: "bg-violet-700",
		},
	];

	return (
		<Select
			onValueChange={(value) => setThemeColor(value as ThemeColors)}
			defaultValue={themeColor}
		>
			<SelectTrigger>
				<SelectValue
					placeholder={t("components.utils.themeColor.placeholder")}
				/>
			</SelectTrigger>
			<SelectContent>
				{availableThemeColors.map(({ name, key, light, dark }) => (
					<SelectItem key={name} value={key}>
						<div className="flex flex-row gap-2">
							<span
								className={cn(
									"rounded-full",
									"w-[20px]",
									"h-[20px]",
									theme === "light" ? light : dark,
								)}
							/>
							<span>{name}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
