// @ts-nocheck
import { formatDate } from '@angular/common';
export class CreditNoteHomeExistingModel {
  invoiceCreditNoteID :number;
  invoiceID  :number;
  branchID :number;
  branchName:string;
  customerID :number;
  customerName :string;
  customerGroupID :number;
  customerGroup :string;
  creditNoteNumber :string;
  creditNoteAmount :number;
  creditNoteType :string;  
  approvalStatus :string;  
  dateTimeOfGeneration:Date;
  approvedByID:number;
  approvedBy:string;
  approvalDateTime:Date;
  approvalRejectionReason:string;
  userID:number;
  approvalDateTimeString:string;
  invoiceNumber:string;

  constructor(creditNoteHomeExisting) {
    {
       this.invoiceCreditNoteID = creditNoteHomeExisting.invoiceCreditNoteID || -1;
       this.invoiceID = creditNoteHomeExisting.invoiceID || '';
       this.branchID = creditNoteHomeExisting.branchID || '';
       this.branchName = creditNoteHomeExisting.branchName || '';
       this.customerID = creditNoteHomeExisting.customerID || '';
       this.customerName = creditNoteHomeExisting.customerName || '';
       this.customerGroupID = creditNoteHomeExisting.customerGroupID || 0;
       this.customerGroup = creditNoteHomeExisting.customerGroup || '';
       this.creditNoteNumber = creditNoteHomeExisting.creditNoteNumber || '';
       this.creditNoteAmount = creditNoteHomeExisting.creditNoteAmount || 0;
       this.creditNoteType = creditNoteHomeExisting.creditNoteType || '';
       this.approvalStatus = creditNoteHomeExisting.approvalStatus || '';
       this.approvedByID = creditNoteHomeExisting.approvedByID || 0;
       this.approvedBy = creditNoteHomeExisting.approvedBy || '';
       this.approvalRejectionReason = creditNoteHomeExisting.approvalRejectionReason || '';
       this.userID = creditNoteHomeExisting.userID || 0;
       this.approvalDateTimeString = creditNoteHomeExisting.approvalDateTimeString || '';
       this.invoiceNumber = creditNoteHomeExisting.invoiceNumber || '';

       // Only set new dates if the original values are null/undefined
       this.dateTimeOfGeneration = creditNoteHomeExisting.dateTimeOfGeneration || new Date();
       this.approvalDateTime = creditNoteHomeExisting.approvalDateTime || new Date();
    }
  }
}


