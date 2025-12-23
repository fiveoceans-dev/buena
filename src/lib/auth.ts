import { mockDb } from '@/data/mockData';
import { User } from '@/data/mockData';

// Temporary switch to bypass auth in development.
export const AUTH_DISABLED = false;

const getAuthDisabledUser = (): User | null => {
  return mockDb.getUserByEmail('admin@buena.com') || mockDb.getUsers()[0] || null;
};

export interface MagicLinkRequest {
  email: string;
  redirectTo?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'customer' | null;
  profile: User | null;
}

// Simple localStorage-based authentication
class AuthService {
  private readonly TOKEN_KEY = 'buena_auth_token';
  private readonly USER_KEY = 'buena_current_user';

  // Simple email login - creates user if needed, no verification flow
  async requestMagicLink({ email }: MagicLinkRequest): Promise<AuthResult> {
    try {
      // Check if user exists, create if not
      let user = mockDb.getUserByEmail(email);
      if (!user) {
        user = mockDb.createUser({
          email,
          firstName: email.split('@')[0],
          lastName: 'User',
          role: 'customer',
          isActive: true
        });
      }

      this.setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send magic link'
      };
    }
  }

  // Mock token validation - just checks localStorage
  async validateMagicLink(token: string): Promise<AuthResult> {
    try {
      const storedToken = localStorage.getItem(this.TOKEN_KEY);
      const storedUser = localStorage.getItem(this.USER_KEY);

      if (!storedToken || !storedUser || storedToken !== token) {
        return {
          success: false,
          error: 'Invalid or expired magic link'
        };
      }

      const user = JSON.parse(storedUser);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  // Sign out
  async signOut(): Promise<AuthResult> {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to sign out'
      };
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    if (AUTH_DISABLED) {
      return getAuthDisabledUser();
    }

    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Set user (for direct login during development)
  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, `dev_${user.email}_${Date.now()}`);
  }

  // Get all users (for admin purposes)
  getAllUsers(): User[] {
    return mockDb.getUsers();
  }

  // Switch user (for development)
  switchUser(email: string): boolean {
    const user = mockDb.getUserByEmail(email);
    if (user) {
      this.setUser(user);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Re-export mockUsers for convenience
export { mockUsers } from '@/data/mockData';

// Legacy functions for compatibility
export async function requestMagicLink(request: MagicLinkRequest): Promise<AuthResult> {
  return authService.requestMagicLink(request);
}

export async function validateMagicLink(token: string): Promise<AuthResult> {
  return authService.validateMagicLink(token);
}

export async function signOut(): Promise<AuthResult> {
  return authService.signOut();
}

export function getCurrentUser(): User | null {
  return authService.getCurrentUser();
}

export function isAuthenticated(): boolean {
  return authService.isAuthenticated();
}

// New function to get auth user with role info
export function getAuthUser(): AuthUser | null {
  const user = getCurrentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    profile: user
  };
}
