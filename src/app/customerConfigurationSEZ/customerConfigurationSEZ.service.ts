// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerConfigurationSEZ } from './customerConfigurationSEZ.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerConfigurationSEZService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerConfigurationSEZ";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchcustomerConfigurationSEZStartDate:string,searchcustomerConfigurationSEZEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchcustomerConfigurationSEZStartDate==="")
    {
      searchcustomerConfigurationSEZStartDate="null";
    }
    if(searchcustomerConfigurationSEZEndDate==="")
    {
      searchcustomerConfigurationSEZEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchcustomerConfigurationSEZStartDate + '/'+searchcustomerConfigurationSEZEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/customerConfigurationSEZID/Ascending');
  }
  getTableDataSort(customerID:number,searchcustomerConfigurationSEZStartDate:string,searchcustomerConfigurationSEZEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchcustomerConfigurationSEZStartDate==="")
    {
      searchcustomerConfigurationSEZStartDate="null";
    }
    if(searchcustomerConfigurationSEZEndDate==="")
    {
      searchcustomerConfigurationSEZEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchcustomerConfigurationSEZStartDate + '/'+searchcustomerConfigurationSEZEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerConfigurationSEZ) 
  {
    advanceTable.customerConfigurationSEZID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerConfigurationSEZStartDateString=this.generalService.getTimeApplicable(advanceTable.customerConfigurationSEZStartDate);
    advanceTable.customerConfigurationSEZEndDateString=this.generalService.getTimeApplicableTO(advanceTable.customerConfigurationSEZEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerConfigurationSEZ)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerConfigurationSEZStartDateString=this.generalService.getTimeApplicable(advanceTable.customerConfigurationSEZStartDate);
    advanceTable.customerConfigurationSEZEndDateString=this.generalService.getTimeApplicableTO(advanceTable.customerConfigurationSEZEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerConfigurationSEZID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerConfigurationSEZID+ '/'+ userID);
  }
}
