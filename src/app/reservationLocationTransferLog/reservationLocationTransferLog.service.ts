// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationLocationTransferLogModel } from './reservationLocationTransferLog.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReservationLocationTransferLogService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationLocationTransferLog";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + 'getAllReservationLocationTransferLog' + '/' + ReservationID);
  }

  getTransferLocationFromReservation(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + 'getTransferLocationFromReservation' + '/' + ReservationID);
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
    //console.log(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ReservationLocationTransferLogModel) 
  {
    advanceTable.reservationLocationTransferLogID-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.transferDateString=this.generalService.getTimeApplicable(advanceTable.transferDate);
    advanceTable.transferTimeString=this.generalService.getTimeApplicable(advanceTable.transferTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: ReservationLocationTransferLogModel)
  {
    advanceTable.reservationLocationTransferLogID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.transferDateString=this.generalService.getTimeApplicable(advanceTable.transferDate);
    // advanceTable.transferTimeString=this.generalService.getTimeApplicable(advanceTable.transferTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(bankID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ bankID + '/'+ userID);
  }

}
  

