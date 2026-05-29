const raw = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

/** NestJS global prefix — always ends with `/api`. */
export const API_URL = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
