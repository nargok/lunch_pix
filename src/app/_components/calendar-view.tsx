"use client";

import { useState } from "react";

interface LunchBox {
	id: string;
	title: string;
	date: string;
	imageUrl: string;
	memo?: string;
	tags: string[];
}

interface CalendarViewProps {
	lunchBoxes: LunchBox[];
}

export function CalendarView({ lunchBoxes }: CalendarViewProps) {
	const [currentDate, setCurrentDate] = useState(new Date());

	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	// Get first day of month and number of days
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
	const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
	const daysInMonth = lastDayOfMonth.getDate();
	const startingDayOfWeek = firstDayOfMonth.getDay();

	// Create lunch boxes map by date
	const lunchBoxesByDate = new Map<string, LunchBox>();
	lunchBoxes.forEach((lunch) => {
		lunchBoxesByDate.set(lunch.date, lunch);
	});

	// Generate calendar days
	const calendarDays = [];

	// Add empty cells for days before month starts
	for (let i = 0; i < startingDayOfWeek; i++) {
		calendarDays.push(null);
	}

	// Add days of current month
	for (let day = 1; day <= daysInMonth; day++) {
		const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
		calendarDays.push({
			day,
			dateString,
			lunchBox: lunchBoxesByDate.get(dateString),
		});
	}

	const monthNames = [
		"1月",
		"2月",
		"3月",
		"4月",
		"5月",
		"6月",
		"7月",
		"8月",
		"9月",
		"10月",
		"11月",
		"12月",
	];

	const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
	};

	const goToToday = () => {
		setCurrentDate(new Date());
	};

	return (
		<div className="bg-white">
			{/* Calendar Header */}
			<div className="flex items-center justify-between border-gray-200 border-b p-4">
				<button
					type="button"
					onClick={goToPreviousMonth}
					className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
					aria-label="前の月"
				>
					<svg
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<div className="flex items-center space-x-4">
					<h2 className="font-semibold text-gray-900 text-lg">
						{currentYear}年 {monthNames[currentMonth]}
					</h2>
					<button
						type="button"
						onClick={goToToday}
						className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
					>
						今日
					</button>
				</div>

				<button
					type="button"
					onClick={goToNextMonth}
					className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
					aria-label="次の月"
				>
					<svg
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			{/* Day Names Header */}
			<div className="grid grid-cols-7 border-gray-200 border-b">
				{dayNames.map((dayName, index) => (
					<div
						key={dayName}
						className={`p-3 text-center font-medium text-sm ${
							index === 0
								? "text-red-600"
								: index === 6
									? "text-blue-600"
									: "text-gray-700"
						}`}
					>
						{dayName}
					</div>
				))}
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7">
				{calendarDays.map((dayData, index) => (
					<div
						key={index}
						className="relative aspect-square border-gray-200 border-r border-b p-2"
					>
						{dayData && (
							<>
								<div
									className={`text-sm ${
										index % 7 === 0
											? "text-red-600"
											: index % 7 === 6
												? "text-blue-600"
												: "text-gray-900"
									}`}
								>
									{dayData.day}
								</div>

								{dayData.lunchBox && (
									<div className="mt-1">
										<div
											className="group cursor-pointer rounded bg-blue-100 p-1"
											title={`${dayData.lunchBox.title}${dayData.lunchBox.memo ? ` - ${dayData.lunchBox.memo}` : ""}`}
										>
											<div className="flex items-center space-x-1">
												<div className="h-2 w-2 rounded-full bg-blue-500"></div>
												<div className="truncate text-blue-800 text-xs">
													{dayData.lunchBox.title}
												</div>
											</div>

											{/* Hover tooltip */}
											<div className="invisible absolute top-full left-0 z-10 mt-1 w-48 rounded-lg bg-gray-900 p-2 text-white text-xs shadow-lg group-hover:visible">
												<div className="font-semibold">
													{dayData.lunchBox.title}
												</div>
												{dayData.lunchBox.memo && (
													<div className="mt-1 text-gray-300">
														{dayData.lunchBox.memo}
													</div>
												)}
												<div className="mt-1 flex flex-wrap gap-1">
													{dayData.lunchBox.tags.map((tag) => (
														<span
															key={tag}
															className="rounded bg-blue-600 px-1 py-0.5 text-xs"
														>
															{tag}
														</span>
													))}
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Today indicator */}
								{dayData.dateString ===
									new Date().toISOString().split("T")[0] && (
									<div className="absolute right-1 bottom-1">
										<div className="h-2 w-2 rounded-full bg-red-500"></div>
									</div>
								)}
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
