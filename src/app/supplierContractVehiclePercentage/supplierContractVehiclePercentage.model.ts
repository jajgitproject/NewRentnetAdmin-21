// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractVehiclePercentage {
  supplierContractVehiclePercentageID: number;
  userID:number;
  supplierContractID : number;
  vehicleID : number;
  fromDate :Date;
  toDate :Date;
  toDateString:string;
  fromDateString:string;
  supplierPercentage :string;
   activationStatus: Boolean;
   vehicle:string;
  

  constructor(supplierContractVehiclePercentage) {
    {
       this.supplierContractVehiclePercentageID = supplierContractVehiclePercentage.supplierContractVehiclePercentageID || -1;
       this.supplierContractID = supplierContractVehiclePercentage.supplierContractID || '';
       this.vehicleID = supplierContractVehiclePercentage.vehicleID || '';
       this.fromDateString = supplierContractVehiclePercentage.fromDateString || '';
       this.toDateString = supplierContractVehiclePercentage.toDateString || '';
       this.supplierPercentage = supplierContractVehiclePercentage.supplierPercentage || '';
       this.activationStatus = supplierContractVehiclePercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

