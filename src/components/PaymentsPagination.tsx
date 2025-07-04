
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface PaymentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
}

export const PaymentsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize
}: PaymentsPaginationProps) => {
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
          className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      items.push(
        <PaginationItem key={0}>
          <PaginationLink onClick={() => onPageChange(0)} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        items.push(<PaginationEllipsis key="ellipsis1" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis2" />);
      }
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink onClick={() => onPageChange(totalPages - 1)} className="cursor-pointer">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < totalPages - 1 && onPageChange(currentPage + 1)}
          className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
        />
      </PaginationItem>
    );

    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-600">
        Mostrando {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalCount)} de {totalCount} pagos
      </p>
      <Pagination>
        <PaginationContent>
          {renderPaginationItems()}
        </PaginationContent>
      </Pagination>
    </div>
  );
};
