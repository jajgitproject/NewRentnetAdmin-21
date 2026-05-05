// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ChangeDutyTypeClosingModel } from './changeDutyTypeClosing.model';

@Injectable()
export class ChangeDutyTypeClosingService 
{
  private API_URL:string = '';
  private API_URL_ForMOPEdit:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "changeDutyTypeClosing";

  }
  /** CRUD METHODS */
  GetVehiclePackageAndCityAvailable(contractID: number,packageType: string,packageID: number,vehicleID: number,pickupCityID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetVehiclePackageAndCityAvailable/' + contractID + '/' + packageType + '/' + packageID + '/' + vehicleID + '/' + pickupCityID);
  }

  update(advanceTable: ChangeDutyTypeClosingModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
}
  

