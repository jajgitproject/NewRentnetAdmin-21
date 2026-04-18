// @ts-nocheck
export interface AuditTrailEvent {
  auditEventId: number;
  eventAtUtc: string;
  tableName: string;
  formName?: string | null;
  operation: string;
  userId: number | null;
  correlationId: string | null;
  rowCount: number;
  hostName?: string | null;
  appName?: string | null;
  loginName?: string | null;
}

export interface AuditTrailRow {
  auditEventRowId: number;
  rowOrdinal: number;
  formName?: string | null;
  primaryKeyJson: string | null;
  beforeJson: string | null;
  afterJson: string | null;
}

/** Groups audit events by SQL table for reservation-centric view */
export interface AuditTrailTableGroup {
  tableKey: string;
  tableLabel: string;
  events: AuditTrailEvent[];
}


