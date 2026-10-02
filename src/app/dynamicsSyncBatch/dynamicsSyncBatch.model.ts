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
  return {
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
}
