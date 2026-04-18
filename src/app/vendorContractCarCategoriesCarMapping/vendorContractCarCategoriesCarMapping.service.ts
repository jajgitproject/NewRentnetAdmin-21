// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorContractCarCategoriesCarMappingModel } from './vendorContractCarCategoriesCarMapping.model';
@Injectable()
export class VendorContractCarCategoriesCarMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorContractCarCategoriesCarMapping";
  }
  /** CRUD METHODS */
  getTableData( vendorContractID:number,vendorContractCarCategoryID:number,searchVendorContractCarCategoriesCarMappingID:number,searchvehicle:string,searchvendorVehicleName:string,searchvendorVehicleCodeForIntegration:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchvehicle==="")
    {
      searchvehicle="null";
    }
    if(searchvendorVehicleName==="")
    {
      searchvendorVehicleName="null";
    }
    if(searchvendorVehicleCodeForIntegration==="")
    {
      searchvendorVehicleCodeForIntegration="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+vendorContractID+ '/' +vendorContractCarCategoryID + '/'+searchVendorContractCarCategoriesCarMappingID + '/'+searchvehicle + '/'+searchvendorVehicleName + '/'+searchvendorVehicleCodeForIntegration + '/' + SearchActivationStatus +'/' + PageNumber + '/vendorContractCarCategoriesCarMappingID/Ascending');
  }
  getTableDataSort(vendorContractID:number,vendorContractCarCategoryID:number,searchVendorContractCarCategoriesCarMappingID:number,searchvehicle:string,searchvendorVehicleName:string,searchvendorVehicleCodeForIntegration:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchvehicle==="")
    {
      searchvehicle="null";
    }
    if(searchvendorVehicleName==="")
    {
      searchvendorVehicleName="null";
    }
    if(searchvendorVehicleCodeForIntegration==="")
    {
      searchvendorVehicleCodeForIntegration="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vendorContractID+ '/' +vendorContractCarCategoryID + '/'+searchVendorContractCarCategoriesCarMappingID + '/'+searchvehicle + '/'+searchvendorVehicleName + '/'+searchvendorVehicleCodeForIntegration + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: VendorContractCarCategoriesCarMappingModel) 
  {
    advanceTable.vendorContractCarCategoriesCarMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VendorContractCarCategoriesCarMappingModel)
  {
    console.log(this.API_URL , advanceTable)
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  
  }
  delete(vendorContractCarCategoriesCarMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorContractCarCategoriesCarMappingID + '/'+ userID);
  }
}
