// @ts-nocheck
import { formatDate } from '@angular/common';
export class MonthlyBusinessReport {
  inventoryMonthlyTargetAchievementID: number;
    organizationalEntityID: number;
    registrationNumber:string;
    month:number;
    year:number;
    messageTypeID:number;
    startDate:Date;
    startDateString:string;
    endDate:Date;
    endDateString:string;
    monthlyAchievedTargetAmount:string;
    achievementPercentage:string;
    numberOfDuties:number;
    includeChildren:boolean
    activationStatus:boolean;
  constructor(monthlyBusinessReport) {
    {
       this.inventoryMonthlyTargetAchievementID = monthlyBusinessReport.inventoryMonthlyTargetAchievementID || -1;
       this.organizationalEntityID = monthlyBusinessReport.organizationalEntityID || '';
       this.registrationNumber = monthlyBusinessReport.registrationNumber || '';
       this.month = monthlyBusinessReport.month || '';
       this.year = monthlyBusinessReport.year || '';
       this.startDateString = monthlyBusinessReport.startDateString || '';
       this.endDateString = monthlyBusinessReport.endDateString || '';
       this.monthlyAchievedTargetAmount = monthlyBusinessReport.monthlyAchievedTargetAmount || '';
       this.achievementPercentage = monthlyBusinessReport.achievementPercentage || '';
       this.numberOfDuties = monthlyBusinessReport.numberOfDuties || '';
       this.activationStatus = monthlyBusinessReport.activationStatus || '';
       this.startDate=new Date();
       this.endDate=new Date();
    }
  }
  
}

