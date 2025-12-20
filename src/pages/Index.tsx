import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center py-4">
            <Button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/login')}>
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-light tracking-wider text-black mb-8">
            Buena Retailing
          </h1>
        </div>
      </main>
    </div>
  );
};

export default Index;
