// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonDrivingLicense } from './customerPersonDrivingLicense.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonDrivingLicenseService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonDrivingLicense";
  }
  /** CRUD METHODS */
  getTableData(customerPerson_ID:number,SearchAddressCity:string,SearchIssuingCity:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
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
    return this.httpClient.get(this.API_URL + '/' + customerPerson_ID +'/'+ SearchAddressCity +'/'+ SearchIssuingCity +'/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonDrivingLicenseID/Ascending');
  }
  getTableDataSort(customerPerson_ID:number,SearchAddressCity:string,SearchIssuingCity:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
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
    return this.httpClient.get(this.API_URL+ '/'+ customerPerson_ID +'/'+ SearchAddressCity +'/'+ SearchIssuingCity +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonDrivingLicense) 
  {
    advanceTable.customerPersonDrivingLicenseID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.uploadEditedDateString=this.generalService.getTimeApplicable(advanceTable.uploadEditedDate);
    advanceTable.uploadedByID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonDrivingLicense)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.uploadEditedDateString=this.generalService.getTimeApplicable(advanceTable.uploadEditedDate);
    advanceTable.uploadedByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonDrivingLicenseID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonDrivingLicenseID + '/'+ userID);
  }
}
