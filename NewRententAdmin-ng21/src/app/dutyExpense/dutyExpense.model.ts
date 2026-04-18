// @ts-nocheck
import { formatDate } from '@angular/common';
export class DutyExpenseModel {
   dutyExpenseID: number;
   dutySlipID: number;
   expenseID: number;
   expense:string;
   chargeableOrNonChargeable: string;
   uomid:number;
   uom:string;
   uomUnits:number;
   amountPerUnit:number;
   amount:number;
   activationStatus: boolean;
  userID: number;

  constructor(dutyExpenseModel) {
    {
       this.dutyExpenseID = dutyExpenseModel.dutyExpenseID || -1;
       this.dutySlipID = dutyExpenseModel.dutySlipID || '';
       this.expenseID = dutyExpenseModel.expenseID || '';
       this.expense = dutyExpenseModel.expense || '';
       this.chargeableOrNonChargeable = dutyExpenseModel.chargeableOrNonChargeable || '';
       this.uomid = dutyExpenseModel.uomid || '';
       this.uom = dutyExpenseModel.uom || '';
       this.uomUnits = dutyExpenseModel.uomUnits || '';
       this.amountPerUnit = dutyExpenseModel.amountPerUnit || '';
       this.amount = dutyExpenseModel.amount || '';
       this.activationStatus = dutyExpenseModel.activationStatus || '';
    }
  }
  
}

