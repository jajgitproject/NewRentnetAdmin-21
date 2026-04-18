// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerFuelSurcharge {
  customerFuelSurchargeID:number;
  customerContractMappingID:number;
  fuelSurchargePercentageOnPackage:number;
  fuelSurchargePercentageOnExtraKM:number;
  fuelSurchargePercentageOnExtraHour:number;
  fuelSurchargePercentageStartDate:Date;
  fuelSurchargePercentageStartDateString:string;
  fuelSurchargePercentageEndDate:Date;
  fuelSurchargePercentageEndDateString:string;
  activationStatus:boolean;

  constructor(customerFuelSurcharge) {
    {
       this.customerFuelSurchargeID = customerFuelSurcharge.customerFuelSurchargeID || -1;
       this.customerContractMappingID = customerFuelSurcharge.customerContractMappingID || '';
       this.fuelSurchargePercentageOnPackage = customerFuelSurcharge.fuelSurchargePercentageOnPackage || '';
       this.fuelSurchargePercentageOnExtraKM = customerFuelSurcharge.fuelSurchargePercentageOnExtraKM || '';
       this.fuelSurchargePercentageOnExtraHour = customerFuelSurcharge.fuelSurchargePercentageOnExtraHour || '';
       this.fuelSurchargePercentageStartDateString = customerFuelSurcharge.fuelSurchargePercentageStartDateString || '';
       this.fuelSurchargePercentageEndDateString = customerFuelSurcharge.fuelSurchargePercentageEndDateString || '';
       this.activationStatus = customerFuelSurcharge.activationStatus || '';

       this.fuelSurchargePercentageStartDate = new Date();
       this.fuelSurchargePercentageEndDate = new Date();
    }
  }
  
}

