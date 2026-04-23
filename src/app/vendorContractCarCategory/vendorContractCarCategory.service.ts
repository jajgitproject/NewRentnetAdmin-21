// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorCategoryDropDownModel, VendorContractCarCategoryModel, VendorContractDropDownModel } from './vendorContractCarCategory.model';
@Injectable()
export class VendorContractCarCategoryService 
{
  private API_URL:string = '';
  private API_URL_VC:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorContractCarCategory";
    this.API_URL_VC=generalService.BaseURL+ "vendorContract";
  }
  /** CRUD METHODS */
  getTableData(vendorContractID:number,searchvendorContractCarCategory:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchvendorContractCarCategory==="")
    {
      searchvendorContractCarCategory="null";
    }   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
     return this.httpClient.get(this.API_URL + "/" +vendorContractID + '/'+searchvendorContractCarCategory + '/'+ SearchActivationStatus +'/' + PageNumber + '/vendorContractCarCategoryID/Ascending');
  }


  getTableDataSort(vendorContractID:number,searchvendorContractCarCategory:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchvendorContractCarCategory==="")
    {
      searchvendorContractCarCategory="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vendorContractID + '/'+searchvendorContractCarCategory + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }


  add(advanceTable: VendorContractCarCategoryModel) 
  {
    advanceTable.vendorContractCarCategoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VendorContractCarCategoryModel)
  {  advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }


  delete(vendorContractCarCategoryID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorContractCarCategoryID + '/'+ userID);
  }


  SaveVendorContractCarCategory(data: VendorContractCarCategoryModel[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/Import', data);
  }


  GetVehicleCategoryToImportFormContractCarCategory(VendorContractID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/'+ 'GetVehicleCategoryToImportFormContractCarCategory'+ '/'+ VendorContractID);
  }


  ImportFromVendorContract(data: VendorContractCarCategoryModel[]): Observable<any> {
    return this.httpClient.post(this.API_URL +'/ImportFromVendorContract', data);
  }


  GetVendorContract(): Observable<VendorContractDropDownModel[]> 
  {
    return this.httpClient.get<VendorContractDropDownModel[]>(this.API_URL_VC + '/DropDownForVendorContract');
  }

  
  getVendorCategory(): Observable<VendorCategoryDropDownModel[]>
  {
    return this.httpClient.get<VendorCategoryDropDownModel[]>(this.API_URL + "/GetVendorContractCarCategoryDropDown");
  }

}
