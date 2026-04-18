// @ts-nocheck
import { formatDate } from '@angular/common';
export class CDCLocalFixedDetails {
  cdcLocalFixedDetailsID: number;
  customerContractID:number;
  billFromTo: string;
  packageJumpCriteria:string;
  nextPackageSelectionCriteria:string;
  packageGraceMinutes:number;
  packageGraceKms:number;
  activationStatus: boolean;
  showAddtionKMAndHours:boolean;
  addtionalKms:number;
  addtionalMinutes:number
  userID:number;

  constructor(cdcLocalFixedDetails) {
    {
       this.cdcLocalFixedDetailsID= cdcLocalFixedDetails.cdcLocalFixedDetailsID || -1;
       this.customerContractID = cdcLocalFixedDetails.customerContractID || '';
       this.billFromTo = cdcLocalFixedDetails.billFromTo || '';
       this.packageJumpCriteria = cdcLocalFixedDetails.packageJumpCriteria|| '';
       this.nextPackageSelectionCriteria = cdcLocalFixedDetails.nextPackageSelectionCriteria || '';
       this.packageGraceMinutes = cdcLocalFixedDetails.packageGraceMinutes || '';
       this.packageGraceKms = cdcLocalFixedDetails.packageGraceKms|| '';
       this.activationStatus = cdcLocalFixedDetails.activationStatus || '';
       this.showAddtionKMAndHours = cdcLocalFixedDetails.showAddtionKMAndHours || '';
       this.addtionalKms = cdcLocalFixedDetails.addtionalKms || '';
       this.addtionalMinutes = cdcLocalFixedDetails.addtionalMinutes || '';
       
    }
  }
  
}

