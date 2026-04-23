// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { AppDutyMIS } from './appDutyMIS.model';
@Injectable()
export class AppDutyMISService 
{
  private API_URL:string = '';
  private VehicleInterStateTAX_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "appDutyMIS";
   
  }
  /** CRUD METHODS */
  getTableData(searchFromDate:string,searchToDate:string, DispatchLocation:string ,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchFromDate==="")
    {
      searchFromDate="null";
    }
    if(searchToDate==="")
      {
        searchToDate="null";
      }
      if(DispatchLocation==="")
        {
          DispatchLocation="null";
        }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchFromDate+ "/" +searchToDate+ "/" +DispatchLocation+ "/" + SearchActivationStatus +'/' + PageNumber + '/ReservationID/Descending');
  }
  getTableDataSort(searchFromDate:string,searchToDate:string, DispatchLocation:string ,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchFromDate==="")
    {
      searchFromDate="null";
    }
    if(searchToDate==="")
      {
        searchToDate="null";
      }
      if(DispatchLocation==="")
        {
          DispatchLocation="null";
        }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchFromDate+ "/" +searchToDate+ "/" +DispatchLocation+ "/" + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  // add(advanceTable: AppDutyMIS) 
  // {
  //   advanceTable.interstateTaxID=-1;
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: AppDutyMIS)
  // { 
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn); 
  //   return this.httpClient.put<any>(this.API_URL , advanceTable);
  // }
  // delete(interstateTaxID: number):  Observable<any> 
  // {
  //   let userID=this.generalService.getUserID();
  //   return this.httpClient.delete(this.API_URL + '/'+ interstateTaxID + '/' + userID);
  // }

}
  

