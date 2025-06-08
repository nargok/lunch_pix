"use client";

import { useState } from "react";

export function LunchRegister({ onBack }: { onBack: () => void }) {
	const [title, setTitle] = useState("");
	const [memo, setMemo] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const addTag = () => {
		const tag = tagInput.trim();
		if (tag && !tags.includes(tag)) {
			setTags([...tags, tag]);
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement actual submission logic
		console.log({
			title,
			memo,
			tags,
			date,
			imageFile,
		});
		// Mock success - go back to list
		onBack();
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="border-gray-200 border-b bg-white p-4">
				<div className="mx-auto flex max-w-2xl items-center">
					<button
						onClick={onBack}
						className="mr-4 p-2 text-gray-600 hover:text-gray-900"
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
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<h1 className="font-bold text-gray-900 text-xl">弁当を記録</h1>
				</div>
			</div>

			{/* Form */}
			<div className="mx-auto max-w-2xl p-4">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Photo Upload */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<label className="mb-3 block font-medium text-gray-700 text-sm">
							写真 *
						</label>
						<div className="rounded-lg border-2 border-gray-300 border-dashed p-6 text-center">
							{imagePreview ? (
								<div className="relative">
									<img
										src={imagePreview}
										alt="Preview"
										className="mx-auto h-64 max-w-full rounded-lg object-cover"
									/>
									<button
										type="button"
										onClick={() => {
											setImageFile(null);
											setImagePreview(null);
										}}
										className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
										aria-label="写真を削除"
									>
										<svg
											className="h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</button>
								</div>
							) : (
								<div>
									<svg
										className="mx-auto h-12 w-12 text-gray-400"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 48 48"
									>
										<path
											d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									<div className="mt-2">
										<label htmlFor="file-upload" className="cursor-pointer">
											<span className="mt-2 block font-medium text-gray-900 text-sm">
												クリックして写真を選択
											</span>
											<input
												id="file-upload"
												name="file-upload"
												type="file"
												accept="image/*"
												className="sr-only"
												onChange={handleImageChange}
											/>
										</label>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Date */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<label
							htmlFor="date"
							className="mb-3 block font-medium text-gray-700 text-sm"
						>
							日付 *
						</label>
						<input
							type="date"
							id="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Title */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<label
							htmlFor="title"
							className="mb-3 block font-medium text-gray-700 text-sm"
						>
							タイトル *
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="例：からあげ＆ひじき"
							className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					{/* Memo */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<label
							htmlFor="memo"
							className="mb-3 block font-medium text-gray-700 text-sm"
						>
							メモ
						</label>
						<textarea
							id="memo"
							value={memo}
							onChange={(e) => setMemo(e.target.value)}
							placeholder="今日の弁当について..."
							rows={3}
							className="w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Tags */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<label className="mb-3 block font-medium text-gray-700 text-sm">
							タグ
						</label>
						<div className="mb-3 flex gap-2">
							<input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								placeholder="例：和風、冷凍なし、作り置き"
								className="flex-1 rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
								onKeyPress={(e) =>
									e.key === "Enter" && (e.preventDefault(), addTag())
								}
							/>
							<button
								type="button"
								onClick={addTag}
								className="rounded-lg bg-gray-200 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-300"
							>
								追加
							</button>
						</div>
						{tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<span
										key={tag}
										className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm"
									>
										{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="text-blue-600 hover:text-blue-800"
											aria-label={`${tag}タグを削除`}
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					{/* Submit Button */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<button
							type="submit"
							disabled={!title || !imageFile}
							className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
						>
							記録する
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
