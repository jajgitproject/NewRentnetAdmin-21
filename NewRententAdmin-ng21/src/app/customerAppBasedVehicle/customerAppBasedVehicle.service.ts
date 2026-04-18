// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerAppBasedVehicle } from './customerAppBasedVehicle.model';
@Injectable()
export class CustomerAppBasedVehicleService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAppBasedVehicle";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchVehicle:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchVehicle==="")
    {
      searchVehicle="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchVehicle + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerAppVehicleMappingID/Ascending');
  }
  getTableDataSort(customerID:number,searchVehicle:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchVehicle==="")
    {
      searchVehicle="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchVehicle + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerAppBasedVehicle) 
  {
    advanceTable.customerAppVehicleMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAppBasedVehicle)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerAppVehicleMappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerAppVehicleMappingID+ '/'+ userID);
  }
}
