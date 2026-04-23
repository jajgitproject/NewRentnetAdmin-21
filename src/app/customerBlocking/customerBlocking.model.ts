// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerBlocking {
  customerBlockingID:number;
  customerID:number;
  blockDate:Date;
  blockDateString:string;
  reasonofBlocking:string;
  blockedByID:number;
  blockedBy:string;
  blockAttachment:string;
  unblockDate:Date;
  unblockDateString:string;
  reasonofUnblocking:string;
  unblockedByID:number;
  unblockedBy:string;
  unblockAttachment:string;

  constructor(customerBlocking) {
    {
       this.customerBlockingID = customerBlocking.customerBlockingID || -1;
       this.customerID = customerBlocking.customerID || '';
       this.blockDateString = customerBlocking.blockDateString || '';
       this.reasonofBlocking = customerBlocking.reasonofBlocking || '';
       this.blockedByID = customerBlocking.blockedByID || '';
       this.blockedBy = customerBlocking.blockedBy || '';
       this.blockAttachment = customerBlocking.blockAttachment || '';
       this.unblockDateString = customerBlocking.unblockDateString || '';
       this.reasonofUnblocking = customerBlocking.reasonofUnblocking || '';
       this.unblockedByID = customerBlocking.unblockedByID || '';
       this.unblockedBy = customerBlocking.unblockedBy || '';
       this.unblockAttachment = customerBlocking.unblockAttachment || '';
    }
  }
  
}

