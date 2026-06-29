import { Injectable, Injector, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RuntimeConfigService } from './runtime-config.service';
import { AuthService } from './auth.service';
import { TabSessionCoordinatorService } from './tab-session-coordinator.service';
import { SessionTokenService } from './session-token.service';
import {
  SESSION_HEARTBEAT_DEBOUNCE_MS,
  SESSION_INACTIVITY_MS,
  SESSION_INACTIVITY_WARNING_LEAD_MINUTES,
  SESSION_WARNING_MS,
} from './session-settings';

const ACTIVITY_DEBOUNCE_MS = 1000;

@Injectable({ providedIn: 'root' })
export class SessionHeartbeatService implements OnDestroy {
  private readonly apiUrl: string;
  private warningTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private logoutTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private activityDebounceId: ReturnType<typeof setTimeout> | null = null;
  private lastHeartbeatSent = 0;
  private warningVisible = false;
  private monitoring = false;
  private sessionEndSent = false;
  private sessionExpiredHandling = false;

  private readonly activityHandler = () => this.onUserActivity();

  constructor(
    private http: HttpClient,
    private runtimeConfig: RuntimeConfigService,
    private authService: AuthService,
    private router: Router,
    private injector: Injector
  ) {
    this.apiUrl = this.runtimeConfig.getBaseUrl() + 'Auth';
  }

  start(): void {
    this.sessionEndSent = false;
    this.stop();
    this.monitoring = true;
    this.bindActivityListeners();
    this.resetInactivityTimer();
    try {
      this.injector.get(SessionTokenService).startProactiveRefreshScheduling();
    } catch {
      // SessionTokenService unavailable during early bootstrap.
    }
  }

  stop(): void {
    this.monitoring = false;
    this.clearInactivityTimers();
    this.unbindActivityListeners();
    if (this.warningVisible) {
      Swal.close();
      this.warningVisible = false;
    }
    try {
      this.injector.get(SessionTokenService).stopProactiveRefreshScheduling();
    } catch {
      // ignore
    }
  }

  /** Graceful logout with user-visible message (401, refresh failure, etc.). */
  handleSessionExpired(message = 'Your session has expired. Please sign in again.'): void {
    if (this.sessionExpiredHandling) return;
    this.sessionExpiredHandling = true;

    this.stop();

    if (Swal.isVisible()) {
      Swal.close();
    }

    Swal.fire({
      title: 'Session Expired',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Sign In',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).finally(() => {
      this.authService.clearLocalSession();
      this.router.navigate(['/authentication/signin']);
      this.sessionExpiredHandling = false;
    });
  }

  sendHeartbeat(): void {
    const payload = this.getSessionPayload();
    if (!payload) return;
    this.lastHeartbeatSent = Date.now();
    this.http.post(`${this.apiUrl}/session-heartbeat`, payload).subscribe({
      next: () => {
        void this.maybeRefreshTokenAfterHeartbeat();
      },
      error: (err: HttpErrorResponse) => {
        void this.handleHeartbeatError(err);
      },
    });
    try {
      this.injector.get(TabSessionCoordinatorService).refreshTabPresence();
    } catch {
      // Tab coordinator unavailable during early bootstrap.
    }
  }

  endSessionBeacon(inactivityLogout = false): void {
    if (this.sessionEndSent) return;

    const payload = this.getSessionPayload();
    if (!payload) return;

    this.sessionEndSent = true;
    this.monitoring = false;
    this.clearInactivityTimers();

    const body = {
      ...payload,
      inactivityLogout,
      InactivityLogout: inactivityLogout,
    };
    const json = JSON.stringify(body);
    const url = `${this.apiUrl}/session-end?inactivityLogout=${inactivityLogout ? 'true' : 'false'}`;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([json], { type: 'application/json' }));
    }

    try {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Best-effort during unload.
    }
  }

  private bindActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach((event) => document.addEventListener(event, this.activityHandler, { passive: true }));
  }

  private unbindActivityListeners(): void {
    const events = ['mousedown', 'keydown', 'click', 'scroll', 'touchstart'] as const;
    events.forEach((event) => document.removeEventListener(event, this.activityHandler));
    if (this.activityDebounceId) {
      clearTimeout(this.activityDebounceId);
      this.activityDebounceId = null;
    }
  }

  private onUserActivity(): void {
    if (!this.monitoring || this.warningVisible) return;
    if (this.activityDebounceId) return;

    this.activityDebounceId = setTimeout(() => {
      this.activityDebounceId = null;
      if (!this.monitoring || this.warningVisible) return;

      try {
        this.injector.get(TabSessionCoordinatorService).recordTabActivity();
      } catch {
        // ignore
      }

      this.resetInactivityTimer();
      this.sendHeartbeatIfDue();
    }, ACTIVITY_DEBOUNCE_MS);
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimers();
    this.warningTimeoutId = setTimeout(
      () => this.showInactivityWarning(),
      SESSION_WARNING_MS
    );
    this.logoutTimeoutId = setTimeout(
      () => this.performInactivityLogout(),
      SESSION_INACTIVITY_MS
    );
  }

  private clearInactivityTimers(): void {
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
    if (this.logoutTimeoutId) {
      clearTimeout(this.logoutTimeoutId);
      this.logoutTimeoutId = null;
    }
  }

  private showInactivityWarning(): void {
    if (!this.monitoring || this.warningVisible) return;

    let otherTabRecentlyActive = false;
    try {
      const coordinator = this.injector.get(TabSessionCoordinatorService);
      otherTabRecentlyActive = coordinator.hasOpenTabs();
    } catch {
      // proceed with default message
    }

    this.warningVisible = true;

    const defaultText = `Your Session will end in ${SESSION_INACTIVITY_WARNING_LEAD_MINUTES} minute(s).`;
    const text = otherTabRecentlyActive
      ? `You are inactive in this tab. ${defaultText} Another tab is still active.`
      : defaultText;

    Swal.fire({
      title: 'Session Timeout',
      text,
      icon: 'warning',
      confirmButtonText: 'Continue Session',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (!this.monitoring) return;
      this.warningVisible = false;
      if (result.isConfirmed) {
        this.resetInactivityTimer();
        this.sendHeartbeat();
      }
    });
  }

  private performInactivityLogout(): void {
    if (!this.monitoring) return;

    try {
      if (this.injector.get(TabSessionCoordinatorService).isSessionActive()) {
        this.resetInactivityTimer();
        return;
      }
    } catch {
      // proceed with logout
    }

    this.stop();

    const payload = this.getSessionPayload();
    if (!payload) {
      this.authService.clearLocalSession();
      this.router.navigate(['/authentication/signin']);
      return;
    }

    const body = {
      ...payload,
      inactivityLogout: true,
      InactivityLogout: true,
    };

    this.http.post(`${this.apiUrl}/session-end?inactivityLogout=true`, body).subscribe({
      next: () => {
        this.sessionEndSent = true;
        this.authService.clearLocalSession();
        this.router.navigate(['/authentication/signin']);
      },
      error: () => {
        this.endSessionBeacon(true);
        this.authService.clearLocalSession();
        this.router.navigate(['/authentication/signin']);
      },
    });
  }

  private async handleHeartbeatError(err: HttpErrorResponse): Promise<void> {
    if (err?.status !== 401 || !this.monitoring) return;

    try {
      const newToken = await this.injector.get(SessionTokenService).refreshToken();
      if (newToken) {
        this.sendHeartbeat();
        return;
      }
    } catch {
      // fall through to graceful logout
    }

    this.handleSessionExpired();
  }

  private sendHeartbeatIfDue(): void {
    const now = Date.now();
    if (now - this.lastHeartbeatSent < SESSION_HEARTBEAT_DEBOUNCE_MS) return;
    this.sendHeartbeat();
  }

  private async maybeRefreshTokenAfterHeartbeat(): Promise<void> {
    if (!this.monitoring) return;

    try {
      const sessionTokenService = this.injector.get(SessionTokenService);
      const tabCoordinator = this.injector.get(TabSessionCoordinatorService);
      if (!tabCoordinator.isSessionActive()) return;
      if (!sessionTokenService.isTokenNearExpiry()) return;
      await sessionTokenService.refreshIfActive();
    } catch {
      // ignore
    }
  }

  private getSessionPayload(): Record<string, unknown> | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      const sessionGuid = user?.SessionGuid ?? user?.sessionGuid;
      const employee = user?.employee ?? user?.Employee;
      const employeeID = employee?.EmployeeID ?? employee?.employeeID;
      if (!sessionGuid) return null;
      return { sessionGuid, SessionGuid: sessionGuid, employeeID, EmployeeID: employeeID };
    } catch {
      return null;
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
