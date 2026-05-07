// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { DutyPostPickUPCallModel } from './dutyPostPickUPCall.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyPostPickUPCallService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyPostPickUPCall";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + 'getAllDutyPostPickUPCall' + '/' + ReservationID);
  }

  getTransferLocationFromReservation(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + 'getTransferLocationFromReservation' + '/' + ReservationID);
  }

  
  getDataDutyPostPickUpCall(dutySlipID: number, reservationID: number): Observable<any> {
  return this.httpClient.get(`${this.API_URL}/GetPassToSupplierByID/${dutySlipID}/${reservationID}`);
}


  getTableDataSort(SearchBank:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchBank==="")
    {
      SearchBank="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DutyPostPickUPCallModel) 
  {
    advanceTable.dutyPostPickUPCallID-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.postPickUpCallDateString=this.generalService.getTimeApplicable(advanceTable.postPickUpCallDate);
    advanceTable.postPickUpCallTimeString=this.generalService.getTimeApplicable(advanceTable.postPickUpCallTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: DutyPostPickUPCallModel)
  {
    advanceTable.userID=this.generalService.getUserID();
     advanceTable.postPickUpCallDateString=this.generalService.getTimeApplicable(advanceTable.postPickUpCallDate);
    advanceTable.postPickUpCallTimeString=this.generalService.getTimeApplicable(advanceTable.postPickUpCallTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(bankID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ bankID + '/'+ userID);
  }

}
  

