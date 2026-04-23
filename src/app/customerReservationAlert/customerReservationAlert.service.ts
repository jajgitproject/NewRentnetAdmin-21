// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerReservationAlert } from './customerReservationAlert.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerReservationAlertService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerReservationAlert";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchreservationAlert:string,searchstartDate:string,searchendDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchreservationAlert==="")
    {
      searchreservationAlert="null";
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchreservationAlert + '/'+searchstartDate + '/'+searchendDate + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerReservationAlertID/Ascending');
  }
  getTableDataSort(customerID:number,searchreservationAlert:string,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchreservationAlert==="")
    {
      searchreservationAlert="null";
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchreservationAlert + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerReservationAlert) 
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    advanceTable.customerReservationAlertID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerReservationAlert)
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerReservationAlertID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerReservationAlertID);
  }
}
