"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav className="retro-pagination" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={createPageUrl(currentPage - 1)}>← PREV</Link>
      ) : (
        <span className="disabled">← PREV</span>
      )}
      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="disabled">
              …
            </span>
          );
        }
        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;
        return isActive ? (
          <span key={pageNumber} className="is-active" aria-current="page">
            {pageNumber}
          </span>
        ) : (
          <Link key={pageNumber} href={createPageUrl(pageNumber)}>
            {pageNumber}
          </Link>
        );
      })}
      {currentPage < totalPages ? (
        <Link href={createPageUrl(currentPage + 1)}>NEXT →</Link>
      ) : (
        <span className="disabled">NEXT →</span>
      )}
    </nav>
  );
}
