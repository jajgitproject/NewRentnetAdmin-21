// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerAlertMessage } from './customerAlertMessage.model';
@Injectable()
export class CustomerAlertMessageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAlertMessage";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,customer:string,employeeName:string,SearchCustomerAlertMessageType:string,SearchCustomerAlertMessage:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(customer==="")
      {
        customer="null";
      }
    if(employeeName==="")
    {
      employeeName="null";
    }
    if(SearchCustomerAlertMessageType==="")
    {
      SearchCustomerAlertMessageType="null";
    }
    if(SearchCustomerAlertMessage==="")
    {
      SearchCustomerAlertMessage="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + customerID + '/' + customer + '/' + employeeName + '/' + SearchCustomerAlertMessageType + '/' + SearchCustomerAlertMessage + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerAlertMessage/Ascending');
  }
  getTableDataSort(customerID:number,customer:string,employeeName:string,SearchCustomerAlertMessageType:string,SearchCustomerAlertMessage:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(customer==="")
      {
        customer="null";
      }
    if(employeeName==="")
    {
      employeeName="null";
    }
    if(SearchCustomerAlertMessageType==="")
    {
      SearchCustomerAlertMessageType="null";
    }
    if(SearchCustomerAlertMessage==="")
    {
      SearchCustomerAlertMessage="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + customerID  + '/' + customer + '/' + employeeName + '/' +SearchCustomerAlertMessageType + '/' + SearchCustomerAlertMessage + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerAlertMessage) 
  {
    advanceTable.customerAlertMessageID=-1;
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicable(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAlertMessage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicable(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerAlertMessageID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerAlertMessageID+ '/'+ userID);
  }

}
  

