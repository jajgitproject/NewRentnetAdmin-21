// @ts-nocheck
import { formatDate } from '@angular/common';
export class FeedBackDetails {
  reservationID: number;
  feedBackRemark: string;
  feedbackPointsOutOfFive: string;

  constructor(FeedBackDetails: any) {
    this.reservationID = FeedBackDetails.reservationID || 0;
    this.feedBackRemark = FeedBackDetails.feedBackRemark || '';
    this.feedbackPointsOutOfFive = FeedBackDetails.feedbackPointsOutOfFive || '';
  }
}


