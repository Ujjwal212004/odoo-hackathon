/**
 * AssetFlow — API Client
 *
 * Thin wrapper around fetch that handles:
 * - Base URL via Vite proxy (/api/v1)
 * - JWT token injection from localStorage
 * - Automatic token refresh on 401
 * - Typed error handling
 */

const API_BASE = '/api/v1';

// ── Token helpers ─────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem('af_access_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('af_refresh_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('af_access_token', access);
  localStorage.setItem('af_refresh_token', refresh);
}

export function clearAuth() {
  localStorage.removeItem('af_access_token');
  localStorage.removeItem('af_refresh_token');
  localStorage.removeItem('af_user');
  localStorage.removeItem('af_auth');
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export function getStoredUser(): UserInfo | null {
  const raw = localStorage.getItem('af_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserInfo) {
  localStorage.setItem('af_user', JSON.stringify(user));
  localStorage.setItem('af_auth', 'true');
  localStorage.setItem('af_user_name', user.full_name);
  localStorage.setItem('af_user_role', user.role?.name ?? 'employee');
}

// ── Types ─────────────────────────────────────────────────────────────

export interface UserInfo {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  department_id: string | null;
  role: {
    id: string;
    name: string;
    description: string | null;
    permissions: { id: string; code: string; description: string | null }[];
  };
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

// ── Core fetch ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  skipAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && !skipAuth && !path.includes('/auth/')) {
    // Try token refresh
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers });
      if (!retryRes.ok) {
        const body = await retryRes.json().catch(() => ({ detail: 'Request failed' }));
        throw new ApiError(retryRes.status, body.detail ?? 'Request failed');
      }
      return retryRes.json();
    }
    clearAuth();
    window.location.href = '/login';
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new ApiError(res.status, body.detail ?? 'Request failed');
  }

  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data: TokenResponse = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ── Auth API ──────────────────────────────────────────────────────────

export async function apiLogin(email: string, password: string): Promise<UserInfo> {
  const tokens = await apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, true);

  setTokens(tokens.access_token, tokens.refresh_token);

  const user = await apiFetch<UserInfo>('/auth/me');
  setStoredUser(user);
  return user;
}

export async function apiRegister(
  email: string,
  fullName: string,
  password: string,
  departmentId?: string,
): Promise<UserInfo> {
  await apiFetch<UserInfo>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      full_name: fullName,
      password,
      department_id: departmentId ?? null,
    }),
  }, true);

  // Auto-login after registration
  return apiLogin(email, password);
}

export async function apiLogout() {
  clearAuth();
}

export async function apiGetMe(): Promise<UserInfo> {
  return apiFetch<UserInfo>('/auth/me');
}

// ── Dashboard ─────────────────────────────────────────────────────────

export async function apiGetDashboard() {
  return apiFetch<Record<string, unknown>>('/dashboard');
}

// ── Assets ────────────────────────────────────────────────────────────

export async function apiGetAssets(params?: { search?: string; status?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.offset) query.set('offset', String(params.offset));
  const qs = query.toString();
  return apiFetch<{ items: unknown[]; total: number; limit: number; offset: number }>(`/assets${qs ? `?${qs}` : ''}`);
}

export async function apiGetAsset(id: string) {
  return apiFetch<Record<string, unknown>>(`/assets/${id}`);
}

// ── Departments ───────────────────────────────────────────────────────

export async function apiGetDepartments() {
  return apiFetch<{ items: unknown[]; total: number }>('/departments');
}

// ── Categories ────────────────────────────────────────────────────────

export async function apiGetCategories() {
  return apiFetch<{ items: unknown[]; total: number }>('/categories');
}

// ── Notifications ─────────────────────────────────────────────────────

export async function apiGetNotifications(limit = 50) {
  return apiFetch<{ items: unknown[]; total: number }>(`/notifications?limit=${limit}`);
}

// ── AI ────────────────────────────────────────────────────────────────

export async function apiAiChat(message: string, context?: Record<string, unknown>) {
  return apiFetch<{ response: string; provider: string; fallback: boolean }>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}
