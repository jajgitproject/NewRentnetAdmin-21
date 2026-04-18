// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VendorContractCityTiersModel } from './vendorContractCityTiers.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class VendorContractCityTiersService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorContractCityTiers";
  }
  /** CRUD METHODS */
  getTableData(vendorContractID:number,searchVendorContractCityTier:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchVendorContractCityTier==="")
    {
      searchVendorContractCityTier="null";
    }
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vendorContractID + '/'+searchVendorContractCityTier + '/'+ SearchActivationStatus +'/' + PageNumber + '/VendorContractCityTiersID/Ascending');
  }


  getTableDataSort(vendorContractID:number,searchVendorContractCityTier:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchVendorContractCityTier==="")
    {
      searchVendorContractCityTier="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vendorContractID + '/'+searchVendorContractCityTier + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }


  add(advanceTable: VendorContractCityTiersModel) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.vendorContractCityTiersID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }


  update(advanceTable: VendorContractCityTiersModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }


  delete(vendorContractCityTiersID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorContractCityTiersID + '/'+ userID);
  }

  
  SaveVendorContractCityTiers(data: VendorContractCityTiersModel[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/Import', data);
  }


  GetToImportFormContractCityTiers(VendorContractID: number): Observable<any> {
      return this.httpClient.get(this.API_URL + '/'+ 'GetCityTierFromVendorContract'+ '/'+ VendorContractID);
    }
    
  ImportFromVendorContract(data: VendorContractCityTiersModel[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/ImportFromVendorContractCityTiers', data);
  }

}
