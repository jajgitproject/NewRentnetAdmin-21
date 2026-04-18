// @ts-nocheck
import { formatDate } from '@angular/common';
export class InterstateTaxEntry {
  interstateTaxID: number;
  inventoryID:number;
  registrationNumber:string;
  vehicle:string;
  geoPointID:number;
  state:string;
  amount:number;
  interStateTaxStartDate:Date;
  interStateTaxStartDateString:string;
  interStateTaxEndDate:Date;
  interStateTaxEndDateString:string;
  paidOn:Date;
  paidOnString:string;
  paidByID:number;
  paidBy:string;
  uploadedOn:Date;
  uploadedOnString:string;
  uploadedByID:number;
  uploadedBy:string;
  uploadedByIDString:string;
  interStateTaxImage: string;
  activationStatus: boolean;
  firstName:string;
  lastName:string;
  userID:number;

  constructor(interstateTaxEntry) {
    {
       this.interstateTaxID = interstateTaxEntry.interstateTaxID || -1;
       this.inventoryID = interstateTaxEntry.inventoryID || '';
       this.registrationNumber = interstateTaxEntry.registrationNumber || '';
       this.geoPointID = interstateTaxEntry.geoPointID || '';
       this.state = interstateTaxEntry.state || '';
       this.amount = interstateTaxEntry.amount || '';
       this.interStateTaxStartDateString = interstateTaxEntry.interStateTaxStartDateString || '';
       this.interStateTaxEndDateString = interstateTaxEntry.interStateTaxEndDateString || '';
       this.paidOnString = interstateTaxEntry.paidOnString || '';
       this.paidByID = interstateTaxEntry.paidByID || '';

       this.uploadedOnString = interstateTaxEntry.uploadedOnString || '';
       this.uploadedByIDString = interstateTaxEntry.uploadedByIDString || '';
       this.interStateTaxImage = interstateTaxEntry.interStateTaxImage || '';
       this.activationStatus = interstateTaxEntry.activationStatus || '';

       this.interStateTaxStartDate=new Date();
       this.interStateTaxEndDate=new Date();
       this.paidOn=new Date();
       this.uploadedOn=new Date();
      
       
    }
  }
  
}


export class VehicleInterstateTaxDetailsModel {
  registrationNumber: string;
  interStateTaxStartDate:Date;
  interStateTaxEndDate:Date;
  interStateTaxAmount:number;
  state:string;

  constructor(VehicleInterstateTaxDetailsModel) {
    {
       this.interStateTaxStartDate = VehicleInterstateTaxDetailsModel.interStateTaxStartDate || '';
       this.interStateTaxEndDate = VehicleInterstateTaxDetailsModel.interStateTaxEndDate || '';
       this.registrationNumber = VehicleInterstateTaxDetailsModel.registrationNumber || '';
       this.interStateTaxAmount = VehicleInterstateTaxDetailsModel.interStateTaxAmount || '';
       this.state = VehicleInterstateTaxDetailsModel.state || '';
    }
  }
  
}

