import { ReactNode } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface AdminTableProps {
  children: ReactNode;
  className?: string;
}

type TableSectionProps<T> = React.HTMLAttributes<T> & { className?: string };
type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & { className?: string };
type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement> & { className?: string };

export const AdminTable = ({ children, className }: AdminTableProps) => (
  <div className="border-t border-black/10">
    <Table className={cn('text-xs', className)}>{children}</Table>
  </div>
);

export const AdminTableHeader = ({ className, ...props }: TableSectionProps<HTMLTableSectionElement>) => (
  <TableHeader className={cn('[&_tr]:border-black/10', className)} {...props} />
);

export const AdminTableBody = ({ className, ...props }: TableSectionProps<HTMLTableSectionElement>) => (
  <TableBody className={cn('[&_tr]:border-black/10', className)} {...props} />
);

export const AdminTableRow = ({ className, ...props }: TableRowProps) => (
  <TableRow className={cn('hover:bg-transparent border-black/10', className)} {...props} />
);

export const AdminTableHead = ({ className, ...props }: TableHeadProps) => (
  <TableHead
    className={cn('text-[10px] uppercase tracking-[0.2em] text-black/40 font-normal', className)}
    {...props}
  />
);
