// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerCreditChargesModel {
  customerCreditCardChargesID: number;
  customerCreditCardChargesPercentage: number;
  igstPercentage: number;
  cgstPercentage:number;
  sgstPercentage:number;
  cessPercentage:number;
  customerCreditCardChargesStartDate:Date;
  customerCreditCardChargesStartDateString:string;
  customerCreditCardChargesEndDate:Date;
  customerCreditCardChargesEndDateString:string;
  customerID:number;
  activationStatus: boolean;
  userID:number;

  constructor(customerCreditChargesModel) {
    {
      this.customerCreditCardChargesID = customerCreditChargesModel.customerCreditCardChargesID || -1;
      this.customerCreditCardChargesPercentage = customerCreditChargesModel.customerCreditCardChargesPercentage || '';
      this.igstPercentage = customerCreditChargesModel.igstPercentage || '';
      this.cgstPercentage = customerCreditChargesModel.cgstPercentage || '';
      this.sgstPercentage = customerCreditChargesModel.sgstPercentage || '';
      this.cessPercentage = customerCreditChargesModel.cessPercentage || '';
      this.customerCreditCardChargesStartDateString = customerCreditChargesModel.customerCreditCardChargesStartDateString || '';
      this.customerCreditCardChargesEndDateString = customerCreditChargesModel.customerCreditCardChargesEndDateString || '';
      this.customerID = customerCreditChargesModel.customerID || '';
      this.activationStatus = customerCreditChargesModel.activationStatus || '';
      this.customerCreditCardChargesStartDate = new Date();
      this.customerCreditCardChargesEndDate = new Date();
    }
  }  
}
