// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerGroup, CustomerGroupModel } from './customerGroup.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerGroupService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerGroup";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomerGroup:string,searchCreateBookingBeforeMinutes:string,searchEditBookingBeforeMinutes:string,searchCancelBookingBeforeMinutes:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerGroup==="")
    {
      SearchCustomerGroup="null";
    }
    if(searchCreateBookingBeforeMinutes==="")
    {
      searchCreateBookingBeforeMinutes="null";
    }
    if(searchEditBookingBeforeMinutes==="")
    {
      searchEditBookingBeforeMinutes="null";
    }
    if(searchCancelBookingBeforeMinutes==="")
    {
      searchCancelBookingBeforeMinutes="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerGroup + '/'+searchCreateBookingBeforeMinutes + '/'+searchEditBookingBeforeMinutes + '/'+searchCancelBookingBeforeMinutes + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerGroup/Ascending');
  }
  getTableDataSort(SearchCustomerGroup:string,searchCreateBookingBeforeMinutes:string,searchEditBookingBeforeMinutes:string,searchCancelBookingBeforeMinutes:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCustomerGroup==="")
    {
      SearchCustomerGroup="null";
    }
    if(searchCreateBookingBeforeMinutes==="")
    {
      searchCreateBookingBeforeMinutes="null";
    }
    if(searchEditBookingBeforeMinutes==="")
    {
      searchEditBookingBeforeMinutes="null";
    }
    if(searchCancelBookingBeforeMinutes==="")
    {
      searchCancelBookingBeforeMinutes="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
     return this.httpClient.get(this.API_URL + "/" +SearchCustomerGroup + '/' +searchCreateBookingBeforeMinutes + '/'+searchEditBookingBeforeMinutes +'/'+searchCancelBookingBeforeMinutes + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerGroup) 
  {
    advanceTable.customerGroupID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerGroup)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerGroupID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerGroupID + '/'+ userID);
  }
  

  DuplicateCustomerGroup(customerGroup:string): Observable<CustomerGroupModel>
  {
    return this.httpClient.get<CustomerGroupModel>(this.API_URL + "/checkDuplicateCustomerGroup/" + customerGroup);
  }

}
  

