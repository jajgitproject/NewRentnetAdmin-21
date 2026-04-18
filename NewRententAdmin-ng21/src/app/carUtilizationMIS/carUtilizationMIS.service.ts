// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CarUtilizationMIS } from './carUtilizationMIS.model';
@Injectable()
export class CarUtilizationMISService {
  private API_URL: string = '';
  private VehicleInterStateTAX_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "carUtilizationMIS";

  }
  /** CRUD METHODS */
  getTableData(searchcarLocation: string,
    Vehicle: string,
    searchcarNumber: string,
    searchownedSupplier: string,
    openDate: string,
    status: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (searchcarLocation === "") {
      searchcarLocation = "null";
    }
    if(Vehicle==="")
      {
        Vehicle="null";
      }
    if (searchcarNumber === "") {
      searchcarNumber = "null";
    }
    if (searchownedSupplier === "") {
      searchownedSupplier = "null";
    }
    if (openDate === "") {
      openDate = "null";
    }
    if (status === "") {
      status = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchcarLocation + "/" + Vehicle + "/" + searchcarNumber + "/" + searchownedSupplier + "/" + openDate + "/" + status + "/" + SearchActivationStatus + '/' + PageNumber + '/ReservationID/Descending');
  }
  getTableDataSort(searchcarLocation: string,
    Vehicle: string,
    searchcarNumber: string,
    searchownedSupplier: string,
    openDate: string,
    status: string, SearchActivationStatus: Boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchcarLocation === "") {
      searchcarLocation = "null";
    }
    if (Vehicle === "") {
      Vehicle = "null";
    }
    if (searchcarNumber === "") {
      searchcarNumber = "null";
    }
    if (searchownedSupplier === "") {
      searchownedSupplier = "null";
    }
    if (openDate === "") {
      openDate = "null";
    }
    if (status === "") {
      status = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    //console.log(this.API_URL + "/" +RegistrationNumber + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" + searchcarLocation + "/" + Vehicle + "/" + searchcarNumber + "/" + searchownedSupplier + "/" + openDate + "/" + status + "/" + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  // add(advanceTable: CarUtilizationMIS) 
  // {
  //   advanceTable.interstateTaxID=-1;
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: CarUtilizationMIS)
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


