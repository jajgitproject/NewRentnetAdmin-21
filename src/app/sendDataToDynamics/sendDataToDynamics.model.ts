// @ts-nocheck
export class SendDataToDynamicsInvoice {
  customerID: number;
  customerName: string;
  customerGroupID: number;
  invoiceID: number;
  branchID: number;
  customerGroup: string;
  invoiceDate: Date;
  invoiceTotalAmountAfterGST: number;
  branchName: string;
  invoiceStatusActiveOrVoid: string;
  invoiceNumberWithPrefix: string;
  totalCreditNoteAmount: number;
  activationStatus: boolean;
  invoiceType: string;
  iRN: string;
  irnStatus: string;
  templateAddress: string;
  customerGSTNumber: string;
  invoiceGstStatus: string;
  isGstInvoice: boolean;
  invoiceSyncStatus: string;
  canSelectForDynamics: boolean;

  constructor(row: any) {
    this.customerID = row?.customerID || 0;
    this.customerName = row?.customerName || '';
    this.customerGroupID = row?.customerGroupID || 0;
    this.invoiceID = row?.invoiceID || 0;
    this.branchID = row?.branchID || 0;
    this.customerGroup = row?.customerGroup || '';
    this.invoiceDate = row?.invoiceDate || '';
    this.invoiceTotalAmountAfterGST = row?.invoiceTotalAmountAfterGST || 0;
    this.branchName = row?.branchName || '';
    this.invoiceStatusActiveOrVoid = row?.invoiceStatusActiveOrVoid || '';
    this.invoiceNumberWithPrefix = row?.invoiceNumberWithPrefix || '';
    this.totalCreditNoteAmount = row?.totalCreditNoteAmount || 0;
    this.activationStatus = row?.activationStatus || false;
    this.invoiceType = row?.invoiceType || '';
    this.iRN = row?.iRN || row?.irn || '';
    this.irnStatus = row?.irnStatus || '';
    this.templateAddress = row?.templateAddress || '';
    this.customerGSTNumber = (row?.customerGSTNumber || '').trim();
    this.invoiceGstStatus = row?.invoiceGstStatus || (this.customerGSTNumber ? 'GST' : 'NonGST');
    this.isGstInvoice = row?.isGstInvoice === true || this.invoiceGstStatus === 'GST';
    this.invoiceSyncStatus = row?.invoiceSyncStatus || 'Unprocessed';
    if (row?.canSelectForDynamics === true || row?.canSelectForDynamics === false) {
      this.canSelectForDynamics = row.canSelectForDynamics;
    } else {
      this.canSelectForDynamics = this.invoiceSyncStatus !== 'Successful'
        && (!this.isGstInvoice || String(this.irnStatus || '').trim().toLowerCase() === 'generated');
    }
  }
}
