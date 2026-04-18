// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContractCarCategoriesCarMapping } from './customerContractCarCategoriesCarMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContractCarCategoriesCarMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContractCarCategoriesCarMapping";
  }
  /** CRUD METHODS */
  getTableData( customerContractID:number,customerContractCarCategoryID:number,searchCustomerContractCarCategoriesCarMappingID:number,searchvehicle:string,searchcustomerVehicleName:string,searchcustomerVehicleCodeForIntegration:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchvehicle==="")
    {
      searchvehicle="null";
    }
    if(searchcustomerVehicleName==="")
    {
      searchcustomerVehicleName="null";
    }
    if(searchcustomerVehicleCodeForIntegration==="")
    {
      searchcustomerVehicleCodeForIntegration="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+customerContractID+ '/' +customerContractCarCategoryID + '/'+searchCustomerContractCarCategoriesCarMappingID + '/'+searchvehicle + '/'+searchcustomerVehicleName + '/'+searchcustomerVehicleCodeForIntegration + '/' + SearchActivationStatus +'/' + PageNumber + '/customerContractCarCategoriesCarMappingID/Ascending');
  }
  getTableDataSort(customerContractID:number,customerContractCarCategoryID:number,searchCustomerContractCarCategoriesCarMappingID:number,searchvehicle:string,searchcustomerVehicleName:string,searchcustomerVehicleCodeForIntegration:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchvehicle==="")
    {
      searchvehicle="null";
    }
    if(searchcustomerVehicleName==="")
    {
      searchcustomerVehicleName="null";
    }
    if(searchcustomerVehicleCodeForIntegration==="")
    {
      searchcustomerVehicleCodeForIntegration="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContractID+ '/' +customerContractCarCategoryID + '/'+searchCustomerContractCarCategoriesCarMappingID + '/'+searchvehicle + '/'+searchcustomerVehicleName + '/'+searchcustomerVehicleCodeForIntegration + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerContractCarCategoriesCarMapping) 
  {
    advanceTable.customerContractCarCategoriesCarMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContractCarCategoriesCarMapping)
  {
    console.log(this.API_URL , advanceTable)
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  
  }
  delete(customerContractCarCategoriesCarMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContractCarCategoriesCarMappingID + '/'+ userID);
  }
}
