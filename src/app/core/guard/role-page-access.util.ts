// @ts-nocheck
import { RouteInfo } from '../../layout/sidebar/sidebar.metadata';

/** Same normalization as RolePageMapping rows (Page name vs menu label). */
export function normalizeMenuPageKey(s: string | undefined | null): string {
  return String(s || '')
    .toLowerCase()
    .replace(/\s+/g, '');
}

export function buildAccessPagesArrayFromApi(
  data: any[]
): { page: string; pageID: number }[] {
  const accessPagesArray: { page: string; pageID: number }[] = [];
  data?.forEach((element) => {
    if (element.activationStatus) {
      accessPagesArray.push({
        pageID: element.pageID,
        page: normalizeMenuPageKey(element.page),
      });
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
      const key = normalizeMenuPageKey(r.pageKey || r.title);
      r.isAccess = !!(key && accessPagesArray.some((p) => p.page === key));
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
  const key = normalizeMenuPageKey(routeNode.pageKey || routeNode.title);
  if (!key) {
    return false;
  }
  return accessPages.some((p) => p.page === key);
}
