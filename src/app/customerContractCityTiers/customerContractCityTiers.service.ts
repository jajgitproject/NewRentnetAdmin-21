// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContractCityTiers } from './customerContractCityTiers.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContractCityTiersService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContractCityTiers";
  }
  /** CRUD METHODS */
  getTableData(customerContractID:number,searchCustomerContractCityTier:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchCustomerContractCityTier==="")
    {
      searchCustomerContractCityTier="null";
    }
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContractID + '/'+searchCustomerContractCityTier + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerContractCityTiersID/Ascending');
  }
  getTableDataSort(customerContractID:number,searchCustomerContractCityTier:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {

    if(searchCustomerContractCityTier==="")
    {
      searchCustomerContractCityTier="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContractID + '/'+searchCustomerContractCityTier + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerContractCityTiers) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerContractCityTiersID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContractCityTiers)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerContractCityTiersID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContractCityTiersID + '/'+ userID);
  }

  
SaveCustomerContractCityTiers(data: CustomerContractCityTiers[]): Observable<any> {
  return this.httpClient.post(this.API_URL +'/Import', data);
}

GetToImportFormContractCityTiers(CustomerContractID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/'+ 'GetCityTierFromCustomerContract'+ '/'+ CustomerContractID);
  }
  ImportFromCustomerContract(data: CustomerContractCityTiers[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/ImportFromCustomerContractCityTiers', data);
  }
}
