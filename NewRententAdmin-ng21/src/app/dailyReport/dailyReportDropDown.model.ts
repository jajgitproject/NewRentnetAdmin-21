// @ts-nocheck
import { formatDate } from '@angular/common';
export class DailyReportDropDown {
  dailyReportDetailsID: number;
   dailyReport: string;

  constructor(dailyReportDropDown) {
    {
       this.dailyReportDetailsID = dailyReportDropDown.dailyReportDetailsID || -1;
       this.dailyReport = dailyReportDropDown.dailyReport || '';
    }
  }
  
}

