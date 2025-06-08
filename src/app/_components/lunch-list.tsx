"use client";

import { useState } from "react";
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
    tags: ["和風", "冷凍なし", "手作り"]
  },
  {
    id: "2", 
    title: "オムライス弁当",
    date: "2024-12-06",
    imageUrl: "/placeholder-lunch2.jpg",
    memo: "子供のリクエスト",
    tags: ["洋風", "卵料理"]
  },
  {
    id: "3",
    title: "鮭おにぎり＆野菜炒め",
    date: "2024-12-05",
    imageUrl: "/placeholder-lunch3.jpg",
    tags: ["和風", "作り置き"]
  },
  {
    id: "4",
    title: "ハンバーグ弁当",
    date: "2024-12-04",
    imageUrl: "/placeholder-lunch4.jpg",
    memo: "手作りハンバーグで栄養満点",
    tags: ["洋風", "手作り"]
  },
  {
    id: "5",
    title: "野菜たっぷり弁当",
    date: "2024-12-03",
    imageUrl: "/placeholder-lunch5.jpg",
    tags: ["ヘルシー", "野菜多め"]
  },
  {
    id: "6",
    title: "チキン南蛮弁当",
    date: "2024-12-02",
    imageUrl: "/placeholder-lunch6.jpg",
    memo: "タルタルソースも手作り",
    tags: ["揚げ物", "手作り"]
  }
];

export function LunchList() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return <LunchRegister onBack={() => setShowRegister(false)} />;
  }

  const allTags = Array.from(new Set(mockLunchBoxes.flatMap(lunch => lunch.tags)));
  
  const filteredLunches = selectedTag 
    ? mockLunchBoxes.filter(lunch => lunch.tags.includes(selectedTag))
    : mockLunchBoxes;

  const currentMonth = new Date().getMonth() + 1;
  const monthlyCount = mockLunchBoxes.filter(lunch => {
    const lunchMonth = new Date(lunch.date).getMonth() + 1;
    return lunchMonth === currentMonth;
  }).length;

  const streak = 5; // Mock streak counter

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">お弁当ギャラリー</h1>
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{monthlyCount}</div>
              <div className="text-sm text-gray-600">今月の弁当数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{streak}</div>
              <div className="text-sm text-gray-600">連続記録日数</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === null 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              すべて
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLunches.map(lunch => (
            <div key={lunch.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  📷 {lunch.title}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{lunch.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{lunch.date}</p>
                {lunch.memo && (
                  <p className="text-sm text-gray-700 mb-2">{lunch.memo}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {lunch.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
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

      {/* Add Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setShowRegister(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Mobile Add Button */}
      <div className="bg-white border-t border-gray-200 p-4 md:hidden">
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