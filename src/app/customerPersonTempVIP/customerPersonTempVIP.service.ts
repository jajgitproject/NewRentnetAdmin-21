// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonTempVIP } from './customerPersonTempVIP.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonTempVIPService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonTempVIP";
  }
  /** CRUD METHODS */
  getTableData(customerPersonID:number,searchremark:string,searchvipStatusStartDate:string,searchvipStatusEndDate:string,searchforNumberofBookings:string,searchforNumberofBookingsStartsFrom:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerPersonID===0)
    {
      customerPersonID=0;
    }
    if(searchremark==="")
    {
      searchremark="null";
    }
    if(searchvipStatusStartDate==="")
    {
      searchvipStatusStartDate="null";
    }
    if(searchvipStatusEndDate==="")
    {
      searchvipStatusEndDate="null";
    }
    if(searchforNumberofBookings==="")
    {
      searchforNumberofBookings="null";
    }
    if(searchforNumberofBookingsStartsFrom==="")
    {
      searchforNumberofBookingsStartsFrom="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerPersonID + '/'+searchremark + '/'+searchvipStatusStartDate + '/' +searchvipStatusEndDate + '/' +searchforNumberofBookings + '/'+searchforNumberofBookingsStartsFrom + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonTempVIPID/Ascending');
  }
  getTableDataSort(customerPersonID:number,searchremark:string,searchvipStatusStartDate:string,searchvipStatusEndDate:string,searchforNumberofBookings:string,searchforNumberofBookingsStartsFrom:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerPersonID===0)
    {
      customerPersonID=0;
    }
    if(searchremark==="")
    {
      searchremark="null";
    }
    if(searchvipStatusStartDate==="")
    {
      searchvipStatusStartDate="null";
    }
    if(searchvipStatusEndDate==="")
    {
      searchvipStatusEndDate="null";
    }
    if(searchforNumberofBookings==="")
    {
      searchforNumberofBookings="null";
    }
    if(searchforNumberofBookingsStartsFrom==="")
    {
      searchforNumberofBookingsStartsFrom="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerPersonID + '/'+searchremark + '/'+searchvipStatusStartDate + '/' +searchvipStatusEndDate + '/' +searchforNumberofBookings + '/'+searchforNumberofBookingsStartsFrom + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonTempVIP) 
  {
    advanceTable.customerPersonTempVIPID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.vipStatusStartDateString=this.generalService.getTimeApplicable(advanceTable.vipStatusStartDate);
    advanceTable.vipStatusEndDateString=this.generalService.getTimeApplicableTO(advanceTable.vipStatusEndDate);
    advanceTable.forNumberofBookingsStartsFromString=this.generalService.getTimeApplicableTO(advanceTable.forNumberofBookingsStartsFrom);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonTempVIP)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.vipStatusStartDateString=this.generalService.getTimeApplicable(advanceTable.vipStatusStartDate);
    advanceTable.vipStatusEndDateString=this.generalService.getTimeApplicableTO(advanceTable.vipStatusEndDate);
    advanceTable.forNumberofBookingsStartsFromString=this.generalService.getTimeApplicableTO(advanceTable.forNumberofBookingsStartsFrom);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonTempVIPID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonTempVIPID + '/'+ userID);
  }
}
