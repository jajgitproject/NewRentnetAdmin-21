// @ts-nocheck
import { RouteInfo } from '../../layout/sidebar/sidebar.metadata';

/** Same normalization as RolePageMapping rows (Page name vs menu label). */
export function normalizeMenuPageKey(s: string | undefined | null): string {
  return String(s || '')
    .toLowerCase()
    .replace(/[\s\-_]+/g, '');
}

function isRoleMappingRowActive(status: any): boolean {
  if (status === true || status === 1) {
    return true;
  }
  const s = String(status ?? '').toLowerCase().trim();
  return s === 'true' || s === '1' || s === 'active' || s === 'yes';
}

/** Normalized keys from title, optional pageKey, path/moduleName (DB often stores route id), and optional DB aliases (deduped). */
export function routeAccessNormalizedKeys(route: RouteInfo): string[] {
  const raw: string[] = [route.pageKey || route.title];
  if (route.path) {
    raw.push(route.path);
  }
  if (route.moduleName && route.moduleName !== route.path) {
    raw.push(route.moduleName);
  }
  if (route.alternateAccessPageKeys?.length) {
    raw.push(...route.alternateAccessPageKeys);
  }
  const keys = new Set<string>();
  for (const s of raw) {
    const k = normalizeMenuPageKey(s);
    if (k) {
      keys.add(k);
    }
  }
  return Array.from(keys);
}

export function buildAccessPagesArrayFromApi(
  data: any[]
): { page: string; pageID: number }[] {
  const accessPagesArray: { page: string; pageID: number }[] = [];
  data?.forEach((element) => {
    const activation = element?.activationStatus ?? element?.ActivationStatus;
    const pageName = element?.page ?? element?.Page;
    const pageID = Number(element?.pageID ?? element?.PageID ?? -1);
    if (!isRoleMappingRowActive(activation)) {
      return;
    }
    const page = normalizeMenuPageKey(pageName);
    if (page) {
      accessPagesArray.push({ pageID, page });
    }
  });
  return accessPagesArray;
}

/**
 * Sets isAccess on every node: group headers stay true; folders stay false;
 * leaves match accessPages by pageKey or title (normalized).
 */
export function applyMenuAccessRecursive(
  routes: RouteInfo[],
  accessPagesArray: { page: string }[]
): void {
  if (!routes) return;
  for (const r of routes) {
    if (r.groupTitle) {
      r.isAccess = true;
      if (r.submenu?.length) {
        applyMenuAccessRecursive(r.submenu, accessPagesArray);
      }
      continue;
    }
    if (r.submenu?.length) {
      applyMenuAccessRecursive(r.submenu, accessPagesArray);
      r.isAccess = false;
    } else {
      const keys = routeAccessNormalizedKeys(r);
      r.isAccess = keys.some((key) => accessPagesArray.some((p) => p.page === key));
    }
  }
}

export function denyAllMenuAccess(routes: RouteInfo[]): void {
  if (!routes) return;
  for (const r of routes) {
    if (r.groupTitle) {
      r.isAccess = true;
    } else {
      r.isAccess = false;
    }
    if (r.submenu?.length) {
      denyAllMenuAccess(r.submenu);
    }
  }
}

export function findSidebarRouteByPath(
  routes: RouteInfo[],
  segment: string
): RouteInfo | null {
  for (const r of routes || []) {
    if (r.path === segment) {
      return r;
    }
    const found = findSidebarRouteByPath(r.submenu || [], segment);
    if (found) {
      return found;
    }
  }
  return null;
}

export function routePageAllowed(
  routeNode: RouteInfo,
  accessPages: { page: string }[]
): boolean {
  if (routeNode.groupTitle) {
    return true;
  }
  const keys = routeAccessNormalizedKeys(routeNode);
  if (!keys.length) {
    return false;
  }
  return keys.some((key) => accessPages.some((p) => p.page === key));
}
