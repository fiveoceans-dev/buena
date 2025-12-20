import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, User, Package, ShoppingCart, Users } from 'lucide-react';
import { signOut, authService, mockUsers } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading, isAuthenticated, isAdmin, isManager, isWarehouse } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleUserSwitch = (email: string) => {
    const success = authService.switchUser(email);
    if (success) {
      toast({
        title: 'User switched',
        description: `Now logged in as ${email}`,
      });
      // Force reload to update auth state
      window.location.reload();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to switch user',
        variant: 'destructive',
      });
    }
  };

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

  // User is authenticated - show dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
                {user?.role && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {user.role}
                  </Badge>
                )}
              </div>

              {/* Development user switcher */}
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <Select onValueChange={handleUserSwitch}>
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue placeholder="Switch user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((mockUser) => (
                      <SelectItem key={mockUser.email} value={mockUser.email}>
                        {mockUser.email.split('@')[0]} ({mockUser.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Portal */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                Customer Portal
              </CardTitle>
              <CardDescription>
                Browse products and place orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/customer/')}
                className="w-full"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>

          {/* Admin Dashboard - only for admins/managers */}
          {(isAdmin || isManager) && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-green-600" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>
                  Manage products, orders, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  className="w-full"
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Warehouse - for warehouse users */}
          {(isAdmin || isManager || isWarehouse) && (
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-orange-600" />
                  Warehouse
                </CardTitle>
                <CardDescription>
                  Manage inventory and fulfill orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate('/warehouse')}
                  variant="outline"
                  className="w-full"
                >
                  Warehouse
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Welcome message */}
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-600">
            Choose a portal above to get started with your retail operations.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
