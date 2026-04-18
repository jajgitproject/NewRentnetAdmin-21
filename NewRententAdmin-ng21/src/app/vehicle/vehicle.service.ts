// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Vehicle } from './vehicle.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class VehicleService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vehicle";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchCategory:string,
    SearchManufacturer:string,
    SearchAcrissCode:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCategory==="")
    {
      SearchCategory="null";
    }
    if(SearchManufacturer==="")
    {
      SearchManufacturer="null";
    }
    if(SearchAcrissCode==="")
    {
      SearchAcrissCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchCategory+ "/" +SearchManufacturer+ "/" +SearchAcrissCode + '/' + SearchActivationStatus +'/' + PageNumber + '/vehicle/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchCategory:string,
    SearchManufacturer:string,
    SearchAcrissCode:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCategory==="")
    {
      SearchCategory="null";
    }
    if(SearchManufacturer==="")
    {
      SearchManufacturer="null";
    }
    if(SearchAcrissCode==="")
    {
      SearchAcrissCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchCategory+ "/" +SearchManufacturer+ "/" +SearchAcrissCode + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Vehicle) 
  {
    advanceTable.vehicleID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Vehicle)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(vehicleID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vehicleID + '/'+ userID);
  }
}
