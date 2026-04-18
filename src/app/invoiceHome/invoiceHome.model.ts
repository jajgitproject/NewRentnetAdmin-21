// @ts-nocheck
export class InvoiceHome {
  customerID: number;
  customerName: string;
  customerGroupID: number;
  invoiceID: number;
  branchID: number;
  customerGroup: string;
  invoiceNo: string;
  invoiceDate: Date ;
  invoiceTotalAmountAfterGST: number;
  organizationalEntityName: string;
  invoiceStatusActiveOrVoid: string;
  invoiceNumberWithPrefix: string;
    branch: string;
  totalCreditNoteAmount: number;
  activationStatus: boolean ;
  invoiceType:string;
  iRN:string;
  irnStatus:string;
  templateAddress:string;

  constructor(invoiceHome) {
    this.customerID = invoiceHome.customerID || 0;
    this.customerName = invoiceHome.customerName || '';
    this.customerGroupID = invoiceHome.customerGroupID || 0;
    this.invoiceID = invoiceHome.invoiceID || 0;
    this.branchID = invoiceHome.branchID || 0;
    this.customerGroup = invoiceHome.customerGroup || '';
    this.invoiceNo = invoiceHome.invoiceNo || '';
    this.branch = invoiceHome.branch || '';
    this.invoiceDate = invoiceHome.invoiceDate || '';
    this.invoiceTotalAmountAfterGST = invoiceHome.invoiceTotalAmountAfterGST || 0;
    this.organizationalEntityName = invoiceHome.organizationalEntityName || '';
    this.invoiceStatusActiveOrVoid = invoiceHome.invoiceStatusActiveOrVoid || '';
    this.invoiceNumberWithPrefix = invoiceHome.invoiceNumberWithPrefix || '';
    this.totalCreditNoteAmount = invoiceHome.totalCreditNoteAmount || 0;
    this.activationStatus = invoiceHome.activationStatus || '';
    this.iRN = invoiceHome.iRN || '';
    this.irnStatus = invoiceHome.irnStatus || '';
    this.templateAddress = invoiceHome.templateAddress || '';
  }
}


