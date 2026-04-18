// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerReservationFieldValues } from './customerReservationFieldValues.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerReservationFieldValuesService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerReservationFieldValues";
  }
  /** CRUD METHODS */
  getTableData(customerReservationFieldID:number,searchFieldValue:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    debugger;
    if(customerReservationFieldID===0)
    {
      customerReservationFieldID=0;
    }
    if(searchFieldValue==="")
    {
      searchFieldValue="null";
    }

    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    console.log(this.API_URL + "/" +customerReservationFieldID + '/'+searchFieldValue +  '/'+ SearchActivationStatus +'/' + PageNumber + '/customerReservationFieldValuesID/Ascending')
    return this.httpClient.get(this.API_URL + "/" +customerReservationFieldID + '/'+searchFieldValue +  '/'+ SearchActivationStatus +'/' + PageNumber + '/customerReservationFieldValuesID/Ascending');
  }
  getTableDataSort(customerReservationFieldID:number,searchFieldValue:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerReservationFieldID===0)
    {
      customerReservationFieldID=0;
    }
    if(searchFieldValue==="")
    {
      searchFieldValue="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerReservationFieldID + '/'+searchFieldValue + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerReservationFieldValues) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerReservationFieldValues)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerReservationFieldValuesID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerReservationFieldValuesID+ '/'+ userID);
  }
}
