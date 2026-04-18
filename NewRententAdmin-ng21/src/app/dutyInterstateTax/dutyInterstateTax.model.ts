// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyInterstateTax {
  dutyInterstateTaxID: number;
  dutySlipID:number;
  interStateTaxID:number;
  geoPointID:number;
  taxStartDateString: string;
  taxStartDate:Date;
  taxEndDateString: string;
  taxEndDate:Date;
  interStateTaxAmount:number;
  amountToBeChargedInCurrentDuty:number;
  interStateTaxPaidBy:string;
  approvedByID:number;
  approvalStatus:string;
  approvalDateString:string;
  approvalDate:Date;
  approvalRemark:string;
  activationStatus: boolean;
  dutyInterstateTaxImage:string;
  approvedBy:string;
  //paidUntilString: string;
  //paidUntilDate:Date;
  stateID:number;
  state:string;
  registrationNumber:string;
  userID: number;
  // interStateTaxStartDateString: string;
  // interStateTaxStartDate:Date;
  // interStateTaxEndDateString: string;
  // interStateTaxEndDate:Date;

  constructor(dutyInterstateTax) {
    {
      this.dutyInterstateTaxID = dutyInterstateTax.dutyInterstateTaxID || '';
      this.dutySlipID = dutyInterstateTax.dutySlipID || '';
      this.interStateTaxID = dutyInterstateTax.interStateTaxID  || '';
      this.geoPointID = dutyInterstateTax.geoPointID  || '';
      this.taxStartDateString = dutyInterstateTax.taxStartDateString  || '';
      this.taxEndDateString = dutyInterstateTax.taxEndDateString  || '';
      this.interStateTaxAmount = dutyInterstateTax.interStateTaxAmount  || '';
      this.amountToBeChargedInCurrentDuty = dutyInterstateTax.amountToBeChargedInCurrentDuty  || '';
      this.interStateTaxPaidBy = dutyInterstateTax.interStateTaxPaidBy  || '';
      this.approvedByID = dutyInterstateTax.approvedByID  || '';
      this.approvalStatus = dutyInterstateTax.approvalStatus  || '';
      this.approvalDateString = dutyInterstateTax.approvalDateString  || '';
      this.approvalRemark = dutyInterstateTax.approvalRemark  || '';
      this.activationStatus = dutyInterstateTax.activationStatus  || '';
      //this.paidUntilString = dutyInterstateTax.paidUntilString  || '';
      this.stateID = dutyInterstateTax.stateID  || '';
      this.state = dutyInterstateTax.state  || '';
      this.dutyInterstateTaxImage = dutyInterstateTax.dutyInterstateTaxImage  || '';

      this.taxStartDate=new Date();
      this.taxEndDate=new Date();
      this.approvalDate=new Date();
      //this.paidUntilDate=new Date();
    }
  } 
}

export class InterstateTax {
  interStateTaxStartDateString: string;
  interStateTaxStartDate:Date;
  interStateTaxEndDateString: string;
  interStateTaxEndDate:Date;
  paidOnString:string;
  paidOn:Date;
  registrationNumber:string;
  amount:number;
  paidByID:number;
  interStateTaxImage:string;
  interStateTaxID:number;
  geoPointID:number;
  geoPointName:string;
  constructor(interstateTax) {
    {
      this.interStateTaxStartDateString = interstateTax.InterStateTaxStartDateString || '';
      this.interStateTaxEndDateString = interstateTax.InterStateTaxEndDateString || '';
      this.paidOnString = interstateTax.paidOnString  || '';
      this.registrationNumber = interstateTax.registrationNumber  || '';
      this.amount = interstateTax.amount  || '';
      this.paidByID = interstateTax.paidByID  || '';
      this.geoPointID = interstateTax.geoPointID  || '';
      this.geoPointName = interstateTax.geoPointName  || '';

      this.interStateTaxStartDate=new Date();
      this.interStateTaxEndDate=new Date();
      this.paidOn=new Date();
    }
  }
  
}

