import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { RuntimeConfigService } from './runtime-config.service';
import { TabSessionCoordinatorService } from './tab-session-coordinator.service';

@Injectable({ providedIn: 'root' })
export class SessionTokenService {
  private static readonly REFRESH_LEAD_MS = 5 * 60 * 1000;
  private static readonly REFRESH_LOCK_MS = 30 * 1000;
  private static readonly REFRESH_POLL_MS = 250;
  private static readonly REFRESH_POLL_MAX_MS = 10 * 1000;

  private proactiveRefreshTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private monitoring = false;

  constructor(
    private http: HttpClient,
    private runtimeConfig: RuntimeConfigService,
    private authService: AuthService,
    private tabSessionCoordinator: TabSessionCoordinatorService
  ) {}

  private get apiUrl(): string {
    return this.runtimeConfig.getBaseUrl() + 'Auth';
  }

  startProactiveRefreshScheduling(): void {
    this.monitoring = true;
    this.scheduleProactiveRefresh();
  }

  stopProactiveRefreshScheduling(): void {
    this.monitoring = false;
    if (this.proactiveRefreshTimeoutId) {
      clearTimeout(this.proactiveRefreshTimeoutId);
      this.proactiveRefreshTimeoutId = null;
    }
  }

  scheduleProactiveRefresh(): void {
    if (!this.monitoring) return;

    if (this.proactiveRefreshTimeoutId) {
      clearTimeout(this.proactiveRefreshTimeoutId);
      this.proactiveRefreshTimeoutId = null;
    }

    const token = this.getStoredToken();
    if (!token) return;

    const expiryMs = this.getJwtExpiryMs(token);
    if (!expiryMs) return;

    const refreshAt = expiryMs - SessionTokenService.REFRESH_LEAD_MS;
    const delay = Math.max(refreshAt - Date.now(), 0);

    this.proactiveRefreshTimeoutId = setTimeout(() => {
      this.proactiveRefreshTimeoutId = null;
      void this.refreshIfActive();
    }, delay);
  }

  async refreshIfActive(): Promise<string | null> {
    if (!this.tabSessionCoordinator.isSessionActive()) {
      return null;
    }
    return this.refreshToken();
  }

  async refreshToken(): Promise<string | null> {
    const payload = this.getSessionPayload();
    if (!payload) return null;

    const sessionGuid = String(payload.sessionGuid ?? payload.SessionGuid ?? '');
    const lockKey = `rentnet_refresh_in_flight_${sessionGuid}`;

    if (this.isRefreshLockHeld(lockKey)) {
      return this.waitForRefreshedToken(lockKey);
    }

    this.setRefreshLock(lockKey);

    try {
      const response = await firstValueFrom(
        this.http.post<{ Status?: string; status?: string; Token?: string; token?: string }>(
          `${this.apiUrl}/session-refresh`,
          payload
        )
      );

      const status = response?.Status ?? response?.status;
      const newToken = response?.Token ?? response?.token;
      if (status !== 'Success' || !newToken) {
        return null;
      }

      this.updateStoredToken(newToken);
      return newToken;
    } catch {
      return null;
    } finally {
      this.clearRefreshLock(lockKey);
    }
  }

  updateStoredToken(token: string): void {
    this.authService.updateToken(token);
    this.tabSessionCoordinator.broadcastRefreshedToken(token);
    this.scheduleProactiveRefresh();
  }

  getJwtExpiryMs(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      const decoded = JSON.parse(atob(padded)) as { exp?: number };
      return decoded?.exp ? decoded.exp * 1000 : null;
    } catch {
      return null;
    }
  }

  isTokenNearExpiry(token?: string | null, leadMs = SessionTokenService.REFRESH_LEAD_MS): boolean {
    const value = token ?? this.getStoredToken();
    if (!value) return false;
    const expiryMs = this.getJwtExpiryMs(value);
    if (!expiryMs) return false;
    return expiryMs - Date.now() <= leadMs;
  }

  private getStoredToken(): string | null {
    const user = this.authService.currentUserValue as any;
    const token = user?.Token ?? user?.token;
    return token ? String(token) : null;
  }

  private getSessionPayload(): Record<string, unknown> | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      const employee = user?.employee ?? user?.Employee;
      const sessionGuid = user?.SessionGuid ?? user?.sessionGuid;
      const employeeID = employee?.EmployeeID ?? employee?.employeeID;
      if (!sessionGuid) return null;
      return { sessionGuid, SessionGuid: sessionGuid, employeeID, EmployeeID: employeeID };
    } catch {
      return null;
    }
  }

  private isRefreshLockHeld(lockKey: string): boolean {
    try {
      const raw = localStorage.getItem(lockKey);
      if (!raw) return false;
      const startedAt = Number(raw);
      if (!Number.isFinite(startedAt)) {
        localStorage.removeItem(lockKey);
        return false;
      }
      if (Date.now() - startedAt > SessionTokenService.REFRESH_LOCK_MS) {
        localStorage.removeItem(lockKey);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private setRefreshLock(lockKey: string): void {
    try {
      localStorage.setItem(lockKey, String(Date.now()));
    } catch {
      // ignore
    }
  }

  private clearRefreshLock(lockKey: string): void {
    try {
      localStorage.removeItem(lockKey);
    } catch {
      // ignore
    }
  }

  private async waitForRefreshedToken(lockKey: string): Promise<string | null> {
    const started = Date.now();
    const initialToken = this.getStoredToken();

    while (Date.now() - started < SessionTokenService.REFRESH_POLL_MAX_MS) {
      await this.delay(SessionTokenService.REFRESH_POLL_MS);
      const currentToken = this.getStoredToken();
      if (currentToken && currentToken !== initialToken) {
        return currentToken;
      }
      if (!this.isRefreshLockHeld(lockKey)) {
        break;
      }
    }

    return this.getStoredToken();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
