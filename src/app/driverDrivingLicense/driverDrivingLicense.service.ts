// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverDrivingLicense } from './driverDrivingLicense.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverDrivingLicenseService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverDrivingLicense";
  }
  /** CRUD METHODS */
  getTableData(driver_ID:number,SearchAddressCity:string,SearchIssuingCity:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchAddressCity==="")
    {
      SearchAddressCity="null";
    }
    if(SearchIssuingCity==="")
    {
      SearchIssuingCity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' + driver_ID +'/'+ SearchAddressCity +'/'+ SearchIssuingCity +'/' + SearchActivationStatus +'/' + PageNumber + '/driverDrivingLicenseID/Ascending');
  }
  getTableDataSort(driver_ID:number,SearchAddressCity:string,SearchIssuingCity:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchAddressCity==="")
    {
      SearchAddressCity="null";
    }
    if(SearchIssuingCity==="")
    {
      SearchIssuingCity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL+ '/'+ driver_ID +'/'+ SearchAddressCity +'/'+ SearchIssuingCity +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: DriverDrivingLicense) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.driverDrivingLicenseID=-1;
    advanceTable.uploadEditedDateString=this.generalService.getTimeApplicable(advanceTable.uploadEditedDate);
    advanceTable.drivingLicenseExpiryDateString=this.generalService.getTimeApplicable(advanceTable.drivingLicenseExpiryDate);
    advanceTable.uploadedByID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DriverDrivingLicense)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.uploadEditedDateString=this.generalService.getTimeApplicable(advanceTable.uploadEditedDate);
    advanceTable.drivingLicenseExpiryDateString=this.generalService.getTimeApplicable(advanceTable.drivingLicenseExpiryDate);
    advanceTable.uploadedByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(driverDrivingLicenseID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverDrivingLicenseID + '/'+ userID);
  }
}
