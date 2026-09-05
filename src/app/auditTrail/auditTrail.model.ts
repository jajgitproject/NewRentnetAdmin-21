export interface AuditChangedField {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface AuditTrailEvent {
  eventId: string;
  timestampUtc: string;
  module: string;
  formName: string;
  tableName: string;
  operation: string;
  reservationId: number | null;
  allotmentId: number | null;
  recordId: string;
  userId: number | null;
  userDisplayName: string | null;
  oldDriver?: string | null;
  newDriver?: string | null;
  beforeJson?: string;
  afterJson?: string;
  changedFields?: AuditChangedField[];
}

export interface AuditTrailQueryInterpretation {
  module: string | null;
  reservationId: number | null;
  allotmentId: number | null;
  userId: number | null;
  userDisplayName: string | null;
  fromDate: string | null;
  toDate: string | null;
  operation: string | null;
  searchText: string | null;
  warnings: string[];
}

export interface AuditTrailNlpQueryResponse {
  interpretation: AuditTrailQueryInterpretation;
  warnings: string[];
  events: AuditTrailEvent[];
}
