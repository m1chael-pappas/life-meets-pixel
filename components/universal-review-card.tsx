import { formatDistanceToNow } from 'date-fns';
import { type SanityDocument } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import PixelHeartRating from '@/components/ui/pixel-heart-rating';
import { Genre } from '@/lib/types';

interface UniversalReviewCardProps {
  review: SanityDocument;
  priority?: boolean;
  className?: string;
}

const getItemTypeInfo = (itemType: string) => {
  const typeMap = {
    videogame: { emoji: "🎮", label: "Game", color: "bg-purple-500" },
    boardgame: { emoji: "🎲", label: "Board Game", color: "bg-orange-500" },
    movie: { emoji: "🎬", label: "Movie", color: "bg-red-500" },
    tvseries: { emoji: "📺", label: "TV Series", color: "bg-blue-500" },
    anime: { emoji: "🍥", label: "Anime", color: "bg-pink-500" },
    book: { emoji: "📚", label: "Book", color: "bg-green-500" },
    comic: { emoji: "📖", label: "Comic", color: "bg-yellow-500" },
    gadget: { emoji: "📱", label: "Tech", color: "bg-gray-500" },
  };
  return (
    typeMap[itemType as keyof typeof typeMap] || {
      emoji: "📦",
      label: "Item",
      color: "bg-gray-400",
    }
  );
};

// const getBadgeVariant = (
//   color?: string
// ): "default" | "secondary" | "outline" | "destructive" => {
//   if (!color) return "default";

//   const colorMap: {
//     [key: string]: "default" | "secondary" | "outline" | "destructive";
//   } = {
//     "#975af9": "default",
//     "#81f5c6": "secondary",
//     "#ffee93": "outline",
//     "#ad79fa": "default",
//   };

//   return colorMap[color] || "default";
// };

const getAuthorInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function UniversalReviewCard({
  review,
  priority = false,
  className = "",
}: UniversalReviewCardProps) {
  const {
    title,
    slug,
    reviewScore,
    summary,
    publishedAt,
    featured,
    reviewableItem,
    author,
  } = review;

  if (!reviewableItem || !slug?.current) {
    return null;
  }
  const typeInfo = getItemTypeInfo(reviewableItem.itemType);
  const relativeDate = formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
  });

  return (
    <Link href={`/reviews/${slug.current}`} className="block group h-full">
      <Card
        className={`
          overflow-hidden transition-all duration-300
          hover:shadow-lg hover:scale-[1.02]
          bg-card border border-border
          flex flex-col h-full
          ${featured ? "ring-2 ring-primary/20" : ""}
          ${className}
        `}
      >
        <CardHeader className="relative p-0">
          {/* Item Type Badge - Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <Badge
              className={`font-mono text-xs px-3 py-1 shadow-sm text-white border-none ${typeInfo.color}`}
            >
              {typeInfo.emoji} {typeInfo.label}
            </Badge>
          </div>

          {/* Featured Badge - Top Center (higher than hearts) */}
          {featured && (
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
              <Badge
                variant="default"
                className="bg-accent text-accent-foreground font-mono text-xs px-3 py-1 shadow-sm"
              >
                FEATURED
              </Badge>
            </div>
          )}

          {/* Rating - Top Right */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
              <PixelHeartRating
                reviewScore={reviewScore}
                size="sm"
                showScore={false}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden bg-muted">
            {reviewableItem.coverImage?.asset?.url ? (
              <>
                <Image
                  src={reviewableItem.coverImage.asset.url}
                  alt={
                    reviewableItem.coverImage.alt ||
                    `${reviewableItem.title} cover`
                  }
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-20">{typeInfo.emoji}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-1">
          {/* Date */}
          <time
            dateTime={publishedAt}
            className="text-sm text-muted-foreground font-mono mb-2 block"
          >
            {relativeDate}
          </time>

          {/* Review Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Item Title & Creator */}
          <div className="mb-3">
            <p className="text-sm text-primary font-medium group-hover:text-primary-alt transition-colors">
              {reviewableItem.title}
            </p>
            {reviewableItem.creator && (
              <p className="text-xs text-muted-foreground">
                by {reviewableItem.creator}
              </p>
            )}
          </div>

          {/* Summary */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-3">
            {summary}
          </p>

          {/* Genres */}
          {reviewableItem.genres && reviewableItem.genres.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {(reviewableItem.genres as Genre[]).map((genre) => (
                <Badge
                  key={genre.slug?.current || genre.title}
                  className="text-xs bg-secondary text-black border-none hover:bg-secondary/90 px-3 py-1.5"
                >
                  {genre.title}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 pt-0 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              {author.avatar?.asset.url ? (
                <AvatarImage
                  src={author.avatar.asset.url}
                  alt={author.avatar.alt || author.name}
                />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-mono">
                {getAuthorInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {author.name}
            </span>
          </div>

          {/* Score Display */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary font-mono">
              {reviewScore}
            </span>
            <span className="text-sm text-muted-foreground font-mono">/10</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
