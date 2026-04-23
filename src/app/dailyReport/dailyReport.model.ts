// @ts-nocheck
import { formatDate } from '@angular/common';
export class DailyReport {
  inventoryDailyTargetAchievementID: number;
  dateInDutySlip: Date;
   dailyReportType:string
   dailyReportValue:string
   activationStatus: boolean;
  
  constructor(dailyReport) {
    {
       this.inventoryDailyTargetAchievementID= dailyReport.inventoryDailyTargetAchievementID || -1;
       this.dateInDutySlip = dailyReport.dateInDutySlip || '';
       this.dailyReportType = dailyReport.dailyReportType || '';
       this.dailyReportValue = dailyReport.dailyReportValue|| '';
       this.activationStatus = dailyReport.activationStatus || '';
       
    }
  }
  
}

