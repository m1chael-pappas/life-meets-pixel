import Link from 'next/link';

interface ReviewTypeTabsProps {
  currentType?: string;
}

const reviewTypes = [
  { id: undefined, label: 'All Reviews', emoji: '📝', href: '/reviews' },
  { id: 'videogame', label: 'Games', emoji: '🎮', href: '/reviews?type=videogame' },
  { id: 'movie', label: 'Movies', emoji: '🎬', href: '/reviews?type=movie' },
  { id: 'anime', label: 'Anime', emoji: '🍥', href: '/reviews?type=anime' },
  { id: 'boardgame', label: 'Board Games', emoji: '🎲', href: '/reviews?type=boardgame' },
  { id: 'tvseries', label: 'TV Series', emoji: '📺', href: '/reviews?type=tvseries' },
  { id: 'gadget', label: 'Tech', emoji: '📱', href: '/reviews?type=gadget' },
];

export default function ReviewTypeTabs({ currentType }: ReviewTypeTabsProps) {
  return (
    <div className="mb-8 border-b border-border">
      <nav className="flex flex-wrap gap-2 -mb-px">
        {reviewTypes.map((type) => {
          const isActive = currentType === type.id;

          return (
            <Link
              key={type.id || 'all'}
              href={type.href}
              className={`
                inline-flex items-center gap-2 px-4 py-3 font-mono text-sm
                border-b-2 transition-colors duration-200
                ${
                  isActive
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }
              `}
            >
              <span>{type.emoji}</span>
              {type.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
