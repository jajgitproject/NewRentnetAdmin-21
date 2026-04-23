// @ts-nocheck
import { formatDate } from '@angular/common';
export class Lut {
   lutID: number;
   lutNo: string;
   bank:string;
   bankBranch:string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   organizationalEntityID:number;
   startDateString:string;
   startDate:Date;
   endDateString:string;
   endDate:Date;
   bankID:number;
   scannedImage:string;
   organizationalEntityName:string;
   organizationalEntitID:string;
   userID:number;
   
  constructor(lut) {
    {
       this.lutID = lut.lutID || -1;
       this.lutNo = lut.lut || '';
       this.organizationalEntityName = lut.organizationalEntityName || '';
       this.organizationalEntityID = lut.organizationalEntityID || '';
       this.scannedImage = lut.scannedImage || '';
       this.updatedBy=lut.updatedBy || 10;
       this.updateDateTime = lut.updateDateTime;
       this.startDateString = lut.startDateString  || '';
       this.activationStatus = lut.activationStatus || '';
       this.endDateString=lut.endDateString || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

