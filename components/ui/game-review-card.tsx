import React from 'react';

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

// Types based on your Sanity schema
interface Author {
  name: string;
  slug: {
    current: string;
  };
  avatar?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

interface Game {
  title: string;
  slug: {
    current: string;
  };
  coverImage: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

interface Category {
  title: string;
  slug: {
    current: string;
  };
  color?: string;
}

interface GameReview {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  game: Game;
  reviewScore: number;
  summary: string;
  publishedAt: string;
  author: Author;
  categories?: Category[];
  featured?: boolean;
}

interface GameReviewCardProps {
  review: SanityDocument; // Changed from GameReview to SanityDocument
  priority?: boolean;
  className?: string;
}

const GameReviewCard: React.FC<GameReviewCardProps> = ({
  review,
  priority = false,
  className = "",
}) => {
  const {
    title,
    slug,
    game,
    reviewScore,
    summary,
    publishedAt,
    author,
    categories = [],
    featured = false,
  } = review;

  const primaryCategory = categories[0];
  const publishDate = new Date(publishedAt);
  const relativeDate = formatDistanceToNow(publishDate, { addSuffix: true });

  const getAuthorInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBadgeVariant = (
    color?: string
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (!color) return "default";

    // Map hex colors to badge variants based on your theme
    const colorMap: {
      [key: string]: "default" | "secondary" | "outline" | "destructive";
    } = {
      "#975af9": "default", // primary
      "#81f5c6": "secondary", // secondary
      "#ffee93": "outline", // accent
      "#ad79fa": "default", // primary-alt
    };

    return colorMap[color] || "default";
  };

  return (
    <Link href={`/reviews/${slug.current}`} className="block group">
      <Card
        className={`
          overflow-hidden transition-all duration-300 
          hover:shadow-lg hover:scale-[1.02] 
          bg-card border-border 
          ${featured ? "ring-2 ring-primary/20" : ""}
          ${className}
        `}
      >
        <CardHeader className="relative p-0">
          {/* Category Badge - Top Left */}
          {primaryCategory && (
            <div className="absolute top-4 left-4 z-10">
              <Badge
                variant={getBadgeVariant(primaryCategory.color)}
                className="font-mono text-xs px-3 py-1 shadow-sm"
                style={
                  primaryCategory.color
                    ? {
                        backgroundColor: primaryCategory.color,
                        color: "#ffffff",
                        border: "none",
                      }
                    : {}
                }
              >
                {primaryCategory.title}
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

          {/* Featured Badge */}
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

          {/* Game Cover Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={game.coverImage.asset.url}
              alt={game.coverImage.alt || `${game.title} cover`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Date */}
          <time
            dateTime={publishedAt}
            className="text-sm text-muted-foreground font-mono mb-2 block"
          >
            {relativeDate}
          </time>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Game Title */}
          <p className="text-sm text-primary font-medium mb-3 group-hover:text-primary-alt transition-colors">
            {game.title}
          </p>

          {/* Summary/Description */}
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {summary}
          </p>
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
};

export default GameReviewCard;
export type { GameReview, GameReviewCardProps };
