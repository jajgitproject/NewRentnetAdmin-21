// @ts-nocheck
export class SendCreditNotesToDynamicsCreditNote {
  invoiceCreditNoteID: number;
  invoiceID: number;
  customerID: number;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  branchID: number;
  branchName: string;
  creditNoteDate: Date;
  creditNoteAmount: number;
  creditNoteNumberWithPrefix: string;
  invoiceNumberWithPrefix: string;
  invoiceType: string;
  approvalStatus: string;
  irn: string;
  irnStatus: string;
  customerGSTNumber: string;
  creditNoteGstStatus: string;
  isGstCreditNote: boolean;
  creditNoteSyncStatus: string;
  canSelectForDynamics: boolean;

  constructor(row: any) {
    this.invoiceCreditNoteID = row?.invoiceCreditNoteID || 0;
    this.invoiceID = row?.invoiceID || 0;
    this.customerID = row?.customerID || 0;
    this.customerName = row?.customerName || '';
    this.customerGroupID = row?.customerGroupID || 0;
    this.customerGroup = row?.customerGroup || '';
    this.branchID = row?.branchID || 0;
    this.branchName = row?.branchName || '';
    this.creditNoteDate = row?.creditNoteDate || '';
    this.creditNoteAmount = row?.creditNoteAmount || 0;
    this.creditNoteNumberWithPrefix = row?.creditNoteNumberWithPrefix || '';
    this.invoiceNumberWithPrefix = row?.invoiceNumberWithPrefix || '';
    this.invoiceType = row?.invoiceType || '';
    this.approvalStatus = row?.approvalStatus || '';
    this.irn = row?.irn || row?.iRN || '';
    this.irnStatus = row?.irnStatus || '';
    this.customerGSTNumber = (row?.customerGSTNumber || '').trim();
    this.creditNoteGstStatus = row?.creditNoteGstStatus || (this.customerGSTNumber ? 'GST' : 'NonGST');
    this.isGstCreditNote = row?.isGstCreditNote === true || this.creditNoteGstStatus === 'GST';
    this.creditNoteSyncStatus = row?.creditNoteSyncStatus || 'Unprocessed';
    if (row?.canSelectForDynamics === true || row?.canSelectForDynamics === false) {
      this.canSelectForDynamics = row.canSelectForDynamics;
    } else {
      this.canSelectForDynamics = this.creditNoteSyncStatus !== 'Successful'
        && String(this.approvalStatus || '').toLowerCase() === 'approved'
        && (!this.isGstCreditNote || String(this.irnStatus || '').trim().toLowerCase() === 'generated');
    }
  }
}
