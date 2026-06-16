// @ts-nocheck
import { formatDate } from '@angular/common';

export class NewBillingHistoryModel {
  totalRecords: number;
    billingHistoryDetails: BillingHistoryModel[];
    constructor(newBillingHistoryModel) {
      this.totalRecords = newBillingHistoryModel.totalRecords || '';
      this.billingHistoryDetails = newBillingHistoryModel.billingHistoryDetails;
    }
}

export class BillingHistoryModel {
  dutySlipForBillingID: number;
  employeeName: string;
  billingDate:Date;
  billingTime:Date; 
  actionTaken: string;
  actionDetails: string;

  constructor(billingHistory) {
    {
      this.dutySlipForBillingID = billingHistory.dutySlipForBillingID || '';
      this.employeeName = billingHistory.employeeName || '';
      this.billingDate = billingHistory.billingDate || '';
      this.billingTime = billingHistory.billingTime || '';
      this.actionTaken=billingHistory.actionTaken || '';
      this.actionDetails = billingHistory.actionDetails || '';
    }
  }
}
