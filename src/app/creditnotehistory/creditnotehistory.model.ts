// @ts-nocheck
import { formatDate } from '@angular/common';

export class CreditNoteHistory {
  invoiceCreditNoteHistoryID: number;
  invoiceCreditNoteID: number;
  invoiceID: number;
  amount: number;
  action: string;
  actionValue: string;
  actionByID: number;
  actionDate: Date;   // ISO string format from API
  actionTime: Date;   // ISO string format from API

  constructor(data: any) {
    this.invoiceCreditNoteHistoryID = data.invoiceCreditNoteHistoryID || 0;
    this.invoiceCreditNoteID = data.invoiceCreditNoteID || 0;
    this.invoiceID = data.invoiceID || 0;
    this.amount = data.amount || 0;
    this.action = data.action || '';
    this.actionValue = data.actionValue || '';
    this.actionByID = data.actionByID || 0;
    this.actionDate = data.actionDate || '';
    this.actionTime = data.actionTime || '';
  }
}


