import axios from 'axios';

import { env } from '@/config/env';
import { normalizeError } from '@/utils/errors/normalize-error';

export const httpClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(normalizeError(error));
  },
);