// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StopReservation } from './stopReservation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class StopReservationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "stopReservation";
  

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchStopReservation:string,SearchEmployeeName:string, SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchStopReservation==="")
    {
      SearchStopReservation="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchStopReservation + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/stopReservationID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchStopReservation:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchStopReservation==="")
    {
      SearchStopReservation="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchStopReservation  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: StopReservation) 
  {
     
    advanceTable.stopReservationID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: StopReservation)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(stopReservationid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ stopReservationid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
