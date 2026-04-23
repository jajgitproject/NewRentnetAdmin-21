// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Incidence } from './incidence.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class IncidenceService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "incidence";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(ReservationID===0)
      {
        ReservationID=0;
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/IncidenceID/Dscending');
  }
  getTableDataSort(SearchIncidence:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchIncidence==="")
    {
      SearchIncidence="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchIncidence + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: Incidence) 
  {
    advanceTable.incidenceID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.incidenceDateString=this.generalService.getTimeApplicable(advanceTable.incidenceDate);
    advanceTable.incidenceTimeString=this.generalService.getTimeApplicableTO(advanceTable.incidenceTime);
    advanceTable.reportingDateString=this.generalService.getTimeTo(advanceTable.reportingDate);
    advanceTable.reportingTimeString=this.generalService.getTimeApplicable(advanceTable.reportingTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Incidence)
  {
   advanceTable.userID=this.generalService.getUserID();
   advanceTable.incidenceDateString=this.generalService.getTimeApplicable(advanceTable.incidenceDate);
   advanceTable.incidenceTimeString=this.generalService.getTimeApplicableTO(advanceTable.incidenceTime);
   advanceTable.reportingDateString=this.generalService.getTimeTo(advanceTable.reportingDate);
   advanceTable.reportingTimeString=this.generalService.getTimeApplicable(advanceTable.reportingTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(incidenceID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ incidenceID + '/'+ userID);
  }
  getIncidenceType(departmentID:any): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + "incidenceType/GetIncidenceTypeByDepartmentID/"+ departmentID);
  }
  getIssueCategory(incidenceTypeID:any): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + "issueCategory/GetIssueCategoryByIncidenceTypeID/" + incidenceTypeID);
  }
}
  

