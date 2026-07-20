// @ts-nocheck
export interface InvoicePaidStatusSearchCriteria {
  customerGroupID?: number | null;
  customerGroup?: string | null;
  customerID?: number | null;
  customerName?: string | null;
  invoiceDate?: string | null;
  paidStatus?: string | null;
  pageNumber?: number;
  pageSize?: number;
}

export interface InvoicePaidStatusSearchResult {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  rows: InvoicePaidStatusRow[];
}

export interface InvoicePaidStatusRow {
  invoiceID: number;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  paidStatus: string;
  isPaid: boolean;
  invoicePaidStatusID?: number | null;
  paidStatusBy?: string | null;
  paidMarkedDate?: string | null;
  paidMarkedTime?: string | null;
}

export interface InvoicePaidStatusMarkRequest {
  invoiceIDs: number[];
  paidStatus: boolean;
}

export interface InvoicePaidStatusMarkResult {
  successCount: number;
  failureCount: number;
  message: string;
  errors?: string[];
}

export interface InvoicePaidStatusHistoryRow {
  invoiceHistoryID: number;
  invoiceID: number;
  invoiceNumberWithPrefix?: string;
  action?: string;
  listOfDuties?: string;
  actionByID?: number;
  actionBy?: string;
  actionDate?: string;
  actionTime?: string;
}
