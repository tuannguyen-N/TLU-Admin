import { API_BASE_URL } from '../config/api';

const HARD_CODED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGVzIjpudWxsLCJzaWduIjpudWxsLCJpYXQiOjE3NzU3OTMxNTc1NzksImV4cCI6MTc3NTc5Njc1NzU3OX0.OcuqDvFuHymaB9AB9bHgaAGY04DlYL6pUjKqJWMb328";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const search = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    url += `?${search}`;
  }
  return url;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  const isFormData = fetchOptions.body instanceof FormData;

  console.log("[API] calling:", buildUrl(endpoint, params));
  console.log("[API] fetchOptions:", fetchOptions);

  const response = await fetch(buildUrl(endpoint, params), {
    ...fetchOptions,
    headers: {
      ...(isFormData
        ? {}
        : { "Content-Type": "application/json" }),
      "Accept": "application/json",
      "Authorization": `Bearer ${HARD_CODED_TOKEN}`,
      ...fetchOptions.headers,
    },
  });

  console.log("[API] status:", response.status);

  if (!response.ok) {
    let errorMessage = `Failed: ${response.status}`;
    try {
      const text = await response.text();
      console.error("[API] error body:", text);
      if (text) {
        const errorJson = JSON.parse(text);
        errorMessage = errorJson?.message || errorMessage;
      }
    } catch (e) {
      console.error("[API] failed to parse error body:", e);
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();
  console.log("[API] success:", json);

  return json as T;
}