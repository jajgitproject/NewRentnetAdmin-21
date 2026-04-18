// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerAddress } from './customerAddress.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerAddressService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAddress";
  }
  /** CRUD METHODS */
  getTableData(CustomerAddressID:number,
    Customer_ID:number, 
    SearchCity:string,
    SearchPin:string,
    SearchLandmark:string,
    SearchAddress:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchPin==="")
    {
      SearchPin="null";
    }
    if(SearchLandmark==="")
    {
      SearchLandmark="null";
    }
    if(SearchAddress==="")
    {
      SearchAddress="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerAddressID + '/'+Customer_ID + '/'+SearchCity + '/'+SearchPin + '/'+SearchLandmark + '/' + SearchAddress + '/' + SearchActivationStatus +'/' + PageNumber + '/customerAddressID/Ascending');
  }
  getTableDataSort(CustomerAddressID:number,
    Customer_ID:number, 
    SearchCity:string,
    SearchPin:string,
    SearchLandmark:string,
    SearchAddress:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchPin==="")
    {
      SearchPin="null";
    }
    if(SearchLandmark==="")
    {
      SearchLandmark="null";
    }
    if(SearchAddress==="")
    {
      SearchAddress="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerAddressID + '/'+Customer_ID + '/'+SearchCity + '/'+SearchPin + '/'+SearchLandmark + '/' + SearchAddress + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerAddress) 
  {
    advanceTable.customerAddressID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAddress)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerAddressID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerAddressID+ '/'+ userID);
  }
}
