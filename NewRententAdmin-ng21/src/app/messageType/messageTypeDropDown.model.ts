// @ts-nocheck
import { formatDate } from '@angular/common';
export class MessageTypeDropDown {
   messageTypeID: number;
   messageType: string;

  constructor(messageTypeDropDown) {
    {
       this.messageTypeID = messageTypeDropDown.messageTypeID || -1;
       this.messageType = messageTypeDropDown.messageType || '';
    }
  }
  
}

