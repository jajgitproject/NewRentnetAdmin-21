// @ts-nocheck
import { formatDate } from '@angular/common';
export class CarPaidTaxMIS {
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
 vehicleCategory :string;
   inventory:string;

  constructor(carPaidTaxMIS) {
    {
       this.interstateTaxID = carPaidTaxMIS.interstateTaxID || -1;
       this.inventoryID = carPaidTaxMIS.inventoryID || '';
       this.registrationNumber = carPaidTaxMIS.registrationNumber || '';
       this.geoPointID = carPaidTaxMIS.geoPointID || '';
       this.state = carPaidTaxMIS.state || '';
       this.amount = carPaidTaxMIS.amount || '';
       this.interStateTaxStartDateString = carPaidTaxMIS.interStateTaxStartDateString || '';
       this.interStateTaxEndDateString = carPaidTaxMIS.interStateTaxEndDateString || '';
       this.paidOnString = carPaidTaxMIS.paidOnString || '';
       this.paidByID = carPaidTaxMIS.paidByID || '';

       this.uploadedOnString = carPaidTaxMIS.uploadedOnString || '';
       this.uploadedByIDString = carPaidTaxMIS.uploadedByIDString || '';
       this.interStateTaxImage = carPaidTaxMIS.interStateTaxImage || '';
       this.activationStatus = carPaidTaxMIS.activationStatus || '';

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

