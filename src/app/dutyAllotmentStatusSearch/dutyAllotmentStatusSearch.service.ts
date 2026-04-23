// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
// import { DutyAllotmentStatusSearch } from './dutyAllotmentStatusSearch.model';
@Injectable()
export class DutyAllotmentStatusSearchService {
  private API_URL: string = '';
  private VehicleInterStateTAX_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "dutyAllotmentStatusSearch";

  }
  /** CRUD METHODS */
  getTableData(
    searchpickupadate: string,
    // searchPickupTime: string,
    locationID: number,
   ): Observable<any> {

    if (searchpickupadate === "") {
      searchpickupadate = "null";
    }
    // if (searchPickupTime === "") {
    //   searchPickupTime = "null";
    // }
    if (locationID === 0) {
      locationID = 0;
    }
    return this.httpClient.get(this.API_URL + "/" + searchpickupadate + "/"+ locationID);
  }
  getTableDataSort(
    searchpickupadate: string,
    // searchPickupTime: string,
    searchlocation: string,
   coloumName: string, sortType: string): Observable<any> {

    if (searchpickupadate === "") {
      searchpickupadate = "null";
    }
    // if (searchPickupTime === "") {
    //   searchPickupTime = "null";
    // }
    if (searchlocation === "") {
      searchlocation = "null";
    }

    return this.httpClient.get(this.API_URL + "/" + searchpickupadate + "/" + searchlocation + "/"  + coloumName + '/' + sortType);
  }

  // add(advanceTable: DutyAllotmentStatusSearch) 
  // {
  //   advanceTable.interstateTaxID=-1;
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: DutyAllotmentStatusSearch)
  // { 
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn); 
  //   return this.httpClient.put<any>(this.API_URL , advanceTable);
  // }
  // delete(interstateTaxID: number):  Observable<any> 
  // {
  //   let userID=this.generalService.getUserID();
  //   return this.httpClient.delete(this.API_URL + '/'+ interstateTaxID + '/' + userID);
  // }

}


