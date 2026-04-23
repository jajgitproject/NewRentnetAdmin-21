// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverDrivingLicenseVerification } from './driverDrivingLicenseVerification.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverDrivingLicenseVerificationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverDrivingLicenseVerification";
  }
  /** CRUD METHODS */

  update(advanceTable: DriverDrivingLicenseVerification)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.verificationDateString=this.generalService.getTimeApplicable(advanceTable.verificationDate);
    advanceTable.verifiedByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
}
