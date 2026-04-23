// @ts-nocheck
import { formatDate } from '@angular/common';
export class CreditNoteHomeModel {
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
  dateTimeOfGeneration:Date;
  invoiceType:string;
  creditNoteNumberWithPrefix:string;
  cancelReason:string;
  cancelRemark:string;
  isEinvoiceGenerated:boolean;
  creditNoteIRN:string;
  cancellationDate:Date;
  userID:number;
}


