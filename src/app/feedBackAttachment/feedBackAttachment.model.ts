// @ts-nocheck
import { formatDate } from '@angular/common';
export class FeedBackAttachment {
   tripFeedBackAttachmentID: number;
   tripFeedBackID: number;
   tripFeedBackAttachment: string;
   activationStatus: boolean;
  dutySlipID: number;

  constructor(feedBackAttachment) {
    {
       this.tripFeedBackAttachmentID = feedBackAttachment.tripFeedBackAttachmentID || -1;
       this.tripFeedBackAttachmentID = feedBackAttachment.tripFeedBackAttachmentID || '';
       this.tripFeedBackAttachment = feedBackAttachment.tripFeedBackAttachment || '';
       this.activationStatus = feedBackAttachment.activationStatus || '';
      
    }
  }
  
}

