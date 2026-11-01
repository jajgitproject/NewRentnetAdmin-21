// @ts-nocheck
import Swal from 'sweetalert2';

export interface CustomerInvoicingGstCustomerGroup {
  customerID: number;
  customerName: string;
  customerConfigurationInvoicingID: number;
  billingStateName: string;
  dutySlipIds: number[];
}

export interface CustomerInvoicingGstBatchCheckResult {
  requiresConfirmation: boolean;
  customers: CustomerInvoicingGstCustomerGroup[];
}

export interface CustomerInvoicingGstDutyCheckResult {
  requiresConfirmation: boolean;
  dutySlipID: number;
  customerID: number;
  customerName: string;
  customerConfigurationInvoicingID?: number;
  billingStateName?: string;
}

const NO_GSTN_MESSAGE = 'No GSTN in CustomerConfigurationInvoicing Table Proceed Yes / No';
const CREATE_CCI_MESSAGE = 'Create CustomerConfigurationInvoicing Record';

async function showCreateCciRecordMessage(): Promise<void> {
  await Swal.fire({
    title: 'Invoice not generated',
    text: CREATE_CCI_MESSAGE,
    icon: 'info',
    confirmButtonText: 'Ok',
  });
}

export async function confirmMissingGstnForSingleDuty(
  check: CustomerInvoicingGstDutyCheckResult
): Promise<{ proceed: boolean; acknowledgeMissingGstn: boolean }> {
  if (!check?.requiresConfirmation) {
    return { proceed: true, acknowledgeMissingGstn: false };
  }

  const result = await Swal.fire({
    title: 'Confirm',
    text: NO_GSTN_MESSAGE,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (result.isConfirmed) {
    return { proceed: true, acknowledgeMissingGstn: true };
  }

  await showCreateCciRecordMessage();
  return { proceed: false, acknowledgeMissingGstn: false };
}

export async function confirmMissingGstnForBatch(
  check: CustomerInvoicingGstBatchCheckResult,
  allDutySlipIds: number[]
): Promise<{
  proceed: boolean;
  dutiesToGenerate: number[];
  acknowledgeMissingGstnDutySlipIds: number[];
}> {
  if (!check?.requiresConfirmation) {
    return {
      proceed: true,
      dutiesToGenerate: allDutySlipIds,
      acknowledgeMissingGstnDutySlipIds: [],
    };
  }

  const acknowledgedDutySlipIds: number[] = [];
  const customers = check.customers || [];

  for (const customer of customers) {
    const dutySlipIds = customer.dutySlipIds || [];
    const count = dutySlipIds.length;
    const dutyLabel = count === 1 ? 'duty' : 'duties';
    const customerName = customer.customerName || 'Customer';

    const result = await Swal.fire({
      title: 'Confirm',
      text: `No GSTN in CustomerConfigurationInvoicing Table for ${customerName} (${count} ${dutyLabel}). Proceed Yes / No?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      acknowledgedDutySlipIds.push(...dutySlipIds);
    } else {
      await showCreateCciRecordMessage();
    }
  }

  const needsConfirmDutySet = new Set(
    customers.flatMap((customer) => customer.dutySlipIds || [])
  );
  const autoProceedDutySlipIds = allDutySlipIds.filter((id) => !needsConfirmDutySet.has(id));
  const dutiesToGenerate = [...autoProceedDutySlipIds, ...acknowledgedDutySlipIds];

  if (dutiesToGenerate.length === 0) {
    return { proceed: false, dutiesToGenerate: [], acknowledgeMissingGstnDutySlipIds: [] };
  }

  return {
    proceed: true,
    dutiesToGenerate,
    acknowledgeMissingGstnDutySlipIds: acknowledgedDutySlipIds,
  };
}

export function extractApiErrorMessage(error: any, fallback = 'Operation Failed.....!!!'): string {
  return error?.error?.message || error?.message || error || fallback;
}

/** Parses orphan invoice number from createInvoiceSingleDuty error message or payload. */
export function extractOrphanInvoiceNumber(message: string): string | null {
  if (!message || typeof message !== 'string') {
    return null;
  }
  const match = /orphan invoice\s+(\S+)(?:\s+dated\s+\S+)?\s+exists/i.exec(message);
  return match ? match[1] : null;
}

/** Parses orphan invoice date (ISO yyyy-MM-dd) from API payload or message "dated dd-MMM-yyyy". */
export function extractOrphanInvoiceDate(errorOrMessage: any): string | null {
  const fromPayload = errorOrMessage?.error?.orphanInvoiceDate || errorOrMessage?.orphanInvoiceDate;
  if (fromPayload && typeof fromPayload === 'string') {
    return fromPayload;
  }

  const message =
    typeof errorOrMessage === 'string'
      ? errorOrMessage
      : extractApiErrorMessage(errorOrMessage, '');
  const match = /dated\s+(\d{2})-([A-Za-z]{3})-(\d{4})\s+exists/i.exec(message || '');
  if (!match) {
    return null;
  }

  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthIndex = months.indexOf(match[2].toLowerCase());
  if (monthIndex < 0) {
    return null;
  }

  const yyyy = match[3];
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = match[1];
  return `${yyyy}-${mm}-${dd}`;
}

/** Label for orphan messages: "Invoice No X dated dd-MMM-yyyy" (date omitted if missing). */
export function formatOrphanInvoiceLabel(invoiceNo: string, invoiceDateIso?: string | null): string {
  if (!invoiceNo) {
    return '';
  }
  const dated = formatOrphanInvoiceDisplayDate(invoiceDateIso);
  return dated ? `Invoice No ${invoiceNo} dated ${dated}` : `Invoice No ${invoiceNo}`;
}

export function formatOrphanInvoiceDisplayDate(invoiceDateIso?: string | null): string | null {
  if (!invoiceDateIso) {
    return null;
  }

  const parts = String(invoiceDateIso).split(/[-T]/);
  if (parts.length < 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!year || !month || !day) {
    return null;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(day).padStart(2, '0')}-${months[month - 1]}-${year}`;
}
