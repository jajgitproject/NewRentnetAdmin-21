// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryTarget } from './inventoryTarget.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InventoryTargetService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventoryTarget";
  }
  /** CRUD METHODS */
  getTableData(
    inventoryID:number,SearchmonthlyTarget:string, 
    SearchdailyTarget:string,
    SearchStartDate:string,
    SearchEndDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(inventoryID===undefined)
    {
      inventoryID=null;
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
    return this.httpClient.get(this.API_URL + "/"+inventoryID+ '/'+SearchmonthlyTarget+ '/' +SearchdailyTarget+ '/'+SearchStartDate+ "/" +SearchEndDate + '/'  + SearchActivationStatus +'/' + PageNumber + '/InventoryTargetID/Ascending');
  }

  getTableDataSort(
    inventoryID:number,SearchmonthlyTarget:string, 
    SearchdailyTarget:string,
    SearchStartDate:string,
    SearchEndDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(inventoryID===undefined)
    {
      inventoryID=null;
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
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" +inventoryID+ '/'+SearchmonthlyTarget+ "/" +SearchdailyTarget+ '/'+SearchStartDate+ "/" +SearchEndDate + '/'  + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InventoryTarget) 
  {
    advanceTable.inventoryTargetID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InventoryTarget)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(inventoryTargetID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ inventoryTargetID + '/' + userID);
  }
}
