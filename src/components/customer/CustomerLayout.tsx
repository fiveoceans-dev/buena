import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import {
  User,
  LogOut,
  Package,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isActive = (href: string) =>
    location.pathname === href || (href === '/customer/catalog' && location.pathname === '/dashboard');

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile top row */}
      <div className="md:hidden px-4 py-4 flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu (simple, no borders/backgrounds) */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="space-y-3 text-sm text-black">
            <Link
              to="/customer/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className={(isActive('/customer/catalog') ? 'underline underline-offset-4' : 'hover:underline underline-offset-4') + ' block'}
            >
              Products
            </Link>
            <Link
              to="/customer/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={(isActive('/customer/settings') ? 'underline underline-offset-4' : 'hover:underline underline-offset-4') + ' block'}
            >
              Settings
            </Link>
          </nav>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-10">
          {/* Left side menu (desktop) */}
          <aside className="hidden md:block w-40 shrink-0">
            <div className="text-[11px] uppercase tracking-[0.2em] text-black">
              Buena Retailing
            </div>
            <div className="mt-8 text-xs text-black/60 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                <span className="truncate">{user?.email}</span>
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

            {/* Menu items under Log out */}
            <nav className="mt-6 space-y-3 text-sm text-black">
              <Link
                to="/customer/catalog"
                className={(isActive('/customer/catalog') ? 'underline underline-offset-4' : 'hover:underline underline-offset-4') + ' block'}
              >
                Products
              </Link>
              <Link
                to="/customer/settings"
                className={(isActive('/customer/settings') ? 'underline underline-offset-4' : 'hover:underline underline-offset-4') + ' block'}
              >
                Settings
              </Link>
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
