// @ts-nocheck
import { formatDate } from '@angular/common';
export class RateViewForLongTermRentalContractModel {
  customerContractID: number;
  customerContractName: string;
  customerContractCarCategoryID:number;
  customerContractCarCategory:string;
  customerContractCityTiersID:number;
  customerContractCityTier:string;  
  packageID:number;
  package:string;
  car:string;
  city:string;
  monthlyHours:number;
  monthlyKMs:number;
  totalDaysBaseRate:number;
  extraHRRate:number;
  extraKMRate:number;
  nightCharge:number;
  driverAllowance:number;
  fgr:number;
  fgrCharges:number;
  currentDateTime:Date;
  billFromTo:string;
  userID:number; 
}
