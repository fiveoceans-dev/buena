import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import {
  LogOut,
  Menu,
  User,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  roles: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    roles: ['admin'],
  },
  {
    title: 'Products',
    href: '/products',
    roles: ['admin'],
  },
  {
    title: 'Orders',
    href: '/orders',
    roles: ['admin'],
  },
  {
    title: 'Inventory',
    href: '/inventory',
    roles: ['admin'],
  },
  {
    title: 'Prices',
    href: '/prices',
    roles: ['admin'],
  },
  {
    title: 'Customers',
    href: '/customers',
    roles: ['admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    roles: ['admin'],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      navigate('/');
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role || '') || user?.role === 'admin'
  );

  const handleSignOutClick = () => {
    setSidebarOpen(false);
    void handleSignOut();
  };

  const navLinkClass = (isActive: boolean) =>
    (isActive
      ? 'underline underline-offset-4'
      : 'hover:underline underline-offset-4 text-black/70') + ' flex items-center justify-between';

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mobile top row */}
      <div className="md:hidden px-4 py-4 flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {sidebarOpen && (
        <div className="md:hidden px-4 pb-6 space-y-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black hover:underline underline-offset-4"
            onClick={() => setSidebarOpen(false)}
          >
            <img src="/logo.svg" alt="" className="h-4 w-auto" aria-hidden="true" />
            <span>Buena Retailing</span>
          </Link>
          <div className="text-xs text-black/60 space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
              {user?.role} access
            </div>
            <button
              type="button"
              onClick={handleSignOutClick}
              className="inline-flex items-center gap-2 text-black hover:underline underline-offset-4"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>

          <nav className="space-y-3 text-sm text-black">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass(isActive)}
                >
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-10">
          {/* Left side menu (desktop) */}
          <aside className="hidden md:block w-48 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black hover:underline underline-offset-4"
            >
              <img src="/logo.svg" alt="" className="h-4 w-auto" aria-hidden="true" />
              <span>Buena Retailing</span>
            </Link>
            <div className="mt-6 text-xs text-black/60 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                {user?.role} access
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 text-black hover:underline underline-offset-4"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>

            <nav className="mt-6 space-y-3 text-sm text-black">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={navLinkClass(isActive)}
                  >
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
