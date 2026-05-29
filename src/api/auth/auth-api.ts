import type { AuthResponse, LoginDto, User } from '@/api/auth/auth-dto';
import { clearAccessToken, setAccessToken } from '@/lib/auth-token';
import { http } from '@/lib/http';

export async function login(dto: LoginDto): Promise<User> {
  const { data } = await http.post<AuthResponse>('/auth/login', dto);
  if (!data.accessToken) {
    throw new Error(
      'API did not return accessToken. Update the Nest auth controller to include it in the login response (see Plan.md).',
    );
  }

  await setAccessToken(data.accessToken);
  return data.user;
}

export async function getMe(): Promise<User> {
  const { data } = await http.get<User>('/auth/me');
  return data;
}

export async function logout(): Promise<void> {
  try {
    await http.post('/auth/logout');
  } finally {
    await clearAccessToken();
  }
}
