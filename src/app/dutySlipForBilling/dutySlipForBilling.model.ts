// @ts-nocheck
export class BillingHistory {
  dutySlipForBillingID: number;
  dutySlipID: number; 
  userID: number; 
  actionTaken: string;
  actionDetails: string;
  verifyDuty : boolean;
  goodForBilling : boolean;
  message:string;

  constructor(billingHistory) {
    {
      this.dutySlipForBillingID = billingHistory.dutySlipForBillingID || '';
      this.dutySlipID = billingHistory.dutySlipID || '';
      this.userID = billingHistory.userID || '';
      this.actionTaken=billingHistory.actionTaken || '';
      this.actionDetails = billingHistory.actionDetails || '';
      this.goodForBilling = billingHistory.goodForBilling || '';
      this.verifyDuty = billingHistory.verifyDuty || '';
    }
  }
}
