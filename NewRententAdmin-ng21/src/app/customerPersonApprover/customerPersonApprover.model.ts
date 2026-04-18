// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerPersonApprover {
   customerPersonApproverID: number;
   customerPersonID:number;
   startDate:Date;
   endDate: Date;
   customerPersonApproverStatus:boolean;
startDateString:string;
  endDateString:string;
   userID:number;
   approverName:string;
   approverID:number;
  customerGroupID: any;
  constructor(customerPersonApprover) {
    {
       this.customerPersonApproverID = customerPersonApprover.customerPersonApproverID || -1;
       this.customerPersonID = customerPersonApprover.customerPersonID || '';
       this.startDate = customerPersonApprover.startDate || '';
       this.endDate = customerPersonApprover.endDate || '';
        this.startDateString = customerPersonApprover.startDateString || '';
       this.endDateString = customerPersonApprover.endDateString || '';
       this.approverName = customerPersonApprover.approverName || '';
       this.approverID = customerPersonApprover.approverID || '';
           this.startDate = customerPersonApprover.startDate
  ? new Date(customerPersonApprover.startDate)
  : null;

this.endDate = customerPersonApprover.endDate
  ? new Date(customerPersonApprover.endDate)
  : null;

       this.customerPersonApproverStatus = customerPersonApprover.customerPersonApproverStatus || '';
    }
  }
  
}

