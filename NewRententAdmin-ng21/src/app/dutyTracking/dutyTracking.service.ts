// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyTrackingModel} from './dutyTracking.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyTrackingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyTracking";
  }
  /** CRUD METHODS */
  add(advanceTable: DutyTrackingModel) 
  {
    advanceTable.dutyTrackingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: DutyTrackingModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(dutyTrackingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyTrackingID + '/'+ userID);
  }
  
  getData(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetDutyTrackingByID/' + dutySlipID);
  }
}
  

