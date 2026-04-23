// @ts-nocheck
import { formatDate } from '@angular/common';
export class  DropOffDetailShow {
  dropOffEntryMethod:string;
  dropOffDate:Date;
  dropOffTime:Date;
  dropOffKM:number;
  dropOffAddressString:string;
  
  
 constructor(dropOffDetailShow) {
   {
      this.dropOffEntryMethod = dropOffDetailShow.dropOffEntryMethod || '';
      this.dropOffDate = dropOffDetailShow.dropOffDate || '';
      this.dropOffTime = dropOffDetailShow.dropOffTime || '';
      this.dropOffKM = dropOffDetailShow.dropOffKM || '';
      this.dropOffAddressString = dropOffDetailShow.dropOffAddressString || '';
   }
 }
}
