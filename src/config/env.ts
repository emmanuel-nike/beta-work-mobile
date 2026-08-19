import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

const trimmed = (ENV_API_BASE_URL || 'https://betawork.arknotify.io/api/v1').replace(
  /\/$/,
  '',
);

export const API_BASE_URL = trimmed;
