export interface DynamicsSyncBatch {
  dynamicsSyncBatchID: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  batchCreatedByID: number;
  batchCreatedByName?: string;
  numberofItems: number;
  numberofSuccessfulItems: number;
  numberofFailedItems: number;
  batchStatus: string;
  items?: DynamicsSyncItem[];
}

export interface DynamicsSyncItem {
  dynamicsSyncID: number;
  dynamicsSyncBatchID: number;
  invoiceID: number;
  documentType?: string;
  invoiceNumberWithPrefix?: string;
  syncStatus: string;
  syncDate?: string;
  syncTime?: string;
  requestEndPoint?: string;
  requestPayload?: string;
  response?: string;
  responseCode?: string;
  responseStatus?: string;
  responseDate?: string;
  responseTime?: string;
}

export interface DynamicsSyncBatchStartResult {
  dynamicsSyncBatchID: number;
  numberofItems: number;
  batchStatus: string;
  message: string;
}

function readNumber(row: any, camel: string, pascal: string, fallback = 0): number {
  const value = row?.[camel] ?? row?.[pascal];
  return value === null || value === undefined ? fallback : Number(value);
}

function readString(row: any, camel: string, pascal: string, fallback = ''): string {
  const value = row?.[camel] ?? row?.[pascal];
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object' && value !== null) {
    const hours = value.hours ?? value.Hours;
    const minutes = value.minutes ?? value.Minutes;
    const seconds = value.seconds ?? value.Seconds;
    if (hours !== undefined && minutes !== undefined && seconds !== undefined) {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
  }
  return String(value);
}

export const DYNAMICS_MISSING_CUSTOMER_SEGMENT_MARKER = "Can't Sync this Batch";

export function findCustomerSegmentConfigurationMessage(batch: DynamicsSyncBatch | null | undefined): string | null {
  if (!batch?.items?.length) {
    return null;
  }
  for (const item of batch.items) {
    const parts = [item.response, item.responseStatus].filter((value) => !!String(value || '').trim());
    const combined = parts.join(' ');
    if (
      combined.includes('is not configured with Customer Segment')
      || combined.includes(DYNAMICS_MISSING_CUSTOMER_SEGMENT_MARKER)
    ) {
      return combined;
    }
  }
  return null;
}

export function mapDynamicsSyncBatch(row: any): DynamicsSyncBatch {
  return {
    dynamicsSyncBatchID: readNumber(row, 'dynamicsSyncBatchID', 'DynamicsSyncBatchID'),
    startDate: readString(row, 'startDate', 'StartDate'),
    startTime: readString(row, 'startTime', 'StartTime'),
    endDate: readString(row, 'endDate', 'EndDate') || undefined,
    endTime: readString(row, 'endTime', 'EndTime') || undefined,
    batchCreatedByID: readNumber(row, 'batchCreatedByID', 'BatchCreatedByID'),
    batchCreatedByName: readString(row, 'batchCreatedByName', 'BatchCreatedByName') || undefined,
    numberofItems: readNumber(row, 'numberofItems', 'NumberofItems'),
    numberofSuccessfulItems: readNumber(row, 'numberofSuccessfulItems', 'NumberofSuccessfulItems'),
    numberofFailedItems: readNumber(row, 'numberofFailedItems', 'NumberofFailedItems'),
    batchStatus: readString(row, 'batchStatus', 'BatchStatus', 'Processing'),
    items: (row?.items || row?.Items || []).map(mapDynamicsSyncItem)
  };
}

export function mapDynamicsSyncItem(row: any): DynamicsSyncItem {
  const item: DynamicsSyncItem = {
    dynamicsSyncID: readNumber(row, 'dynamicsSyncID', 'DynamicsSyncID'),
    dynamicsSyncBatchID: readNumber(row, 'dynamicsSyncBatchID', 'DynamicsSyncBatchID'),
    invoiceID: readNumber(row, 'invoiceID', 'InvoiceID'),
    documentType: readString(row, 'documentType', 'DocumentType') || undefined,
    invoiceNumberWithPrefix: readString(row, 'invoiceNumberWithPrefix', 'InvoiceNumberWithPrefix') || undefined,
    syncStatus: readString(row, 'syncStatus', 'SyncStatus', 'Unprocessed'),
    syncDate: readString(row, 'syncDate', 'SyncDate') || undefined,
    syncTime: readString(row, 'syncTime', 'SyncTime') || undefined,
    requestEndPoint: readString(row, 'requestEndPoint', 'RequestEndPoint') || undefined,
    requestPayload: readString(row, 'requestPayload', 'RequestPayload') || undefined,
    response: readString(row, 'response', 'Response') || undefined,
    responseCode: readString(row, 'responseCode', 'ResponseCode') || undefined,
    responseStatus: readString(row, 'responseStatus', 'ResponseStatus') || undefined,
    responseDate: readString(row, 'responseDate', 'ResponseDate') || undefined,
    responseTime: readString(row, 'responseTime', 'ResponseTime') || undefined
  };
  return applyCreatedSyncPresentation(item);
}

export interface DynamicsSyncPresentation {
  responseCode?: string;
  responseStatus?: string;
  response?: string;
}

/** Show 201 Created on the first paint when Dynamics reported 400 for a create that succeeded. */
export function applyCreatedSyncPresentation<T extends DynamicsSyncPresentation>(item: T, documentKind?: 'invoice' | 'creditNote'): T {
  if (!item || !shouldPresentAsCreated(item)) {
    return item;
  }

  item.responseCode = '201';
  item.responseStatus = 'Created';
  if (String((item as { syncStatus?: string }).syncStatus || '').toLowerCase() !== 'successful') {
    (item as { syncStatus?: string }).syncStatus = 'Successful';
  }
  if (shouldReplaceResponseBody(item.response)) {
    const source = item as DynamicsSyncPresentation & { invoiceNumberWithPrefix?: string; documentType?: string };
    const number = source.invoiceNumberWithPrefix?.trim();
    const creditNote = documentKind === 'creditNote'
      || String(source.documentType || '').toLowerCase() === 'creditnote';
    const label = creditNote ? 'Credit note' : 'Invoice';
    item.response = number ? `${label} ${number} created in Dynamics.` : `${label} created in Dynamics.`;
  }
  return item;
}

function shouldPresentAsCreated(item: DynamicsSyncPresentation & { syncStatus?: string }): boolean {
  const code = String(item.responseCode || '').trim();
  const status = String(item.responseStatus || '').trim();
  const statusKey = status.replace(/\s+/g, '').toLowerCase();
  const syncStatus = String(item.syncStatus || '').trim().toLowerCase();
  const body = String(item.response || '');
  const alreadyExists = containsAlreadyExists(body) || containsAlreadyExists(status);

  if (statusKey === 'created' || statusKey === 'alreadyexists') {
    return true;
  }
  const badRequest = code === '400'
    || statusKey === 'badrequest'
    || statusKey === '400badrequest'
    || status.toLowerCase().includes('bad request');
  if (syncStatus === 'successful' && (badRequest || code === '200' || code === '201' || alreadyExists)) {
    return true;
  }
  return badRequest && alreadyExists;
}

function shouldReplaceResponseBody(response?: string): boolean {
  const trimmed = String(response || '').trim();
  if (!trimmed) {
    return true;
  }
  const lower = trimmed.toLowerCase();
  return lower.startsWith('{"error"')
    || lower.includes('bad request')
    || lower.includes('badrequest')
    || containsAlreadyExists(trimmed);
}

function containsAlreadyExists(value: string): boolean {
  const lower = String(value || '').toLowerCase();
  return lower.includes('already exists') || lower.includes('internal_entitywithsamekeyexists');
}
