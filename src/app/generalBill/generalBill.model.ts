// @ts-nocheck
import { formatDate } from '@angular/common';
export class GeneralBillModel {
  invoiceGeneralLineItemsID:number;
  invoiceID:number;
  narration:string;
  rate:number;
  quantity:number;
  baseAmount:number;
  uomid:number;
  uom:string;
  cgstRate:number;
  cgstAmount:number;
  sgstRate:number;
  sgstAmount:number;
  igstRate:number;
  igstAmount:number;
  totalAmount:number;
  activationStatus: boolean;
  userID: number;

    constructor(generalBillModel) {
    {
      this.invoiceGeneralLineItemsID = generalBillModel.invoiceGeneralLineItemsID || -1;
      this.invoiceID = generalBillModel.invoiceID || '';
      this.narration = generalBillModel.narration || '';
      this.rate = generalBillModel.rate || '';
      this.quantity = generalBillModel.quantity || '';
      this.baseAmount = generalBillModel.baseAmount || '';
      this.uomid = generalBillModel.uomid || '';
      this.uom = generalBillModel.uom || '';
      this.cgstRate = generalBillModel.cgstRate || '';
      this.cgstAmount = generalBillModel.cgstAmount || '';
      this.sgstRate = generalBillModel.sgstRate || '';
      this.sgstAmount = generalBillModel.sgstAmount || '';
      this.igstRate = generalBillModel.igstRate || '';
      this.igstAmount = generalBillModel.igstAmount || '';
      this.totalAmount = generalBillModel.totalAmount || '';
      this.activationStatus = generalBillModel.activationStatus || '';
    }
  }
}

