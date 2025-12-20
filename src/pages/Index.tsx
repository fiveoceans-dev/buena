import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Role-based home routing:
  // - customers go straight to the store
  // - admins/managers go to management
  // - warehouse goes to inventory/ops
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;

    const role = user?.role;
    if (role === 'customer') {
      navigate('/customer/catalog', { replace: true });
      return;
    }

    if (role === 'warehouse') {
      navigate('/admin/inventory', { replace: true });
      return;
    }

    if (role === 'admin' || role === 'manager') {
      navigate('/admin', { replace: true });
      return;
    }

    navigate('/customer/catalog', { replace: true });
  }, [isAuthenticated, loading, navigate, user?.role]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simple landing page
    return (
      <div className="min-h-screen bg-white">
        {/* Header with login button */}
        <header className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center py-4">
              <Button
                onClick={() => navigate('/auth/login')}
                className="bg-black text-white hover:bg-gray-800"
              >
                Login
              </Button>
            </div>
          </div>
        </header>

        {/* Main content - simple centered title */}
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider text-black mb-8">
              Buena Retailing
            </h1>
          </div>
        </main>
      </div>
    );
  }

  // User is authenticated - redirecting to the role home
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting…</p>
      </div>
    </div>
  );
};

export default Index;
