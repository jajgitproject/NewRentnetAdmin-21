// @ts-nocheck
// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  /** When set, RolePageMapping / guards match this instead of `title` (DB Page name). */
  pageKey?: string;
  /** Extra DB `Page` names that grant access to this same route (e.g. context-menu labels vs sidebar title). */
  alternateAccessPageKeys?: string[];
  moduleName: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  submenu: RouteInfo[];
  isAccess: boolean;
}

