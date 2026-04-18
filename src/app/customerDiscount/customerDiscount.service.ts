// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerDiscount } from './customerDiscount.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerDiscountService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerDiscount";
  }
  /** CRUD METHODS */
  getTableData(CustomerDiscountID:number,CustomerContractMappingID:number,StartDate:string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(StartDate==="")
    {
      StartDate="null";
    }
    if(EndDate==="")
    {
      EndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerDiscountID + '/'+CustomerContractMappingID + '/'+StartDate + '/'+EndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/customerDiscountID/Ascending');
  }
  getTableDataSort(CustomerDiscountID:number,CustomerContractMappingID:number,StartDate:string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(StartDate==="")
    {
      StartDate="null";
    }
    if(EndDate==="")
    {
      EndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerDiscountID + '/'+CustomerContractMappingID + '/'+StartDate + '/'+EndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerDiscount) 
  {
    advanceTable.customerDiscountID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.discountPercentageStartDateString=this.generalService.getTimeApplicable(advanceTable.discountPercentageStartDate);
    advanceTable.discountPercentageEndDateString=this.generalService.getTimeApplicableTO(advanceTable.discountPercentageEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerDiscount)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.discountPercentageStartDateString=this.generalService.getTimeApplicable(advanceTable.discountPercentageStartDate);
    advanceTable.discountPercentageEndDateString=this.generalService.getTimeApplicableTO(advanceTable.discountPercentageEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerDiscountID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerDiscountID+ '/'+ userID);
  }
}
