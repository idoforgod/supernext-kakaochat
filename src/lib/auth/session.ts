const SESSION_KEY = 'superchat_session';

export function saveSession(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, token);
  }
}

export function getSession(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SESSION_KEY);
  }
  return null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
