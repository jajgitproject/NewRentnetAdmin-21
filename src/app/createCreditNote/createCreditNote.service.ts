// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CreateCreditNote } from './createCreditNote.model';
@Injectable()
export class CreateCreditNoteService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "createCreditNote";
  }
  /** CRUD METHODS */
  getTableData(
    searchCustomerName:string,
    searchBillNo:string,
    searchFromDate:string,
    searchToDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchBillNo==="")
    {
      searchBillNo="null";
    }
    if(searchFromDate==="")
    {
      searchFromDate="null";
    }
     if(searchToDate==="")
    {
      searchToDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchBillNo+ '/'+searchFromDate + '/' + searchToDate + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }
  
  getTableDataSort(
    searchCustomerName:string,
    searchBillNo:string,
    searchFromDate:string,
    searchToDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchBillNo==="")
    {
      searchBillNo="null";
    }
    if(searchFromDate==="")
    {
      searchFromDate="null";
    }
     if(searchToDate==="")
    {
      searchToDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchBillNo + '/'+searchFromDate + '/'+ searchToDate + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CreateCreditNote) 
  {
     if(advanceTable.branchID === 0)
    {
      advanceTable.branchID =0;
    }
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.invoiceCreditNoteID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CreateCreditNote)
  {
     if(advanceTable.branchID === 0)
    {
      advanceTable.branchID =0;
    }
     advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerID+ '/'+ userID);
  }
}
