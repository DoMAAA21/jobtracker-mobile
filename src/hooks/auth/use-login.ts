import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { authQueryKeys } from '@/hooks/auth/query-keys';
import { login, type LoginDto } from '@/lib/auth';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me, user);
      router.replace('/(app)');
    },
  });
}
