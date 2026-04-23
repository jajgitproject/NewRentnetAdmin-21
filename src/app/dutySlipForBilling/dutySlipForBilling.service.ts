// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { BillingHistory } from './dutySlipForBilling.model';
import { ClosingDutySlipForBillingModel } from '../clossingOne/closingDutySlipForBilling.model';

@Injectable()
export class DutySlipForBillingService 
{
  private API_URL:string = '';
  private API_URL_GPS:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "closing";
    this.API_URL_GPS=generalService.BaseURL+ "dutySlipByGPS";
  }

  addBillingHistory(advanceTable: BillingHistory)
  {
    return this.httpClient.post<any>(this.API_URL + '/SaveBillingHistory', advanceTable);
  }

  update(advanceTable: ClosingDutySlipForBillingModel)
  {
    if(advanceTable.locationOutDateForBilling)
      {
        advanceTable.locationOutDateForBillingString=this.generalService.getTimeApplicable(advanceTable.locationOutDateForBilling);
        advanceTable.locationOutTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTimeForBilling);

        advanceTable.reportingToGuestDateForBillingString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDateForBilling);
        advanceTable.reportingToGuestTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTimeForBilling);

        advanceTable.pickUpDateForBillingString=this.generalService.getTimeApplicable(advanceTable.pickUpDateForBilling);
        advanceTable.pickUpTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTimeForBilling);

        advanceTable.dropOffDateForBillingString=this.generalService.getTimeApplicable(advanceTable.dropOffDateForBilling);
        advanceTable.dropOffTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.dropOffTimeForBilling);

        advanceTable.locationInDateForBillingString=this.generalService.getTimeApplicable(advanceTable.locationInDateForBilling);
        advanceTable.locationInTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.locationInTimeForBilling);
      } 
      if(advanceTable.reportingToGuestKMForBilling === null)
      {
        advanceTable.reportingToGuestKMForBilling = 0;
      } 
      advanceTable.userID=this.generalService.getUserID();
      return this.httpClient.put<any>(this.API_URL , advanceTable);
    }

 PostDataGPS(dutySlipID:any,RegistrationNumber:any):  Observable<any> 
  { 
    let userID=this.generalService.getUserID();
    return this.httpClient.get(this.API_URL_GPS+'/'+dutySlipID + '/'+RegistrationNumber);
  }
}
  

