// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorContractCityTiersCityMappingModel } from './vendorContractCityTiersCityMapping.model';
@Injectable()
export class VendorContractCityTiersCityMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorContractCityTiersCityMapping";
  }
  /** CRUD METHODS */
  getTableData(vendorContractCityTiersID:number,SearchVendorContractCityTiersCityMappingID:number,SearchCity:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    debugger
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vendorContractCityTiersID + '/'+SearchVendorContractCityTiersCityMappingID + '/'+SearchCity + '/' + SearchActivationStatus +'/' + PageNumber + '/VendorContractCityTiersCityMappingID/Ascending');
  }


  getTableDataSort(vendorContractCityTiersID:number,SearchVendorContractCityTiersCityMappingID:number,SearchCity:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vendorContractCityTiersID + '/'+SearchVendorContractCityTiersCityMappingID + '/'+SearchCity + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }


  add(advanceTable: VendorContractCityTiersCityMappingModel) 
  {
    advanceTable.vendorContractCityTiersCityMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }


  update(advanceTable: VendorContractCityTiersCityMappingModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }


  delete(vendorContractCityTiersCityMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorContractCityTiersCityMappingID + '/'+ userID);
  }


}
