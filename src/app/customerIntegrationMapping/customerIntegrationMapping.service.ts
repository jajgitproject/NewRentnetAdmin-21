// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerIntegrationMapping } from './customerIntegrationMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { T } from '@angular/cdk/keycodes';
@Injectable()
export class CustomerIntegrationMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerIntegrationMapping";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomer :string,TallyCode:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomer==="")
    {
      SearchCustomer=null;
    }
    if(TallyCode==="")
    {
      TallyCode=null;
    }
    if(SearchActivationStatus==="")
    {
      SearchActivationStatus=null;
    }
    console.log(this.API_URL + '/' + SearchCustomer+ '/' + TallyCode +'/' + SearchActivationStatus +'/' + PageNumber + '/CustomerIntegrationMappingID/Ascending');
    return this.httpClient.get(this.API_URL + '/' + SearchCustomer+ '/' + TallyCode +'/' + SearchActivationStatus +'/' + PageNumber + '/CustomerIntegrationMappingID/Ascending');
  }
  getTableDataSort(SearchCustomer :string,TallyCode:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(TallyCode==="")
    {
      TallyCode=null;
    } 
    if(SearchCustomer==="")
    {
      SearchActivationStatus=null;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchCustomer+ '/' + TallyCode +'/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerIntegrationMapping) 
  {
    advanceTable.customerIntegrationMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerIntegrationMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(customerIntegrationMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerIntegrationMappingID + '/'+ userID);
  }
  
  GetCustomerAndTallyCode(): Observable<CustomerIntegrationMappingForDropDown[]> {
    console.log(this.API_URL + "/ForDropDown");
    return this.httpClient.get<CustomerIntegrationMappingForDropDown[]>(this.API_URL + "/ForDropDown");
  }

}
  

