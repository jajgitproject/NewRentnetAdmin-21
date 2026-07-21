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
