// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VehicleCategory } from './vehicleCategory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class VehicleCategoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vehicleCategory";
  }
  /** CRUD METHODS */
  getTableData(SearchVehicleCategory:string, 
    SearchLevel:string,
    SearchPreviousCategory:string,
    SearchNextCategory:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchLevel==="")
    {
      SearchLevel="null";
    }
    if(SearchPreviousCategory==="")
    {
      SearchPreviousCategory="null";
    }
    if(SearchNextCategory==="")
    {
      SearchNextCategory="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchVehicleCategory+ "/" +SearchLevel+ "/" +SearchPreviousCategory+ "/" +SearchNextCategory + '/' + SearchActivationStatus +'/' + PageNumber + '/VehicleCategory/Ascending');
  }

  getTableDataSort(SearchVehicleCategory:string, 
    SearchLevel:string,
    SearchPreviousCategory:string,
    SearchNextCategory:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchLevel==="")
    {
      SearchLevel="null";
    }
    if(SearchPreviousCategory==="")
    {
      SearchPreviousCategory="null";
    }
    if(SearchNextCategory==="")
    {
      SearchNextCategory="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchVehicleCategory+ "/" +SearchLevel+ "/" +SearchPreviousCategory+ "/" +SearchNextCategory + '/' + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
    return this.httpClient.get(this.API_URL + "/" +SearchVehicleCategory+ "/" +SearchLevel+ "/" +SearchPreviousCategory+ "/" +SearchNextCategory + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: VehicleCategory) 
  {
    advanceTable.vehicleCategoryID=-1;
    advanceTable.createdByID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VehicleCategory)
  {
    advanceTable.createdByID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(vehicleCategoryID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vehicleCategoryID + '/'+ userID);
  }
}
