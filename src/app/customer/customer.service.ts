// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer, CustomerNameModel } from './customer.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customer";
  }
  /** CRUD METHODS */
  getTableData(
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchCustomerType+ '/'+searchcustomerGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }

   getTableDataForSerch(
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchCustomerType+ '/'+searchcustomerGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }

  
  getTableDataSort(
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchCustomerType + '/'+searchcustomerGroup + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Customer) 
  {
    advanceTable.customerCreatedByID=this.generalService.getUserID();
    advanceTable.customerID=-1;

    if(!advanceTable.maximumAgeOfCarToBeSent){
      advanceTable.maximumAgeOfCarToBeSent=0
    }

    if(!advanceTable.locationCollectionInterval){
      advanceTable.locationCollectionInterval=0
    }
    if(!advanceTable.locationUploadInterval){
      advanceTable.locationUploadInterval=0
    }
    if (advanceTable.newCustomer === false) 
      {
        advanceTable.treatAsNewCustomerTillDateString = null;
      }
      else 
      {
        advanceTable.treatAsNewCustomerTillDateString = this.generalService.getTimeApplicable(advanceTable.treatAsNewCustomerTillDate);
      }
    advanceTable.customerCreationDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreationDate);
    
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Customer)
  {
    advanceTable.customerCreatedByID=this.generalService.getUserID();

    // if(!advanceTable.maximumAgeOfCarToBeSent){
    //   advanceTable.maximumAgeOfCarToBeSent=0
    // }

    // if(!advanceTable.locationCollectionInterval){
    //   advanceTable.locationCollectionInterval=0
    // }
    // if(!advanceTable.locationUploadInterval){
    //   advanceTable.locationUploadInterval=0
    // }
    if (advanceTable.newCustomer === false) 
      {
        advanceTable.treatAsNewCustomerTillDateString = null;
      }
      else 
      {
        advanceTable.treatAsNewCustomerTillDateString = this.generalService.getTimeApplicable(advanceTable.treatAsNewCustomerTillDate);
      }
    advanceTable.customerCreationDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreationDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerID+ '/'+ userID);
  }

  DuplicateCustomer(CustomerName:string): Observable<CustomerNameModel>
  {
    return this.httpClient.get<CustomerNameModel>(this.API_URL + "/checkDuplicateCustomerName/" + CustomerName);
  }
}
