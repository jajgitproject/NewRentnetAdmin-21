// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DutySlipLTRStatementModel } from './dutySlipLTRStatement.model';
@Injectable()
export class DutySlipLTRStatementService 
{
  private API_URL:string = '';
  private API_URL_auth:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL= generalService.BaseURL+"reservation";
    this.API_URL_auth=generalService.BaseURL+ "auth";
  }

  getPickupDropoffDate(DutySlipID:number)
  {
    return this.httpClient.get(this.API_URL+"/"+'getPickupDropoffDates'+"/"+DutySlipID);
  }

  getLTRData(ReservationID:number)
  {
    return this.httpClient.get(this.API_URL+"/"+'getLTRDetails'+"/"+ReservationID);
  }

  getDateTimeKM(DutySlipID:number)
  {
    return this.httpClient.get(this.API_URL+"/"+'getDateTimeKMForLTR'+"/"+DutySlipID);
  }

  getKMHR(CustomerID:number,PackageID:number,PickupDate:string)
  {
    return this.httpClient.get(this.API_URL+"/"+'getKMHRForLTR'+"/"+CustomerID+"/"+PackageID+"/"+PickupDate);
  }

 
  add(advanceTable: DutySlipLTRStatementModel):Observable<any> 
  {
      advanceTable.dutySlipLTRStatementID = -1;
      advanceTable.dutyStartDateString = this.generalService.getTimeApplicable(advanceTable.dutyStartDate);
      advanceTable.dutyEndDateString = this.generalService.getTimeApplicableTO(advanceTable.dutyEndDate);
      advanceTable.dutyStartTimeString = this.generalService.getTimeApplicable(advanceTable.dutyStartTime);
      advanceTable.dutyEndTimeString = this.generalService.getTimeApplicableTO(advanceTable.dutyEndTime);
    return this.httpClient.post<any>(this.API_URL + "/" + 'addLTR' , advanceTable);
  }

  update(advanceTable: DutySlipLTRStatementModel):Observable<any> 
  {
      advanceTable.dutyStartDateString = this.generalService.getTimeApplicable(advanceTable.dutyStartDate);
      advanceTable.dutyEndDateString = this.generalService.getTimeApplicableTO(advanceTable.dutyEndDate);
      advanceTable.dutyStartTimeString = this.generalService.getTimeApplicable(advanceTable.dutyStartTime);
      advanceTable.dutyEndTimeString = this.generalService.getTimeApplicableTO(advanceTable.dutyEndTime);
    return this.httpClient.put<any>(this.API_URL + "/" + 'updateLTR' , advanceTable);
  }

  getDataByDate(advanceTable:DutySlipLTRStatementModel) 
  {
    return this.httpClient.post<any>(this.API_URL+"/"+'LTRMethod',advanceTable);
  }

  getLTRByIDsDate(ReservationID:number,DutySlipID:number)
  {
    return this.httpClient.get(this.API_URL+"/"+'getLTR'+"/"+ReservationID+"/"+DutySlipID);
  }
}
