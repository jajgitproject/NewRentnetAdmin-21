// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContractCustomerVehiclePercentage {
  supplierContractCustomerVehiclePercentageID: number;
  userID:number;
  supplierContractID : number;
  customerID:number;
  vehicleID   : number;
  fromDate :Date;
  toDate :Date;
  toDateString:string;
  fromDateString:string;
  supplierPercentage :string;
   activationStatus: Boolean;
   vehicle:string;
   customerName:string;
  

  constructor(supplierContractCustomerVehiclePercentage) {
    {
       this.supplierContractCustomerVehiclePercentageID = supplierContractCustomerVehiclePercentage.supplierContractCustomerVehiclePercentageID || -1;
       this.supplierContractID = supplierContractCustomerVehiclePercentage.supplierContractID || '';
       this.customerID = supplierContractCustomerVehiclePercentage.customerID || '';
       this.vehicleID   = supplierContractCustomerVehiclePercentage.vehicleID   || '';
       this.fromDateString = supplierContractCustomerVehiclePercentage.fromDateString || '';
       this.toDateString = supplierContractCustomerVehiclePercentage.toDateString || '';
       this.supplierPercentage = supplierContractCustomerVehiclePercentage.supplierPercentage || '';
       this.activationStatus = supplierContractCustomerVehiclePercentage.activationStatus || '';
       this.fromDate=new Date();
       this.toDate=new Date();
    }
  }
  
}

