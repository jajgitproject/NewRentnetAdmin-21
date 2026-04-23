// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ClientWiseReportService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "clientWiseReport";
  }
  /** CRUD METHODS */
  getTableData(SearchYear:string,SearchMonth:string,SearchCustomerName:string,SearchCity:string,SearchLocation:string,
               SearchCarCategory:string,SearchFromDate:string,SearchToDate:string,PageNumber: number):  Observable<any> 
  {
    if(SearchYear==="")
    {
      SearchYear="null";
    }
    if(SearchMonth==="")
    {
      SearchMonth="null";
    }
    if(SearchCustomerName==="")
    {
      SearchCustomerName="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchLocation==="")
    {
      SearchLocation="null";
    }
    if(SearchCarCategory==="")
    {
      SearchCarCategory="null";
    }
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    return this.httpClient.get(this.API_URL + "/" + SearchYear + '/' + SearchMonth + '/' + SearchCustomerName  + '/' + SearchCity + '/' + SearchLocation + '/' + SearchCarCategory + '/' + SearchFromDate + '/' + SearchToDate + '/'  + PageNumber + '/CustomerID/Descending');
  }

  getTableDataSort(SearchYear:string,SearchMonth:string,SearchCustomerName:string,SearchCity:string,SearchLocation:string,SearchCarCategory:string,
                  SearchFromDate:string,SearchToDate:string,PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchYear==="")
    {
      SearchYear="null";
    }
    if(SearchMonth==="")
    {
      SearchMonth="null";
    }
    if(SearchCustomerName==="")
    {
      SearchCustomerName="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchLocation==="")
    {
      SearchLocation="null";
    }
    if(SearchCarCategory==="")
    {
      SearchCarCategory="null";
    }
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    return this.httpClient.get(this.API_URL + "/" + SearchYear + '/' + SearchMonth + '/' + SearchCustomerName  + '/' + SearchCity + '/' + SearchLocation + 
                            '/' + SearchCarCategory + '/' + SearchFromDate + '/' + SearchToDate + '/'  + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  
}
  

