// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerAppBasedVehicleCategory } from './customerAppBasedVehicleCategory.model';
@Injectable()
export class CustomerAppBasedVehicleCategoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAppBasedVehicleCategory";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchVehicleCategory:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchVehicleCategory==="")
    {
      searchVehicleCategory="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchVehicleCategory + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerAppVehicleCategoryMappingID/Ascending');
  }
  getTableDataSort(customerID:number,searchVehicleCategory:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchVehicleCategory==="")
    {
      searchVehicleCategory="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchVehicleCategory + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerAppBasedVehicleCategory) 
  {
    advanceTable.customerAppVehicleCategoryMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAppBasedVehicleCategory)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerAppVehicleCategoryMappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerAppVehicleCategoryMappingID+ '/'+ userID);
  }
}
