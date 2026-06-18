// @ts-nocheck
export class InvoiceSummary {
  invoiceSummaryID: number;
  userID: number;
  customerID: number;
  customer: string;
  customerName: string;
  stateID: number;
  state: string;
  stateName: string;
  invoiceSummaryDate: Date;
  remark: string;
  createdByID: number;
  createdBy: string;
  summaryDispatchStatus: string;
  acknowledgement: string;
  billSubmittedTo: string;
  contactNumber: string;
  dispatchedByID: number;
  dispatchedBy: string;
  dispatchDate: Date;
  activationStatus: boolean;
  dispatchedByName: string;

  constructor(invoiceSummary) {
    this.invoiceSummaryID = invoiceSummary.invoiceSummaryID || -1;
    this.customerID = invoiceSummary.customerID || 0;
    this.customer = invoiceSummary.customer || invoiceSummary.customerName || '';
    this.customerName = this.customer;
    this.stateID = invoiceSummary.stateID || 0;
    this.state = invoiceSummary.state || invoiceSummary.stateName || '';
    this.stateName = this.state;
    this.invoiceSummaryDate = invoiceSummary.invoiceSummaryDate || null;
    this.remark = invoiceSummary.remark || '';
    this.createdByID = invoiceSummary.createdByID || 0;
    this.createdBy = invoiceSummary.createdBy || '';
    this.summaryDispatchStatus = invoiceSummary.summaryDispatchStatus || 'No';
    this.acknowledgement = invoiceSummary.acknowledgement || '';
    this.billSubmittedTo = invoiceSummary.billSubmittedTo || '';
    this.contactNumber = invoiceSummary.contactNumber || '';
    this.dispatchedByID = invoiceSummary.dispatchedByID || 0;
    this.dispatchedBy = invoiceSummary.dispatchedBy || '';
    this.dispatchedByName = invoiceSummary.dispatchedByName || invoiceSummary.dispatchedBy || '';
    this.dispatchDate = invoiceSummary.dispatchDate || null;
    this.activationStatus = invoiceSummary.activationStatus !== undefined ? invoiceSummary.activationStatus : false;
    this.invoiceSummaryDate = new Date();
  }
}
