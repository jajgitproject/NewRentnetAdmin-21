// @ts-nocheck
import { formatDate } from '@angular/common';
export class BookerInfo {
  BookerInfoID: number;
  BookerInfo: string;
  activationStatus: string;
  updatedBy: number;
  updateDateTime: Date;

  constructor(BookerInfo) {
    {
      this.BookerInfoID = BookerInfo.BookerInfoID || -1;
      this.BookerInfo = BookerInfo.BookerInfo || '';
      this.activationStatus = BookerInfo.activationStatus || '';
      this.updatedBy = BookerInfo.updatedBy || 10;
      this.updateDateTime = BookerInfo.updateDateTime;
    }
  }
}

