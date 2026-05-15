// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DiscountDetails } from './discountDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DiscountDetailsService 
{
  private API_URL:string = '';
    private API_URL1:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationDiscount";
     this.API_URL1=generalService.BaseURL+ "reservationDiscountForClosing";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/DiscountPercentage/Ascending');
  }

     getTableDataforReservationDiscountClosing(allotmentID: number):  Observable<any> 
    {
      return this.httpClient.get(this.API_URL1 + "/" +'ReservationDiscountForClosingID'+'/'+ allotmentID);
    }

  getTableDataSort(SearchDiscountDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchDiscountDetails==="")
    {
      SearchDiscountDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDiscountDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DiscountDetails) 
  {
    debugger
    advanceTable.reservationDiscountID=-1;
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.discountPercentage === 0 || advanceTable.discountPercentage === undefined || advanceTable.discountPercentage === null)
    {
      advanceTable.discountPercentage = 0;
    }
    if(advanceTable.fixedAmountDiscount === 0 || advanceTable.fixedAmountDiscount === undefined || advanceTable.fixedAmountDiscount === null)
    {
      advanceTable.fixedAmountDiscount = 0;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DiscountDetails)
  {
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.discountPercentage === 0 || advanceTable.discountPercentage === undefined || advanceTable.discountPercentage === null)
    {
      advanceTable.discountPercentage = 0;
    }
    if(advanceTable.fixedAmountDiscount === 0 || advanceTable.fixedAmountDiscount === undefined || advanceTable.fixedAmountDiscount === null)
    {
      advanceTable.fixedAmountDiscount = 0;
    }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationDiscountID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationDiscountID+ '/'+ userID);
  }

}
  

