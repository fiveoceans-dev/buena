import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function CustomerSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast({ title: 'Signed out' });
      navigate('/', { replace: true });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-medium text-black">Settings</h1>

      <div className="text-sm text-black/70">
        Signed in as <span className="text-black">{user?.email}</span>
      </div>

      <div>
        <Button
          variant="outline"
          className="rounded-none border-black text-black hover:bg-black hover:text-white"
          onClick={handleSignOut}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}


