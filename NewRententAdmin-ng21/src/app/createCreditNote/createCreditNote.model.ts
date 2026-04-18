// @ts-nocheck
import { formatDate } from '@angular/common';
export class CreateCreditNote {
  invoiceCreditNoteID:number;
  customerID: number;
  invoiceID:number;
  customerGroupID: number;
  branchID:number;
  customerName: string;
  invoiceNumberWithPrefix:string;
  customerGroup: string;
  branchName:string;
  totalCreditNoteAmount: string;
  invoiceFinancialYearName:string;
  invoiceDate:Date;
  invoiceNumber:number;
  invoiceTotalAmountAfterGST:number;
  igstAmount:number;
  cgstAmount:number;
  sgstAmount:number;
  creditNoteReason:string;
  requiresReBilling:boolean;
  cgstPercentage:number;
  sgstPercentage:number;
  igstPercentage:number;
  creditNoteAmount:number;
  userID:number;
  year:number;
  baseAmount:number;
  monthName:string;
  monthID:number;
  invoiceFinancialYearID:string;


  constructor(createCreditNote) {
    {
      this.invoiceCreditNoteID = createCreditNote.invoiceCreditNoteID || -1 ;
       this.customerID = createCreditNote.customerID || '';
       this.customerGroupID = createCreditNote.customerGroupID || '';
       this.invoiceID = createCreditNote.invoiceID || '';
       this.branchID = createCreditNote.branchID || '';
       this.customerName = createCreditNote.customerName || '';
       this.baseAmount = createCreditNote.baseAmount || 0;
       this.customerGroup = createCreditNote.customerGroup || '';
       this.invoiceNumberWithPrefix = createCreditNote.invoiceNumberWithPrefix || '';
       this.branchName = createCreditNote.branchName || '';
       this.totalCreditNoteAmount = createCreditNote.totalCreditNoteAmount || '';
       this.invoiceFinancialYearName = createCreditNote.invoiceFinancialYearName|| '';
       this.invoiceNumber = createCreditNote.invoiceNumber || '';
       this.invoiceTotalAmountAfterGST = createCreditNote.invoiceTotalAmountAfterGST || '';
      this.igstAmount = createCreditNote.igstAmount || '';
       this.cgstAmount = createCreditNote.cgstAmount || '';
       this.sgstAmount = createCreditNote.sgstAmount || '';
       this.creditNoteReason = createCreditNote.creditNoteReason || '';
       this.requiresReBilling = createCreditNote.requiresReBilling || '';
        this.igstPercentage = createCreditNote.igstPercentage || '';
       this.cgstPercentage = createCreditNote.cgstPercentage || '';
       this.sgstPercentage = createCreditNote.sgstPercentage || '';
       this.creditNoteAmount = createCreditNote.creditNoteAmount || '';
      this.userID = createCreditNote.userID || '';
       this.year = createCreditNote.year || '';
       this.monthName = createCreditNote.monthName || '';
      this.monthID = createCreditNote.monthID || '';
       this.invoiceFinancialYearID = createCreditNote.invoiceFinancialYearID || '';

       this.invoiceDate=new Date();
    }
  }
  
}

 



