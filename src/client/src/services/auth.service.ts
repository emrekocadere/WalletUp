import type { TokenPayload } from '@/types/auth.types';


class AuthService {
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  
  getUserNameFromToken(token?: string): string | null {

    const tokenToUse = token || this.accessToken;
    if (!tokenToUse) return null;
 
    const payload = this.decodeToken(tokenToUse);
    if (!payload) return null;


    return (payload as any).unique_name || null;
  }

enExpired(token?: string): boolean {
    const tokenToUse = token || this.accessToken;
    if (!tokenToUse) return true;

    const payload = this.decodeToken(tokenToUse);
    if (!payload || !payload.exp) return true;


    return Date.now() >= payload.exp * 1000;
  }


  getCurrentUser(): { name: string | null; userId: string | null } | null {
    if (!this.accessToken) return null;

    const payload = this.decodeToken(this.accessToken);
    if (!payload) return null;

    return {
      name: (payload as any).name || null,
      userId: payload.userId || null,
    };
  }
}


export const authService = new AuthService();
