"use client";

import Link from 'next/link';
import {
  usePathname,
  useSearchParams,
} from 'next/navigation';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    const url = baseUrl || pathname;
    return `${url}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm" className="font-mono">
            ← PREV
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="font-mono">
          ← PREV
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return isActive ? (
            <Button
              key={pageNumber}
              variant="default"
              size="sm"
              className="font-mono min-w-[40px]"
              disabled
            >
              {pageNumber}
            </Button>
          ) : (
            <Link key={pageNumber} href={createPageUrl(pageNumber)}>
              <Button
                variant="outline"
                size="sm"
                className="font-mono min-w-[40px]"
              >
                {pageNumber}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm" className="font-mono">
            NEXT →
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled className="font-mono">
          NEXT →
        </Button>
      )}
    </div>
  );
}
