"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReviewTypeFilterProps {
  activeType: string;
  onTypeChange: (type: string) => void;
  stats?: any;
}

const reviewTypes = [
  { id: "all", label: "All Reviews", emoji: "📝", color: "bg-gray-500" },
  { id: "videogame", label: "Games", emoji: "🎮", color: "bg-purple-500" },
  {
    id: "boardgame",
    label: "Board Games",
    emoji: "🎲",
    color: "bg-orange-500",
  },
  { id: "movie", label: "Movies", emoji: "🎬", color: "bg-red-500" },
  { id: "tvseries", label: "TV Series", emoji: "📺", color: "bg-blue-500" },
  { id: "anime", label: "Anime", emoji: "🍥", color: "bg-pink-500" },
  { id: "book", label: "Books", emoji: "📚", color: "bg-green-500" },
  { id: "comic", label: "Comics", emoji: "📖", color: "bg-yellow-500" },
  { id: "gadget", label: "Tech", emoji: "📱", color: "bg-gray-600" },
];

export default function ReviewTypeFilter({
  activeType,
  onTypeChange,
  stats,
}: ReviewTypeFilterProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-foreground mb-4 font-mono">
        FILTER BY TYPE
      </h3>
      <div className="flex flex-wrap gap-3">
        {reviewTypes.map((type) => {
          const count =
            type.id === "all"
              ? stats?.totalReviews
              : stats?.reviewsByType?.[type.id + "s"] || 0;

          const isActive = activeType === type.id;

          return (
            <Button
              key={type.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onTypeChange(type.id)}
              className={`
                font-mono text-sm transition-all duration-200
                ${isActive ? "scale-105" : "hover:scale-105"}
              `}
            >
              <span className="mr-2">{type.emoji}</span>
              {type.label}
              {count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
