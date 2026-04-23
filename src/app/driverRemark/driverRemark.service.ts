// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverRemark } from './driverRemark.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverRemarkService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverRemark";
  }
  /** CRUD METHODS */
  getDriverRemarkDetails(DutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/GetDriverRemarkDetails/' + DutySlipID}`);
  }
  update(advanceTable: DriverRemark)
  {
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
}
  

