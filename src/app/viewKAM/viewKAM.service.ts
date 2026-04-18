// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewKAM } from './viewKAM.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ViewKAMService 
{
  private API_URL:string = '';
  private Customer_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "viewKAM";
    this.Customer_API_URL=generalService.BaseURL+ "customer";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,SearchViewKAMName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerID===undefined)
    {
      customerID=null;
    }
    if(SearchViewKAMName==="")
    {
      SearchViewKAMName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/' +SearchViewKAMName + '/' + SearchActivationStatus +'/' + PageNumber + '/serviceDescription/Ascending');
  }

  getCustomer(customerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.Customer_API_URL+ '/GetCustomerNameForViewKAM/' +customerID);
  }

  getTableDataSort(customerID:number,SearchViewKAMName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerID===undefined)
    {
      customerID=null;
    }
    if(SearchViewKAMName==="")
    {
      SearchViewKAMName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+SearchViewKAMName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: ViewKAM) 
  {
    advanceTable.CustomerKeyAccountManagerID=-1;
   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ViewKAM)
  {
   
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(viewKAMID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ viewKAMID);
  }
}
