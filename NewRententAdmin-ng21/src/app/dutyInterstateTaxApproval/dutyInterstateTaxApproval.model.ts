// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyInterstateTaxApproval {
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
  paidUntilString: string;
  paidUntilDate:Date;
  stateID:number;
  stateName:string;
  registrationNumber:string;
  interStateTaxStartDateString: string;
  interStateTaxStartDate:Date;
  interStateTaxEndDateString: string;
  interStateTaxEndDate:Date;

  constructor(dutyInterstateTaxApproval) {
    {
      this.dutyInterstateTaxID = dutyInterstateTaxApproval.dutyInterstateTaxID || '';
      this.dutySlipID = dutyInterstateTaxApproval.dutySlipID || '';
      this.interStateTaxID = dutyInterstateTaxApproval.interStateTaxID  || '';
      this.geoPointID = dutyInterstateTaxApproval.geoPointID  || '';
      this.taxStartDateString = dutyInterstateTaxApproval.taxStartDateString  || '';
      this.taxEndDateString = dutyInterstateTaxApproval.taxEndDateString  || '';
      this.interStateTaxAmount = dutyInterstateTaxApproval.interStateTaxAmount  || '';
      this.amountToBeChargedInCurrentDuty = dutyInterstateTaxApproval.amountToBeChargedInCurrentDuty  || '';
      this.interStateTaxPaidBy = dutyInterstateTaxApproval.interStateTaxPaidBy  || '';
      this.approvedByID = dutyInterstateTaxApproval.approvedByID  || '';
      this.approvalStatus = dutyInterstateTaxApproval.approvalStatus  || '';
      this.approvalDateString = dutyInterstateTaxApproval.approvalDateString  || '';
      this.approvalRemark = dutyInterstateTaxApproval.approvalRemark  || '';
      this.activationStatus = dutyInterstateTaxApproval.activationStatus  || '';
      this.paidUntilString = dutyInterstateTaxApproval.paidUntilString  || '';
      this.stateID = dutyInterstateTaxApproval.stateID  || '';
      this.stateName = dutyInterstateTaxApproval.stateName  || '';
      this.dutyInterstateTaxImage = dutyInterstateTaxApproval.dutyInterstateTaxImage  || '';

      this.taxStartDate=new Date();
      this.taxEndDate=new Date();
      this.approvalDate=new Date();
      this.paidUntilDate=new Date();
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
  interStateTaxImage: string;
  interStateTaxID:number;

  constructor(interstateTax) {
    {
      this.interStateTaxStartDateString = interstateTax.InterStateTaxStartDateString || '';
      this.interStateTaxEndDateString = interstateTax.InterStateTaxEndDateString || '';
      this.paidOnString = interstateTax.paidOnString  || '';
      this.registrationNumber = interstateTax.registrationNumber  || '';
      this.amount = interstateTax.amount  || '';
      this.paidByID = interstateTax.paidByID  || '';
      this.interStateTaxID = interstateTax.interStateTaxID  || '';
      this.interStateTaxImage = interstateTax.interStateTaxImage  || '';

      this.interStateTaxStartDate=new Date();
      this.interStateTaxEndDate=new Date();
      this.paidOn=new Date();
    }
  }
  
}

