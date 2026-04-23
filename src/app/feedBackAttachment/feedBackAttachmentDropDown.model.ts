// @ts-nocheck
import { formatDate } from '@angular/common';
export class FeedBackAttachmentDropDown {
 
   feedBackAttachmentID: number;
   additionalServiceID: number;

  constructor(feedBackAttachmentDropDown) {
    {
       this.feedBackAttachmentID = feedBackAttachmentDropDown.feedBackAttachmentID || -1;
       this.additionalServiceID = feedBackAttachmentDropDown.additionalServiceID || '';
    }
  }
  
}

