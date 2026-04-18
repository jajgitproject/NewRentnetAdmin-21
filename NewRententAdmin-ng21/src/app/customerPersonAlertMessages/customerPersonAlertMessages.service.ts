// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonAlertMessages } from './customerPersonAlertMessages.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonAlertMessagesService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonAlertMessages";
  }
  /** CRUD METHODS */
  getTableData(customerPersonID:number,searchcarAlert:string,searchdriverAlert:string,searchbookingAlert:string,searchdispatchAlert:string,searchbillingAlert:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerPersonID===0)
    {
      customerPersonID=0;
    }
    if(searchcarAlert==="")
    {
      searchcarAlert="null";
    }
    if(searchdriverAlert==="")
    {
      searchdriverAlert="null";
    }
    if(searchbookingAlert==="")
    {
      searchbookingAlert="null";
    }
    if(searchdispatchAlert==="")
    {
      searchdispatchAlert="null";
    }
    if(searchbillingAlert==="")
    {
      searchbillingAlert="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerPersonID + '/'+searchcarAlert + '/'+searchdriverAlert + '/' +searchbookingAlert + '/' +searchdispatchAlert + '/'+searchbillingAlert + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonAlertMessagesID/Ascending');
  }
  getTableDataSort(customerPersonID:number,searchcarAlert:string,searchdriverAlert:string,searchbookingAlert:string,searchdispatchAlert:string,searchbillingAlert:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerPersonID===0)
    {
      customerPersonID=0;
    }
    if(searchcarAlert==="")
    {
      searchcarAlert="null";
    }
    if(searchdriverAlert==="")
    {
      searchdriverAlert="null";
    }
    if(searchbookingAlert==="")
    {
      searchbookingAlert="null";
    }
    if(searchdispatchAlert==="")
    {
      searchdispatchAlert="null";
    }
    if(searchbillingAlert==="")
    {
      searchbillingAlert="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerPersonID + '/'+searchcarAlert + '/'+searchdriverAlert + '/' +searchbookingAlert + '/' +searchdispatchAlert + '/'+searchbillingAlert + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonAlertMessages) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerPersonAlertMessagesID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonAlertMessages)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonAlertMessagesID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonAlertMessagesID + '/'+ userID);
  }
}
