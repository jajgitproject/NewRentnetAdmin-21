// @ts-nocheck
import { formatDate } from '@angular/common';
export class IntegrationLog {
   apiIntegrationLogID: number;
   reservationID: number;
   travelRequestNo: string;
   request: string;
   response: string;
   eventName: string;
   eventStatus: string;
   sentDateTime: Date;
   userID:number;
   aggregator : string;

  constructor(integrationLog) {
    {
       this.apiIntegrationLogID = integrationLog.apiIntegrationLogID || -1;
       this.reservationID = integrationLog.reservationID || '';
       this.travelRequestNo = integrationLog.travelRequestNo || '';
       this.request = integrationLog.request || '';
       this.response = integrationLog.response || '';
       this.eventName = integrationLog.eventName || '';
       this.eventStatus = integrationLog.eventStatus || '';
       this.sentDateTime = integrationLog.sentDateTime || '';
       this.userID = integrationLog.userID || '';
       this.aggregator = integrationLog.aggregator || '';
    }
  }
  
}

