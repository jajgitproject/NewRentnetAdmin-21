// @ts-nocheck
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ROUTES } from '../../layout/sidebar/sidebar-items';
import { RolePageMappingService } from '../../rolePageMapping/rolePageMapping.service';
import { AuthService } from '../service/auth.service';
import {
  buildAccessPagesArrayFromApi,
  findSidebarRouteByPath,
  normalizeMenuPageKey,
  routePageAllowed,
} from './role-page-access.util';

@Injectable({ providedIn: 'root' })
export class RolePageGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private roleMapService: RolePageMappingService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (this.walkSkipRolePageGuard(route)) {
      return true;
    }

    const user = this.auth.currentUserValue;
    if (!user?.employee?.RoleID) {
      return this.router.parseUrl('/authentication/signin');
    }

    const cached = this.readAccessPagesFromStorage();
    if (cached !== null) {
      return this.evaluate(state, route, cached);
    }

    return this.roleMapService.getTableData(null, user.employee.RoleID, true, 0).pipe(
      tap((data) => {
        const arr = buildAccessPagesArrayFromApi(data || []);
        localStorage.setItem('accessPages', JSON.stringify(arr));
      }),
      catchError(() => {
        localStorage.setItem('accessPages', JSON.stringify([]));
        return of([]);
      }),
      map(() => {
        const pages = this.readAccessPagesFromStorage();
        return this.evaluate(state, route, pages || []);
      })
    );
  }

  private walkSkipRolePageGuard(route: ActivatedRouteSnapshot): boolean {
    let r: ActivatedRouteSnapshot | null = route;
    while (r) {
      if (r.data && r.data.skipRolePageGuard) {
        return true;
      }
      r = r.firstChild;
    }
    return false;
  }

  /** Returns null if the key is absent (not yet loaded). */
  private readAccessPagesFromStorage(): { page: string; pageID?: number }[] | null {
    const raw = localStorage.getItem('accessPages');
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private evaluate(
    state: RouterStateSnapshot,
    activated: ActivatedRouteSnapshot,
    accessPages: { page: string }[]
  ): boolean | UrlTree {
    const segment = this.firstUrlSegment(state.url);
    if (!segment) {
      return true;
    }

    const leaf = this.deepestChild(activated);
    const overrideKey = leaf?.data?.requiredPageKey;
    if (overrideKey) {
      const k = normalizeMenuPageKey(overrideKey);
      const ok = !!(k && accessPages.some((p) => p.page === k));
      return ok ? true : this.router.parseUrl('/dashboard');
    }

    const meta = findSidebarRouteByPath(ROUTES, segment);
    if (!meta) {
      return true;
    }
    const allowed = routePageAllowed(meta, accessPages);
    if (allowed) {
      return true;
    }
    if (
      segment === 'driverInventoryAssociation' &&
      this.isDriverInventoryEncryptedDeepLink(state.url)
    ) {
      return true;
    }
    return this.router.parseUrl('/dashboard');
  }

  /** Same-app context menu opens CryptoJS ciphertext in query; Page table names may not match route keys. */
  private isDriverInventoryEncryptedDeepLink(url: string): boolean {
    try {
      const tree = this.router.parseUrl(url);
      const q = tree.queryParams || {};
      const driverId = String(q['DriverID'] ?? '');
      const invId = String(q['InventoryID'] ?? '');
      const looksLikeCipher = (v: string) => {
        if (!v || v.length < 24) {
          return false;
        }
        return v.startsWith('U2FsdGVk') || /^[A-Za-z0-9+%/_=-]+$/.test(v);
      };
      return looksLikeCipher(driverId) || looksLikeCipher(invId);
    } catch {
      return false;
    }
  }

  private deepestChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let r: ActivatedRouteSnapshot = route;
    while (r.firstChild) {
      r = r.firstChild;
    }
    return r;
  }

  private firstUrlSegment(url: string): string {
    try {
      const tree = this.router.parseUrl(url);
      const primary = tree.root.children['primary'];
      if (primary?.segments?.length) {
        return primary.segments[0].path;
      }
    } catch {
      /* fall through */
    }
    const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
    const parts = clean.split('/').filter((p) => p);
    return parts[0] || '';
  }
}
