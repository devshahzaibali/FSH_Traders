'use client';
import { useAuth } from './AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  // Redirect to login for protected routes
  useEffect(() => {
    const protectedRoutes = ['/admin', '/account', '/contact', '/cart', '/checkout'];
    if (!loading && !user && protectedRoutes.includes(pathname)) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);
  
  return <>{children}</>;
} 