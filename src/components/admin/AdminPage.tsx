import { ChangeEvent, ReactNode } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchField } from '@/components/ui/search-field';
import { cn } from '@/lib/utils';

interface AdminPageProps {
  children: ReactNode;
  className?: string;
}

interface AdminPageHeaderProps {
  title: string;
  actions?: ReactNode;
  secondaryActions?: ReactNode;
}

interface AdminTabsListProps {
  tabs: { value: string; label: string }[];
}

interface AdminSearchProps {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AdminPage = ({ children, className }: AdminPageProps) => (
  <div className={cn('space-y-8 text-black', className)}>{children}</div>
);

export const AdminPageHeader = ({ title, actions, secondaryActions }: AdminPageHeaderProps) => (
  <div className="overflow-x-auto">
    <div className="flex items-center justify-between gap-4 whitespace-nowrap text-[12px] text-black">
      <div className="flex items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.2em] text-black underline underline-offset-4">
          {title}
        </span>
        {actions}
      </div>
      {secondaryActions}
    </div>
  </div>
);

export const AdminTabsList = ({ tabs }: AdminTabsListProps) => (
  <TabsList className="h-auto w-fit justify-start bg-transparent p-0 text-[12px] text-black/60 gap-4 border-b border-black/10">
    {tabs.map((tab) => (
      <TabsTrigger
        key={tab.value}
        value={tab.value}
        className="px-0 py-0 text-[11px] uppercase tracking-[0.2em] data-[state=active]:text-black data-[state=active]:shadow-none"
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
);

export const AdminSearch = ({ placeholder, value, onChange }: AdminSearchProps) => (
  <div className="flex items-center justify-end">
    <SearchField
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      containerClassName="w-full max-w-sm"
    />
  </div>
);
