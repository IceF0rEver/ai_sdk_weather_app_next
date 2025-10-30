"use client";
import setGlobalColorTheme from "@/lib/theme-colors";
import { useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import type { ThemeColorsStateParams, ThemeColors } from "@/types/theme-types";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<ThemeColorsStateParams>({} as ThemeColorsStateParams);

export default function ThemeColorProvider({ children }: ThemeProviderProps) {
	const getSavedThemeColor = () => {
		try {
			return (localStorage.getItem("themeColor") as ThemeColors) || "Default";
		} catch {
			"Default" as ThemeColors;
		}
	};

	const [themeColor, setThemeColor] = useState<ThemeColors>(getSavedThemeColor() as ThemeColors);
	const [isMounted, setIsMounted] = useState(false);
	const { theme, systemTheme } = useTheme();

	useEffect(() => {
		localStorage.setItem("themeColor", themeColor);
		if (theme === "system") {
			setGlobalColorTheme(systemTheme as "light" | "dark", themeColor);
		} else {
			setGlobalColorTheme(theme as "light" | "dark", themeColor);
		}

		if (!isMounted) {
			setIsMounted(true);
		}
	}, [themeColor, theme]);

	if (!isMounted) {
		return null;
	}

	return <ThemeContext.Provider value={{ themeColor, setThemeColor }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
	return useContext(ThemeContext);
}
