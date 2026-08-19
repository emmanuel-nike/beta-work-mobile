import { API_BASE_URL } from '../config/env';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Readonly<{
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  formData?: FormData;
}>;

function messageFromBody(body: unknown, fallback: string) {
  if (!body || typeof body !== 'object') {
    return fallback;
  }

  const record = body as {
    message?: string;
    errors?: Array<{ message?: string; field?: string }>;
  };

  if (typeof record.message === 'string' && record.message.trim()) {
    return record.message;
  }

  if (Array.isArray(record.errors) && record.errors[0]?.message) {
    return record.errors[0].message;
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let body: string | FormData | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body,
  });

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      messageFromBody(parsed, `Request failed (${response.status})`),
      response.status,
      parsed,
    );
  }

  return parsed as T;
}
