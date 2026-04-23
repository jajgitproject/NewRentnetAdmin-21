// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerConfigurationReservation } from './customerConfigurationReservation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerConfigurationReservationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerConfigurationReservation";
  }
  /** CRUD METHODS */
  getTableData(SearchID:number,CustomerID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchID + '/'+CustomerID + '/' + SearchActivationStatus +'/' + PageNumber + '/customerConfigurationReservationID/Ascending');
  }
  getTableDataSort(SearchID:number,CustomerID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchID + '/'+CustomerID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerConfigurationReservation) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerConfigurationReservationID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerConfigurationReservation)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerConfigurationReservationID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerConfigurationReservationID+ '/'+ userID);
  }
}
