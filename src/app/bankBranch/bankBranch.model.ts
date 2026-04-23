// @ts-nocheck
import { formatDate } from '@angular/common';
export class BankBranch {
  organizationalEntityCityID(organizationalEntityCityID: any) {
    throw new Error('Method not implemented.');
  }
   bankBranchID: number;
   bankBranch: string;
   bankID:number;
   bank:string;
   activationStatus: boolean;
    bankBranchAddress: string; 
    bankBranchCityID :number;
    bankBranchIFSCCode : string;
    bankBranchSwiftCode : string;
    bankBranchIBanNumber : string;
    bankBranchRoutingCode : string;
    updatedBy:number;
    updateDateTime: Date;
    countryID:number;
    stateID:number;
    city:string;
    stateName:string;
    country:string;
    userID:number;

  constructor(bankBranch) {
    {
       this.bankBranchID = bankBranch.bankBranchID || -1;
       this.bankBranch = bankBranch.bankBranch || '';
       this.bankID = bankBranch.bankID || '';
       this.countryID = bankBranch.countryID || '';
       this.stateID = bankBranch.stateID || '';
       this.bankBranchAddress = bankBranch.bankBranchAddress || '';
       this.bankBranchCityID = bankBranch.bankBranchCityID || '';
       this.bankBranchIFSCCode = bankBranch.bankBranchIFSCCode || '';
       this.bankBranchSwiftCode = bankBranch.bankBranchSwiftCode || '';
       this.bankBranchIBanNumber = bankBranch.bankBranchIBanNumber || '';
       this.bankBranchRoutingCode = bankBranch.bankBranchRoutingCode || '';
       this.activationStatus = bankBranch.activationStatus || '';
       this.updatedBy=bankBranch.updatedBy || 10;
       this.updateDateTime = bankBranch.updateDateTime;
    }
  }
  
}

