"use client";

import { useState } from "react";
import { CalendarView } from "./calendar-view";
import { LunchRegister } from "./lunch-register";

interface LunchBox {
	id: string;
	title: string;
	date: string;
	imageUrl: string;
	memo?: string;
	tags: string[];
}

const mockLunchBoxes: LunchBox[] = [
	{
		id: "1",
		title: "からあげ＆ひじき",
		date: "2024-12-07",
		imageUrl: "/placeholder-lunch1.jpg",
		memo: "今日は冷凍食品なしで頑張りました！",
		tags: ["和風", "冷凍なし", "手作り"],
	},
	{
		id: "2",
		title: "オムライス弁当",
		date: "2024-12-06",
		imageUrl: "/placeholder-lunch2.jpg",
		memo: "子供のリクエスト",
		tags: ["洋風", "卵料理"],
	},
	{
		id: "3",
		title: "鮭おにぎり＆野菜炒め",
		date: "2024-12-05",
		imageUrl: "/placeholder-lunch3.jpg",
		tags: ["和風", "作り置き"],
	},
	{
		id: "4",
		title: "ハンバーグ弁当",
		date: "2024-12-04",
		imageUrl: "/placeholder-lunch4.jpg",
		memo: "手作りハンバーグで栄養満点",
		tags: ["洋風", "手作り"],
	},
	{
		id: "5",
		title: "野菜たっぷり弁当",
		date: "2024-12-03",
		imageUrl: "/placeholder-lunch5.jpg",
		tags: ["ヘルシー", "野菜多め"],
	},
	{
		id: "6",
		title: "チキン南蛮弁当",
		date: "2024-12-02",
		imageUrl: "/placeholder-lunch6.jpg",
		memo: "タルタルソースも手作り",
		tags: ["揚げ物", "手作り"],
	},
];

export function LunchList() {
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [showRegister, setShowRegister] = useState(false);
	const [currentView, setCurrentView] = useState<"list" | "calendar">("list");

	if (showRegister) {
		return <LunchRegister onBack={() => setShowRegister(false)} />;
	}

	const allTags = Array.from(
		new Set(mockLunchBoxes.flatMap((lunch) => lunch.tags)),
	);

	const filteredLunches = selectedTag
		? mockLunchBoxes.filter((lunch) => lunch.tags.includes(selectedTag))
		: mockLunchBoxes;

	const currentMonth = new Date().getMonth() + 1;
	const monthlyCount = mockLunchBoxes.filter((lunch) => {
		const lunchMonth = new Date(lunch.date).getMonth() + 1;
		return lunchMonth === currentMonth;
	}).length;

	const streak = 5; // Mock streak counter

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header Stats */}
			<div className="border-gray-200 border-b bg-white p-4">
				<div className="mx-auto max-w-4xl">
					<h1 className="mb-4 font-bold text-2xl text-gray-900">
						お弁当ギャラリー
					</h1>
					<div className="flex justify-around text-center">
						<div>
							<div className="font-bold text-2xl text-blue-600">
								{monthlyCount}
							</div>
							<div className="text-gray-600 text-sm">今月の弁当数</div>
						</div>
						<div>
							<div className="font-bold text-2xl text-green-600">{streak}</div>
							<div className="text-gray-600 text-sm">連続記録日数</div>
						</div>
					</div>
				</div>
			</div>

			{/* Tab Navigation */}
			<div className="border-gray-200 border-b bg-white p-4">
				<div className="mx-auto max-w-4xl">
					<div className="mb-4 flex space-x-1 rounded-lg bg-gray-100 p-1">
						<button
							type="button"
							onClick={() => setCurrentView("list")}
							className={`flex-1 rounded-md px-3 py-2 font-medium text-sm transition-colors ${
								currentView === "list"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							📱 写真一覧
						</button>
						<button
							type="button"
							onClick={() => setCurrentView("calendar")}
							className={`flex-1 rounded-md px-3 py-2 font-medium text-sm transition-colors ${
								currentView === "calendar"
									? "bg-white text-gray-900 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							🗓️ カレンダー
						</button>
					</div>

					{/* Tag Filter - only show in list view */}
					{currentView === "list" && (
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => setSelectedTag(null)}
								className={`rounded-full px-3 py-1 text-sm ${
									selectedTag === null
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								すべて
							</button>
							{allTags.map((tag) => (
								<button
									type="button"
									key={tag}
									onClick={() => setSelectedTag(tag)}
									className={`rounded-full px-3 py-1 text-sm ${
										selectedTag === tag
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									{tag}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Content Area */}
			<div className="mx-auto max-w-4xl">
				{currentView === "list" ? (
					<div className="p-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{filteredLunches.map((lunch) => (
								<div
									key={lunch.id}
									className="overflow-hidden rounded-lg bg-white shadow-md"
								>
									<div className="relative aspect-square bg-gray-200">
										<div className="absolute inset-0 flex items-center justify-center text-gray-500">
											📷 {lunch.title}
										</div>
									</div>
									<div className="p-4">
										<h3 className="mb-1 font-semibold text-gray-900">
											{lunch.title}
										</h3>
										<p className="mb-2 text-gray-600 text-sm">{lunch.date}</p>
										{lunch.memo && (
											<p className="mb-2 text-gray-700 text-sm">{lunch.memo}</p>
										)}
										<div className="flex flex-wrap gap-1">
											{lunch.tags.map((tag) => (
												<span
													key={tag}
													className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs"
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<CalendarView lunchBoxes={mockLunchBoxes} />
				)}
			</div>

			{/* Add Button */}
			<div className="fixed right-6 bottom-6">
				<button
					type="button"
					onClick={() => setShowRegister(true)}
					className="rounded-full bg-blue-500 p-4 text-white shadow-lg transition-colors hover:bg-blue-600"
					aria-label="弁当を記録"
				>
					<svg
						className="h-6 w-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Add Button */}
			<div className="border-gray-200 border-t bg-white p-4 md:hidden">
				<button
					type="button"
					onClick={() => setShowRegister(true)}
					className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
				>
					+ 弁当を記録
				</button>
			</div>
		</div>
	);
}
