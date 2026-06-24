import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RuntimeConfigService } from './runtime-config.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SessionHeartbeatService implements OnDestroy {
  // Production: keep in sync with EmployeeLoginSessionSettings on API (20 min timeout, 2 min warning).
  // UAT/local testing: temporarily use 2 / 1 / 30s debounce here and in EmployeeLoginSessionSettings.cs.
  private static readonly INACTIVITY_TIMEOUT_MINUTES = 20;
  private static readonly INACTIVITY_WARNING_LEAD_MINUTES = 2;
  private static readonly INACTIVITY_MS = SessionHeartbeatService.INACTIVITY_TIMEOUT_MINUTES * 60 * 1000;
  private static readonly WARNING_MS =
    (SessionHeartbeatService.INACTIVITY_TIMEOUT_MINUTES - SessionHeartbeatService.INACTIVITY_WARNING_LEAD_MINUTES) * 60 * 1000;

  private static readonly HEARTBEAT_DEBOUNCE_MS = 60 * 1000;
  private static readonly ACTIVITY_DEBOUNCE_MS = 1000;

  private readonly apiUrl: string;
  private warningTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private logoutTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private activityDebounceId: ReturnType<typeof setTimeout> | null = null;
  private lastHeartbeatSent = 0;
  private warningVisible = false;
  private monitoring = false;
  private sessionEndSent = false;

  private readonly activityHandler = () => this.onUserActivity();

  constructor(
    private http: HttpClient,
    private runtimeConfig: RuntimeConfigService,
    private authService: AuthService,
    private router: Router
  ) {
    this.apiUrl = this.runtimeConfig.getBaseUrl() + 'Auth';
  }

  start(): void {
    this.sessionEndSent = false;
    this.stop();
    this.monitoring = true;
    this.bindActivityListeners();
    this.resetInactivityTimer();
  }

  stop(): void {
    this.monitoring = false;
    this.clearInactivityTimers();
    this.unbindActivityListeners();
    if (this.warningVisible) {
      Swal.close();
      this.warningVisible = false;
    }
  }

  sendHeartbeat(): void {
    const payload = this.getSessionPayload();
    if (!payload) return;
    this.lastHeartbeatSent = Date.now();
    this.http.post(`${this.apiUrl}/session-heartbeat`, payload).subscribe({ error: () => {} });
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
      this.resetInactivityTimer();
      this.sendHeartbeatIfDue();
    }, SessionHeartbeatService.ACTIVITY_DEBOUNCE_MS);
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimers();
    this.warningTimeoutId = setTimeout(
      () => this.showInactivityWarning(),
      SessionHeartbeatService.WARNING_MS
    );
    this.logoutTimeoutId = setTimeout(
      () => this.performInactivityLogout(),
      SessionHeartbeatService.INACTIVITY_MS
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
    this.warningVisible = true;

    Swal.fire({
      title: 'Session Timeout',
      text: `Your Session will end in ${SessionHeartbeatService.INACTIVITY_WARNING_LEAD_MINUTES} minute(s).`,
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

    // session-end is AllowAnonymous; query flag ensures inactivity is recorded even if body binding fails.
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

  private sendHeartbeatIfDue(): void {
    const now = Date.now();
    if (now - this.lastHeartbeatSent < SessionHeartbeatService.HEARTBEAT_DEBOUNCE_MS) return;
    this.sendHeartbeat();
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
