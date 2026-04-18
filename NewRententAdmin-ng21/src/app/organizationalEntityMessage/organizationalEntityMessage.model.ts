// @ts-nocheck
import { formatDate } from '@angular/common';
export class OrganizationalEntityMessage {
    organizationalEntityMessageID: number;
    organizationalEntityID: number;
    organizationalEntityType:string;
    message:number;
    messageType:string;
    messageTypeID:number;
    startDate:Date;
    startDateString:string;
    endDate:Date;
    endDateString:string;
    recipients:string;
    includeChildren:boolean
    activationStatus:boolean;
  constructor(organizationalEntityMessage) {
    {
       this.organizationalEntityMessageID = organizationalEntityMessage.organizationalEntityMessageID || -1;
       this.organizationalEntityID = organizationalEntityMessage.organizationalEntityID || '';
       this.organizationalEntityType = organizationalEntityMessage.organizationalEntityType || '';
       this.message = organizationalEntityMessage.message || '';
       this.messageTypeID = organizationalEntityMessage.messageTypeID || '';
       this.startDateString = organizationalEntityMessage.startDateString || '';
       this.endDateString = organizationalEntityMessage.endDateString || '';
       this.includeChildren = organizationalEntityMessage.includeChildren || '';
       this.activationStatus = organizationalEntityMessage.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

