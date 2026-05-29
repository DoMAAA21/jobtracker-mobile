import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { authQueryKeys } from '@/hooks/auth/query-keys';
import { getMe } from '@/lib/auth';
import { hasAccessToken } from '@/lib/auth-token';

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
