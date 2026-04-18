// @ts-nocheck
import { formatDate } from '@angular/common';
export class DriverReward {
  driverRewardID: number;
  driverGradeID: number;
  rewardAmount:string;
  driverGradeName: string;
  startDate: Date;
  endDate:Date;
  grade:string;
  startDateString:string;
  endDateString:string;
   activationStatus:boolean;
   userID:number;
  constructor(driverReward) {
    {
       this.driverRewardID = driverReward.driverRewardID || -1;
       this.driverGradeID = driverReward.driverGradeID || '';
       this.driverGradeName = driverReward.driverGradeName || '';
       this.rewardAmount = driverReward.rewardAmount || '';
       this.startDateString = driverReward.startDateString || '';
       this.endDateString = driverReward.endDateString || '';
       this.startDate=new Date();
       this.endDate=new Date();
       this.activationStatus = driverReward.activationStatus || '';
    }
  }
  
}

