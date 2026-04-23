// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookingScreen } from './bookingScreen.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BookingScreenService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "bookingScreen";
  }
  /** CRUD METHODS */
  getTableData(SearchBookingScreen:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchBookingScreen==="")
    {
      SearchBookingScreen="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBookingScreen + '/' + SearchActivationStatus +'/' + PageNumber + '/BookingScreen/Ascending');
  }
  getTableDataSort(SearchBookingScreen:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchBookingScreen==="")
    {
      SearchBookingScreen="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBookingScreen + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: BookingScreen) 
  {
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BookingScreen)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(bookingScreenID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ bookingScreenID);
  }

  
}
  

