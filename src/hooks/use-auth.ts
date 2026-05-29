import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getMe } from '@/api/auth';
import { hasAccessToken } from '@/lib/auth-token';

export const authQueryKeys = {
  me: ['auth', 'me'] as const,
};

export function useAuth() {
  const [tokenReady, setTokenReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    hasAccessToken().then((exists) => {
      setHasToken(exists);
      setTokenReady(true);
    });
  }, []);

  const meQuery = useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMe,
    enabled: tokenReady && hasToken,
  });

  const isLoading = !tokenReady || (hasToken && meQuery.isLoading);

  return {
    user: meQuery.data ?? null,
    isLoading,
    isAuthenticated: !!meQuery.data,
    error: meQuery.error,
    refetch: meQuery.refetch,
  };
}
