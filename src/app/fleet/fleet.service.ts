// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
// import { Fleet } from './fleet.model';
@Injectable()
export class FleetService {
  private API_URL: string = '';
  private VehicleInterStateTAX_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "fleet";

  }
  /** CRUD METHODS */
  getTableData(
    SearchdriverName: string,
    RegistrationNumber: string,
    Vehicle: string,
    VehicleCategory: string,
    city: string,
    searchpickupadate: string,
    searchlocation: string,
    searchpickupTime: string,
    SearchActivationStatus:boolean,
     PageNumber: number

  ): Observable<any> {

    if (SearchdriverName === "") {
      SearchdriverName = "null";
    }
    if (RegistrationNumber === "") {
      RegistrationNumber = "null";
    }
    if (Vehicle === "") {
      Vehicle = "null";
    }
    if (VehicleCategory === "") {
      VehicleCategory = "null";
    }
    if (city === "") {
      city = "null";
    }
    if (searchpickupadate === "") {
      searchpickupadate = "null";
    }

    if (searchlocation === "") {
      searchlocation = "null";
    }
    if (searchpickupTime === "") {
      searchpickupTime = "null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+RegistrationNumber + '/' +Vehicle + '/'+VehicleCategory + '/' +city + '/' +searchpickupadate + '/' +searchlocation + '/' +searchpickupTime + '/' + SearchActivationStatus +'/' + PageNumber + '/InventoryID/Dscending');
  }
  getTableDataSort(
    SearchdriverName: string,
    RegistrationNumber: string,
    Vehicle: string,
    VehicleCategory: string,
    city: string,
    searchpickupadate: string,
    searchlocation: string,
    searchpickupTime: string,
    SearchActivationStatus:boolean,
     PageNumber: number,
    coloumName: string, sortType: string): Observable<any> {

      if (SearchdriverName === "") {
        SearchdriverName = "null";
      }
      if (RegistrationNumber === "") {
        RegistrationNumber = "null";
      }
      if (Vehicle === "") {
        Vehicle = "null";
      }
      if (VehicleCategory === "") {
        VehicleCategory = "null";
      }
      if (city === "") {
        city = "null";
      }
      if (searchpickupadate === "") {
        searchpickupadate = "null";
      }
  
      if (searchlocation === "") {
        searchlocation = "null";
      }
      if (searchpickupTime === "") {
        searchpickupTime = "null";
      }

    return this.httpClient.get(this.API_URL + "/" +SearchdriverName + '/'+RegistrationNumber + '/' +Vehicle + '/'+VehicleCategory + '/' +city + '/' +searchpickupadate + '/' +searchlocation + '/' +searchpickupTime + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  // add(advanceTable: Fleet) 
  // {
  //   advanceTable.interstateTaxID=-1;
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: Fleet)
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


