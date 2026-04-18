// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerContractMapping {
  customerContractMappingID: number;
  customerID : number;
  customerName:string;
  customerContractName:string;
  customerContractID : number; 
  negotiatedByID:number;
  approvedByID:number;
  startDate :Date;
  endDate :Date;
  endDateString:string;
  startDateString:string;
  customerApproverName:string;
  customerApproverDesignation:string;
  referenceNote:string;
   activationStatus: Boolean;
   negotiatedBy:string;
   approvedBy:string;
  userID: number;

  constructor(customerContractMapping) {
    {
       this.customerContractMappingID = customerContractMapping.customerContractMappingID || -1;
       this.customerID = customerContractMapping.customerID || '';
       this.customerContractID = customerContractMapping.customerContractID || '';     
       this.negotiatedByID = customerContractMapping.negotiatedByID || '';
       this.approvedByID = customerContractMapping.approvedByID || '';
       this.startDateString = customerContractMapping.startDateString || '';
       this.endDateString = customerContractMapping.endDateString || '';
       this.customerApproverName = customerContractMapping.customerApproverName || '';     
       this.customerApproverDesignation = customerContractMapping.customerApproverDesignation || '';
       this.referenceNote = customerContractMapping.referenceNote || '';
       this.activationStatus = customerContractMapping.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

