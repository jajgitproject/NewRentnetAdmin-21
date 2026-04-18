// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resolution } from './resolution.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ResolutionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "incidenceEdit";
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
  getTableDataSort(SearchResolution:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchResolution==="")
    {
      SearchResolution="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchResolution + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchResolution + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  update(advanceTable: Resolution)
  {
    advanceTable.reminderDateForFollowUpString=this.generalService.getTimeApplicable(advanceTable.reminderDateForFollowUp);
    advanceTable.closureDateString=this.generalService.getTimeApplicable(advanceTable.closureDate);
    advanceTable.closureTimeString=this.generalService.getTimeApplicableTO(advanceTable.closureTime);
     advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(resolutionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ resolutionID + '/'+ userID);
  }

}
  

