// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VehicleCategoryTarget } from './vehicleCategoryTarget.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class VehicleCategoryTargetService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vehicleCategoryTarget";
  }
  /** CRUD METHODS */
  getTableData(
    vehicleCategoryID:number,SearchvehicleCategory:string, SearchmonthlyTarget:string,
    SearchdailyTarget:string,
    SearchStartDate:string,
    SearchEndDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(vehicleCategoryID===undefined)
    {
      vehicleCategoryID=null;
    }
    if(SearchvehicleCategory==="")
      {
        SearchvehicleCategory="null";
      }
    if(SearchmonthlyTarget==="")
    {
      SearchmonthlyTarget="null";
    }
    if(SearchdailyTarget==="")
    {
      SearchdailyTarget="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+vehicleCategoryID+ '/'+SearchvehicleCategory+'/'+SearchmonthlyTarget+ '/' +SearchdailyTarget+ '/' +SearchStartDate+ "/" +SearchEndDate + '/'+ SearchActivationStatus +'/' + PageNumber + '/VehicleCategoryTargetID/Ascending');
  }

  getTableDataSort(
    vehicleCategoryID:number,SearchvehicleCategory:string, 
    SearchmonthlyTarget:string, 
    SearchdailyTarget:string,
    SearchStartDate:string,
    SearchEndDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(vehicleCategoryID===undefined)
    {
      vehicleCategoryID=null;
    }
    if(SearchvehicleCategory==="")
      {
        SearchvehicleCategory="null";
      }
    if(SearchmonthlyTarget==="")
    {
      SearchmonthlyTarget="null";
    }
    if(SearchdailyTarget==="")
    {
      SearchdailyTarget="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +vehicleCategoryID+'/'+SearchvehicleCategory+'/'+SearchmonthlyTarget+ "/" +SearchdailyTarget+ '/'+SearchStartDate+ "/" +SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: VehicleCategoryTarget) 
  {
    advanceTable.vehicleCategoryTargetID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  
  update(advanceTable: VehicleCategoryTarget)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(vehicleCategoryTargetID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vehicleCategoryTargetID + '/'+ userID);
  }
}
