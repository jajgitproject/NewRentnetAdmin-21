// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonAddress } from './customerPersonAddress.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonAddressService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonAddress";
  }
  /** CRUD METHODS */
  getTableData(CustomerPersonID:number,SearchName:string,SearchCity:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
     return this.httpClient.get(this.API_URL + "/" +CustomerPersonID + '/'+SearchName + '/'+SearchCity + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonAddressID/Ascending');
  }
  getTableDataSort(CustomerPersonID:number,SearchName:string,SearchCity:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerPersonID + '/'+SearchName + '/'+SearchCity + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonAddress) 
  {
    advanceTable.customerPersonAddressID=-1;
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.isFavourite){
      advanceTable.isFavourite=true;
    }
    else{
     advanceTable.isFavourite=false;
    }
     if(advanceTable.pin === ""){
      advanceTable.pin = null;
    }
   if(advanceTable.landMark === ""){
    advanceTable.landMark= null;
   }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonAddress)
  {
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.isFavourite){
      advanceTable.isFavourite=true;
    }
    else{
     advanceTable.isFavourite=false;
    }
     if(advanceTable.pin === ""){
      advanceTable.pin = null;
    }
   if(advanceTable.landMark === ""){
    advanceTable.landMark= null;
   }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonAddressID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonAddressID + '/'+ userID);
  }
}
