// @ts-nocheck
import { formatDate } from '@angular/common';
export class CustomerOTPConfiguration {
  customerOTPConfigurationID: number;
  customerID: number;
  otpType : string;
  //corporateCompanyID:number;
  startDate: Date;
  endDate:Date;
  startDateString:string;
  endDateString:string;
   activationStatus:boolean;
   startTripOTPTimerInMinutes:number;
   endTripOTPTimerInMinutes:number;
   isStartOTPRequired:boolean;
   isEndOTPRequired:boolean;
   otpLength:number;
  userID: number;

  constructor(customerOTPConfiguration) {
    {
       this.customerOTPConfigurationID = customerOTPConfiguration.customerOTPConfigurationID || -1;
       this.customerID = customerOTPConfiguration.customerID || '';
       this.otpType = customerOTPConfiguration.otpType || '';
       this.startDateString = customerOTPConfiguration.startDateString || '';
       this.endDateString = customerOTPConfiguration.endDateString || '';
        this.startTripOTPTimerInMinutes = customerOTPConfiguration.startTripOTPTimerInMinutes || '';
        this.endTripOTPTimerInMinutes = customerOTPConfiguration.endTripOTPTimerInMinutes || '';
         this.otpLength = customerOTPConfiguration.otpLength || '';
          this.isStartOTPRequired = customerOTPConfiguration.isStartOTPRequired || '';
           this.isEndOTPRequired = customerOTPConfiguration.isEndOTPRequired || '';
       this.startDate=new Date();
      //  this.endDate=new Date();
       this.activationStatus = customerOTPConfiguration.activationStatus || '';
    }
  }
  
}

