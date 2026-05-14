// @ts-nocheck
// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  /** When set, RolePageMapping / guards match this instead of `title` (DB Page name). */
  pageKey?: string;
  moduleName: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  submenu: RouteInfo[];
  isAccess: boolean;
}

