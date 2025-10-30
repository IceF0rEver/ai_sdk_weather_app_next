"use client";

import type * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
	utilitie?: "subscription";
};

function Calendar({ className, classNames, utilitie, showOutsideDays = true, ...props }: CalendarProps) {
	return (
		<DayPicker
			fixedWeeks
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-2",
				month: cn("flex flex-col gap-4", utilitie === "subscription" && "w-full"),
				caption: "flex justify-center pt-1 relative items-center w-full",
				caption_label: "text-sm font-medium",
				nav: "flex items-center gap-1",
				nav_button: cn(
					buttonVariants({ variant: "outline" }),
					"size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
				),
				nav_button_previous: "absolute left-1",
				nav_button_next: "absolute right-1",
				table: cn("w-full border-collapse space-x-1", utilitie === "subscription" && "mt-4"),
				head_row: "flex",
				head_cell: cn(
					"text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
					utilitie === "subscription" && "w-full",
				),
				row: cn("flex w-full mt-2", utilitie === "subscription" && "mt-2 w-full flex gap-1"),
				cell: cn(
					"relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary [&:has([aria-selected].day-range-end)]:rounded-r-md",
					props.mode === "range"
						? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
						: "[&:has([aria-selected])]:rounded-md",
					utilitie === "subscription" &&
						"size-full aspect-square relative border border-secondary rounded-md",
				),
				day: cn(
					buttonVariants({ variant: "calendar" }),
					"size-8 p-0 font-normal aria-selected:opacity-100",
					utilitie === "subscription" && "size-full aspect-square flex items-start justify-end",
				),
				day_range_start: "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
				day_range_end: "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
				day_selected: "bg-primary hover:bg-primary/50",
				day_today: "bg-primary/35",
				day_outside: "day-outside text-muted-foreground aria-selected:text-muted-foreground",
				day_disabled: "text-muted-foreground opacity-50",
				day_range_middle: "aria-selected:bg-primary aria-selected:text-accent-foreground",
				day_hidden: "invisible",
				...classNames,
			}}
			components={{
				IconLeft: ({ className, ...props }) => <ChevronLeft className={cn("size-4", className)} {...props} />,
				IconRight: ({ className, ...props }) => <ChevronRight className={cn("size-4", className)} {...props} />,
			}}
			{...props}
		/>
	);
}

export { Calendar };
