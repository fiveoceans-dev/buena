import * as React from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

export function SearchField({ containerClassName, className, ...props }: SearchFieldProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute left-0 top-3 h-4 w-4 text-black/40" />
      <Input
        {...props}
        className={cn(
          'pl-6 border-0 shadow-none rounded-[5px] bg-gray-100 h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0',
          className
        )}
      />
    </div>
  );
}
