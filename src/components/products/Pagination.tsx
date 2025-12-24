import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 5 page buttons
  let visiblePages = pages;
  if (totalPages > 5) {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    visiblePages = pages.slice(start - 1, end);
  }

  return (
    <div 
      className="mt-8 flex items-center justify-center gap-2"
      data-testid="pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid="pagination-prev"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages[0] > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(1)}
            data-testid="pagination-page-1"
          >
            1
          </Button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-muted-foreground" data-testid="pagination-ellipsis-start">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          data-testid={`pagination-page-${page}`}
        >
          {page}
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground" data-testid="pagination-ellipsis-end">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            data-testid={`pagination-page-${totalPages}`}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid="pagination-next"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <span 
        className="ml-4 text-sm text-muted-foreground"
        data-testid="pagination-info"
      >
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};
