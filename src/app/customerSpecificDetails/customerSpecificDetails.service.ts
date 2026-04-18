// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerSpecificDetails } from './customerSpecificDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerSpecificDetailsService 
{
  private API_URL:string = '';
  private Reservation_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationCustomerFields";
    this.Reservation_API_URL=generalService.BaseURL+ "reservation";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomerSpecificDetails:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerSpecificDetails==="")
    {
      SearchCustomerSpecificDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerSpecificDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerSpecificDetails/Ascending');
  }

  getTableDataSort(SearchCustomerSpecificDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCustomerSpecificDetails==="")
    {
      SearchCustomerSpecificDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerSpecificDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerSpecificDetails) 
  {
    advanceTable.userID=this.generalService.getUserID();
    //advanceTable.reservationCustomerFieldValueID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: any)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.Reservation_API_URL+'/'+'updateReservation' , advanceTable);
  }
  delete(customerSpecificDetailsID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerSpecificDetailsID + '/'+ userID);
  }

}
  

