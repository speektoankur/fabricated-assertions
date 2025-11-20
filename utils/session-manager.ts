/**
 * Session Manager Utility
 * Handles JSESSIONID interception and management
 */

import { Page } from '@playwright/test';

export class SessionManager {
  private sessionId: string | null = null;

  /**
   * Intercepts and stores JSESSIONID from network requests
   */
  async interceptSessionId(page: Page): Promise<void> {
    page.on('response', async (response) => {
      const setCookieHeaders = response.headers()['set-cookie'];
      if (setCookieHeaders) {
        const sessionMatch = Array.isArray(setCookieHeaders)
          ? setCookieHeaders.join(';').match(/JSESSIONID=([^;]+)/)
          : setCookieHeaders.match(/JSESSIONID=([^;]+)/);
        if (sessionMatch) {
          this.sessionId = sessionMatch[1];
          console.log(`Intercepted JSESSIONID from response: ${this.sessionId}`);
        }
      }
    });

    page.on('request', async (request) => {
      const cookieHeader = request.headers()['cookie'];
      if (cookieHeader) {
        const sessionMatch = cookieHeader.match(/JSESSIONID=([^;]+)/);
        if (sessionMatch && !this.sessionId) {
          this.sessionId = sessionMatch[1];
          console.log(`Intercepted JSESSIONID from request: ${this.sessionId}`);
        }
      }
    });
  }

  /**
   * Retrieves JSESSIONID from page cookies
   */
  async getSessionIdFromCookies(page: Page): Promise<string | null> {
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(cookie => cookie.name === 'JSESSIONID');
    if (sessionCookie) {
      this.sessionId = sessionCookie.value;
      console.log(`Retrieved JSESSIONID from cookies: ${this.sessionId}`);
      return this.sessionId;
    }
    return null;
  }

  /**
   * Gets the stored JSESSIONID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Manually sets the JSESSIONID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }
}

