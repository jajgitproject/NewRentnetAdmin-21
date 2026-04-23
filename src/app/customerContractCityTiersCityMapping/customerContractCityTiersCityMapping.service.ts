// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContractCityTiersCityMapping } from './customerContractCityTiersCityMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContractCityTiersCityMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContractCityTiersCityMapping";
  }
  /** CRUD METHODS */
  getTableData(customerContractCityTiersID:number,SearchCustomerContractCityTiersCityMappingID:number,SearchName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContractCityTiersID + '/'+SearchCustomerContractCityTiersCityMappingID + '/'+SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/customerContractCityTiersCityMappingID/Ascending');
  }
  getTableDataSort(customerContractCityTiersID:number,SearchCustomerContractCityTiersCityMappingID:number,SearchName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContractCityTiersID + '/'+SearchCustomerContractCityTiersCityMappingID + '/'+SearchName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerContractCityTiersCityMapping) 
  {
    advanceTable.customerContractCityTiersCityMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContractCityTiersCityMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerContractCityTiersCityMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContractCityTiersCityMappingID + '/'+ userID);
  }
}
