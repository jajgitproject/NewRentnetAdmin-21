// @ts-nocheck
import { formatDate } from '@angular/common';
export class MessageType {
   messageTypeID: number;
   messageType: string;
   activationStatus: boolean;
   updatedBy:number;
   updateDateTime: Date;
   userID:number;

  constructor(messageType) {
    {
       this.messageTypeID = messageType.messageTypeID || -1;
       this.messageType = messageType.messageType || '';
       this.activationStatus = messageType.activationStatus || '';
       this.updatedBy=messageType.updatedBy || 10;
       this.updateDateTime = messageType.updateDateTime;
    }
  }
  
}

