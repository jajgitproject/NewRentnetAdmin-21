// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerSpecificFields } from './customerSpecificFields.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerSpecificFieldsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerSpecificFields";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomerSpecificFields:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerSpecificFields==="")
    {
      SearchCustomerSpecificFields="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerSpecificFields + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerSpecificFields/Ascending');
  }

  getTableDataSort(SearchCustomerSpecificFields:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCustomerSpecificFields==="")
    {
      SearchCustomerSpecificFields="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerSpecificFields + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerSpecificFields) 
  {
    advanceTable.customerSpecificFieldsID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerSpecificFields)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerSpecificFieldsID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerSpecificFieldsID);
  }

}
  

