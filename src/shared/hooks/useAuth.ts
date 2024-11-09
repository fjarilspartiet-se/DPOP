import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      return result;
    } catch (error) {
      console.error('Authentication error:', error);
      return { error: 'Authentication failed' };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
  };
}
