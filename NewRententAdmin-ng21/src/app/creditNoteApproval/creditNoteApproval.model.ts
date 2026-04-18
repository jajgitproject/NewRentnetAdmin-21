// @ts-nocheck
import { formatDate } from '@angular/common';

export class CreditNoteApproval {
  invoiceCreditNoteID: number;
  invoiceID: number;
  branchID: number;
  branchName: string;
  customerID: number;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  creditNoteNumber: string;
  creditNoteAmount: number;
  creditNoteType: string;
  approvalStatus: string;
  dateTimeOfGeneration: Date;
  approvedByID: number;
  approvedBy: string;
  approvalDateTime: Date;
  approvalRejectionReason: string;
  userID: number;
  approvalDateTimeString: string;
  invoiceNumber: string;
  dateTimeOfGenerationString: string;
  invoiceNumberWithPrefix:string;

  constructor(creditNoteApproval) {
    {
      this.invoiceCreditNoteID = creditNoteApproval.invoiceCreditNoteID || -1;
      this.invoiceID = creditNoteApproval.invoiceID || '';
      this.branchID = creditNoteApproval.branchID || '';
      this.branchName = creditNoteApproval.branchName || '';
      this.customerID = creditNoteApproval.customerID || '';
      this.customerName = creditNoteApproval.customerName || '';
      this.customerGroupID = creditNoteApproval.customerGroupID || 0;
      this.customerGroup = creditNoteApproval.customerGroup || '';
      this.creditNoteNumber = creditNoteApproval.creditNoteNumber || '';
      this.creditNoteAmount = creditNoteApproval.creditNoteAmount || 0;
      this.creditNoteType = creditNoteApproval.creditNoteType || '';
      this.approvalStatus = creditNoteApproval.approvalStatus || '';
      this.approvedByID = creditNoteApproval.approvedByID || 0;
      this.approvedBy = creditNoteApproval.approvedBy || '';
      this.approvalRejectionReason = creditNoteApproval.approvalRejectionReason || '';
      this.userID = creditNoteApproval.userID || 0;
      this.approvalDateTimeString = creditNoteApproval.approvalDateTimeString || '';
      this.invoiceNumberWithPrefix = creditNoteApproval.invoiceNumberWithPrefix || '';
      this.dateTimeOfGenerationString = creditNoteApproval.dateTimeOfGenerationString || '';

      // Only set new dates if the original values are null/undefined
      this.dateTimeOfGeneration = creditNoteApproval.dateTimeOfGeneration || new Date();
      this.approvalDateTime = creditNoteApproval.approvalDateTime || new Date();

      if (creditNoteApproval.dateTimeOfGenerationString) {
        this.dateTimeOfGenerationString = formatDate(new Date(creditNoteApproval.dateTimeOfGenerationString), 'yyyy-MM-dd', 'en') || '';
      }
      if (creditNoteApproval.approvalDateTimeString) {
        this.approvalDateTimeString = formatDate(new Date(creditNoteApproval.approvalDateTimeString), 'yyyy-MM-dd', 'en') || '';
      }
    }
  }
}

