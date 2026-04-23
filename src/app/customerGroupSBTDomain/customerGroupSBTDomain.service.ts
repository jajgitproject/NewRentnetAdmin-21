// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerGroupSBTDomain } from './customerGroupSBTDomain.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerPersonDropDown } from '../personShort/personShortDropDown.model';
import { CustomerPersonModels } from '../customerCorporateIndividual/customerCorporateIndividual.model';
@Injectable()
export class CustomerGroupSBTDomainService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  http: any;
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerGroupSBTDomain";
  }
  /** CRUD METHODS */
  getTableData(customerGroupID:number,searchSbtDomain:string,SearchStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchSbtDomain==="")
    {
      searchSbtDomain="null";
    }
    
    if(SearchStatus===null)
    {
      SearchStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/'+searchSbtDomain + '/'+ SearchStatus +'/' + PageNumber + '/customerGroupSBTDomainID/Ascending');
  }
  getTableDataSort(customerGroupID:number,searchSbtDomain:string, SearchStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchSbtDomain==="")
    {
      searchSbtDomain="null";
    }
    if(SearchStatus===null)
    {
      SearchStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/'+searchSbtDomain + '/' + SearchStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerGroupSBTDomain) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerGroupSBTDomainID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerGroupSBTDomain)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerGroupSBTDomainID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerGroupSBTDomainID  + '/'+ userID);
  }
  getCustomerForApproval(customerGroupID:number): Observable<CustomerPersonModels[]> {
    return this.httpClient.get<CustomerPersonModels[]>(this.API_URL + "/getCustomerForApproval/"+customerGroupID);

  }
}
