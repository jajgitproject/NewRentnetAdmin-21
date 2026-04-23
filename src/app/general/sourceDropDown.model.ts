// @ts-nocheck
import { formatDate } from '@angular/common';
export class MessageSourceDropDown {
   messageSource: string;
   reservationMessagingID: number;

  constructor(messageSourceDropDown) {
    {
       this.messageSource = messageSourceDropDown.messageSource || '';
       this.reservationMessagingID = messageSourceDropDown.reservationMessagingID || '';
    }
  }
  
}

