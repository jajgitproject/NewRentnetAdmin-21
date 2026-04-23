// @ts-nocheck
import { formatDate } from '@angular/common';
export class FeedBackDropDown {
 
   feedBackID: number;
   //additionalServiceID: number;

  constructor(feedBackDropDown) {
    {
       this.feedBackID = feedBackDropDown.feedBackID || -1;
       //this.additionalServiceID = feedBackDropDown.additionalServiceID || '';
    }
  }
  
}

