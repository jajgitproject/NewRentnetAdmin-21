import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { SessionHeartbeatService } from './session-heartbeat.service';
import { AuthService } from './auth.service';
import { SessionTokenService } from './session-token.service';
import { SESSION_ACTIVE_MS, SESSION_TAB_STALE_MS } from './session-settings';

type TabRegistry = Record<string, number>;

interface LogoutBroadcastMessage {
  type: 'LOGOUT';
  sessionGuid: string;
}

interface ActivityBroadcastMessage {
  type: 'ACTIVITY';
  sessionGuid: string;
  tabId: string;
  timestamp: number;
}

interface TokenRefreshedBroadcastMessage {
  type: 'TOKEN_REFRESHED';
  sessionGuid: string;
  token: string;
}

type BroadcastMessage =
  | LogoutBroadcastMessage
  | ActivityBroadcastMessage
  | TokenRefreshedBroadcastMessage;

@Injectable({ providedIn: 'root' })
export class TabSessionCoordinatorService {
  private static readonly TAB_ID_KEY = 'rentnet_tab_id';
  private static readonly EXPLICIT_LOGOUT_KEY = 'rentnet_explicit_logout';
  private static readonly OPEN_TABS_PREFIX = 'rentnet_open_tabs_';
  private static readonly CHANNEL_NAME = 'rentnet-session';
  private static readonly STALE_MS = SESSION_TAB_STALE_MS;
  private static readonly SESSION_ACTIVE_MS = SESSION_ACTIVE_MS;

  private tabClosingHandled = false;
  private skipSessionEndOnClose = false;
  private channel: BroadcastChannel | null = null;
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private initialized = false;
  private tabId: string | null = null;

  constructor(
    private injector: Injector,
    private router: Router
  ) {}

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(TabSessionCoordinatorService.CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
        this.handleBroadcast(event.data);
      };
    }

    this.storageListener = (event: StorageEvent) => {
      if (event.key === TabSessionCoordinatorService.EXPLICIT_LOGOUT_KEY && event.newValue) {
        this.handleExplicitLogoutFlag(event.newValue);
      }
    };
    window.addEventListener('storage', this.storageListener);

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('pageshow', this.onPageShow);

    this.registerTab();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (
      event.key === 'F5' ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r')
    ) {
      this.skipSessionEndOnClose = true;
    }
  };

  private readonly onPageShow = (event: PageTransitionEvent): void => {
    this.skipSessionEndOnClose = false;
    if (event.persisted) return;
    this.tabClosingHandled = false;
    this.registerTab();
  };

  registerTab(): void {
    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid) return;

    this.tabId = this.ensureTabId();
    this.tabClosingHandled = false;
    this.upsertTabInRegistry(sessionGuid, this.tabId, Date.now());
  }

  refreshTabPresence(): void {
    this.recordTabActivity();
  }

  recordTabActivity(): void {
    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid) return;

    this.tabId = this.ensureTabId();
    const now = Date.now();
    this.upsertTabInRegistry(sessionGuid, this.tabId, now, true);

    const message: ActivityBroadcastMessage = {
      type: 'ACTIVITY',
      sessionGuid,
      tabId: this.tabId,
      timestamp: now,
    };
    this.channel?.postMessage(message);
  }

  /** True if any tab was seen within the short stale window (tab-close / multi-tab sync). */
  hasOpenTabs(): boolean {
    return this.hasRecentActivityInAnyTab();
  }

  hasRecentActivityInAnyTab(): boolean {
    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid) return false;

    const registry = this.pruneTabsOlderThan(
      this.readRegistry(sessionGuid),
      Date.now(),
      TabSessionCoordinatorService.STALE_MS
    );
    return Object.keys(registry).length > 0;
  }

  /** True if any tab had activity within the full inactivity timeout window (120 min). */
  isSessionActive(): boolean {
    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid) return false;

    const registry = this.pruneTabsOlderThan(
      this.readRegistry(sessionGuid),
      Date.now(),
      TabSessionCoordinatorService.SESSION_ACTIVE_MS
    );
    return Object.keys(registry).length > 0;
  }

  broadcastRefreshedToken(token: string): void {
    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid || !token) return;

    const message: TokenRefreshedBroadcastMessage = {
      type: 'TOKEN_REFRESHED',
      sessionGuid,
      token,
    };
    this.channel?.postMessage(message);
  }

  applyRefreshedToken(token: string): void {
    if (!token) return;
    try {
      this.injector.get(AuthService).updateToken(token);
    } catch {
      // AuthService unavailable during early bootstrap.
    }
  }

  /** Call before explicit logout API so other tabs and unload handlers stay in sync. */
  prepareExplicitLogout(): void {
    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid) return;

    this.tabClosingHandled = true;
    localStorage.setItem(
      TabSessionCoordinatorService.EXPLICIT_LOGOUT_KEY,
      sessionGuid
    );
    this.clearTabRegistry(sessionGuid);

    const message: LogoutBroadcastMessage = { type: 'LOGOUT', sessionGuid };
    this.channel?.postMessage(message);
  }

  onTabClosing(event?: PageTransitionEvent): void {
    if (this.tabClosingHandled) return;
    if (event?.persisted) return;

    const sessionGuid = this.getSessionGuid();
    if (!sessionGuid || !this.tabId) return;

    if (this.isExplicitLogout(sessionGuid)) {
      this.tabClosingHandled = true;
      return;
    }

    this.tabClosingHandled = true;

    const isLastTab = this.unregisterTab(sessionGuid, this.tabId);
    if (isLastTab && !this.skipSessionEndOnClose && !this.isExplicitLogout(sessionGuid)) {
      this.injector.get(SessionHeartbeatService).endSessionBeacon(false);
    }
  }

  clearCoordinatorState(sessionGuid?: string | null): void {
    const guid = sessionGuid ?? this.getSessionGuid();
    if (guid) {
      this.clearTabRegistry(guid);
      const flag = localStorage.getItem(TabSessionCoordinatorService.EXPLICIT_LOGOUT_KEY);
      if (flag === guid) {
        localStorage.removeItem(TabSessionCoordinatorService.EXPLICIT_LOGOUT_KEY);
      }
    }
    try {
      sessionStorage.removeItem(TabSessionCoordinatorService.TAB_ID_KEY);
    } catch {
      // ignore
    }
    this.tabId = null;
    this.tabClosingHandled = false;
  }

  private handleBroadcast(message: BroadcastMessage | undefined): void {
    if (!message) return;

    switch (message.type) {
      case 'LOGOUT':
        this.handleExplicitLogoutFlag(message.sessionGuid);
        break;
      case 'ACTIVITY':
        this.handleActivityBroadcast(message);
        break;
      case 'TOKEN_REFRESHED':
        this.handleTokenRefreshedBroadcast(message);
        break;
    }
  }

  private handleActivityBroadcast(message: ActivityBroadcastMessage): void {
    const currentGuid = this.getSessionGuid();
    if (!currentGuid || currentGuid !== message.sessionGuid) return;
    if (!message.tabId) return;

    this.upsertTabInRegistry(message.sessionGuid, message.tabId, message.timestamp, true);
  }

  private handleTokenRefreshedBroadcast(message: TokenRefreshedBroadcastMessage): void {
    const currentGuid = this.getSessionGuid();
    if (!currentGuid || currentGuid !== message.sessionGuid) return;

    try {
      this.injector.get(AuthService).updateToken(message.token);
      this.injector.get(SessionTokenService).scheduleProactiveRefresh();
    } catch {
      // Services unavailable during early bootstrap.
    }
  }

  private handleExplicitLogoutFlag(sessionGuid: string): void {
    const currentGuid = this.getSessionGuid();
    if (!currentGuid || currentGuid !== sessionGuid) return;

    this.tabClosingHandled = true;
    this.clearTabRegistry(sessionGuid);
    this.injector.get(AuthService).clearLocalSession();
    this.router.navigate(['/authentication/signin']);
  }

  private ensureTabId(): string {
    try {
      const existing = sessionStorage.getItem(TabSessionCoordinatorService.TAB_ID_KEY);
      if (existing) return existing;

      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(TabSessionCoordinatorService.TAB_ID_KEY, id);
      return id;
    } catch {
      return `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  }

  private getRegistryKey(sessionGuid: string): string {
    return `${TabSessionCoordinatorService.OPEN_TABS_PREFIX}${sessionGuid}`;
  }

  private readRegistry(sessionGuid: string): TabRegistry {
    try {
      const raw = localStorage.getItem(this.getRegistryKey(sessionGuid));
      if (!raw) return {};
      const parsed = JSON.parse(raw) as TabRegistry;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private writeRegistry(sessionGuid: string, registry: TabRegistry): void {
    const key = this.getRegistryKey(sessionGuid);
    if (Object.keys(registry).length === 0) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(registry));
  }

  private clearTabRegistry(sessionGuid: string): void {
    localStorage.removeItem(this.getRegistryKey(sessionGuid));
  }

  private pruneStaleTabs(registry: TabRegistry, now: number): TabRegistry {
    return this.pruneTabsOlderThan(registry, now, TabSessionCoordinatorService.STALE_MS);
  }

  private pruneTabsOlderThan(registry: TabRegistry, now: number, maxAgeMs: number): TabRegistry {
    const pruned: TabRegistry = {};
    for (const [id, lastSeen] of Object.entries(registry)) {
      if (now - lastSeen < maxAgeMs) {
        pruned[id] = lastSeen;
      }
    }
    return pruned;
  }

  private upsertTabInRegistry(
    sessionGuid: string,
    tabId: string,
    lastSeen: number,
    pruneStale = false
  ): void {
    let registry = this.readRegistry(sessionGuid);
    if (pruneStale) {
      registry = this.pruneStaleTabs(registry, lastSeen);
    }
    registry[tabId] = lastSeen;
    this.writeRegistry(sessionGuid, registry);
  }

  private unregisterTab(sessionGuid: string, tabId: string): boolean {
    const registry = this.readRegistry(sessionGuid);
    delete registry[tabId];
    const remaining = Object.keys(registry);
    if (remaining.length === 0) {
      this.clearTabRegistry(sessionGuid);
      return true;
    }
    this.writeRegistry(sessionGuid, registry);
    return false;
  }

  private isExplicitLogout(sessionGuid: string): boolean {
    return localStorage.getItem(TabSessionCoordinatorService.EXPLICIT_LOGOUT_KEY) === sessionGuid;
  }

  private getSessionGuid(): string | null {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;
      const user = JSON.parse(raw);
      const sessionGuid = user?.SessionGuid ?? user?.sessionGuid;
      return sessionGuid ? String(sessionGuid) : null;
    } catch {
      return null;
    }
  }
}
