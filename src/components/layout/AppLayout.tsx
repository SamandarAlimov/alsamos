import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppSidebar } from './AppSidebar';
import { BottomNavbar } from './BottomNavbar';
import { MobileHeader } from './MobileHeader';
import { Loader2 } from 'lucide-react';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { LocationPermissionDialog } from '@/components/LocationPermissionDialog';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { startSession, trackPageChange } = useActivityTracking();

  useEffect(() => {
    if (isAuthenticated) trackPageChange(location.pathname);
  }, [location.pathname, isAuthenticated, trackPageChange]);

  useEffect(() => {
    if (isAuthenticated) startSession(location.pathname);
  }, [isAuthenticated]);

  const isAIWorkspace = location.pathname === '/ai';
  const hideHeaderOnPages = isAIWorkspace || location.pathname === '/messages' || location.pathname === '/map' || location.pathname === '/videos' || location.pathname === '/create';
  const immersiveRoute = isAIWorkspace || location.pathname === '/create';

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="flex flex-col items-center gap-4"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="text-muted-foreground">Loading...</p></div></div>;
  }
  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className={cn('min-h-screen flex w-full bg-background', isAIWorkspace && 'h-dvh overflow-hidden')}>
      {!isAIWorkspace && <AppSidebar />}
      {!hideHeaderOnPages && <MobileHeader />}
      <main className={cn('flex-1 min-w-0 overflow-auto md:ml-0 md:pt-0 md:pb-0', hideHeaderOnPages ? 'pt-0' : 'pt-14', immersiveRoute ? 'pb-0' : 'pb-20', isAIWorkspace && 'h-dvh overflow-hidden')}>
        {isAIWorkspace ? <div className="h-full min-h-0 [&>div]:!h-dvh"><Outlet /></div> : <Outlet />}
      </main>
      {!immersiveRoute && <BottomNavbar />}
      {!isAIWorkspace && <LocationPermissionDialog />}
    </div>
  );
}
