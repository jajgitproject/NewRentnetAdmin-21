// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
// import { DateWiseCarwiseBookingReport } from './dateWiseCarwiseBookingReport.model';
@Injectable()
export class DateWiseCarwiseBookingReportService {
  private API_URL: string = '';
  private VehicleInterStateTAX_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "dateWiseCarwiseBookingReport";

  }
  /** CRUD METHODS */
  getTableData(
    searchpickupadate: string,
    searchcity: string,
    searchlocation: string,
    searchvehicleCategory: string,
    SearchActivationStatus: boolean, PageNumber: number): Observable<any> {

    if (searchpickupadate === "") {
      searchpickupadate = "null";
    }
    if (searchcity === "") {
      searchcity = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
    if (searchvehicleCategory === "") {
      searchvehicleCategory = "null";
    }

    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchpickupadate + "/" + searchcity + "/" + searchlocation + "/" + searchvehicleCategory + "/" + SearchActivationStatus + '/' + PageNumber + '/ReservationCount/Descending');
  }
  getTableDataSort(
    searchpickupadate: string,
    searchcity: string,
    searchlocation: string,
    searchvehicleCategory: string,
    SearchActivationStatus: Boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {

    if (searchpickupadate === "") {
      searchpickupadate = "null";
    }
    if (searchcity === "") {
      searchcity = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
    if (searchvehicleCategory === "") {
      searchvehicleCategory = "null";
    }

    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    //console.log(this.API_URL + "/" +RegistrationNumber + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" + searchpickupadate + "/" + searchcity + "/" + searchlocation + "/" + searchvehicleCategory + "/" + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  // add(advanceTable: DateWiseCarwiseBookingReport) 
  // {
  //   advanceTable.interstateTaxID=-1;
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: DateWiseCarwiseBookingReport)
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


