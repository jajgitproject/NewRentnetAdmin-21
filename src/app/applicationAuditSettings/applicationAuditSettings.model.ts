// @ts-nocheck
export interface ApplicationAuditPageSettingRow {
  pageID?: number;
  PageID?: number;
  pageKey?: string;
  PageKey?: string;
  path?: string;
  Path?: string;
  isEnabled?: boolean;
  IsEnabled?: boolean;
  effectiveSource?: string;
  EffectiveSource?: string;
  modifiedBy?: number;
  ModifiedBy?: number;
  modifiedByName?: string;
  ModifiedByName?: string;
  modifiedDate?: string;
  ModifiedDate?: string;
}

export interface ApplicationAuditPageSettingUpdate {
  pageKey: string;
  isEnabled: boolean;
}
