// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonDrivingLicenseVerification } from './customerPersonDrivingLicenseVerification.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonDrivingLicenseVerificationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonDrivingLicenseVerification";

  }
  /** CRUD METHODS */
  getTableData( customerPerson_ID:number,SearchCustomerPersonDrivingLicenseVerification:string, SearchDocumentNumber:string,SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {

    if(SearchCustomerPersonDrivingLicenseVerification==="")
    {
      SearchCustomerPersonDrivingLicenseVerification="null";
    }
    if(SearchDocumentNumber==="")
    {
      SearchDocumentNumber="null";
    }
   
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDrivingLicenseVerification  + '/' + SearchDocumentNumber+'/' +  SearchActivationStatus +'/' + PageNumber + '/customerPersonDrivingLicenseVerificationID/Ascending');
  }

  getTableDataSort(customerPerson_ID:number,SearchCustomerPersonDrivingLicenseVerification:string, SearchDocumentNumber:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  { 
    if(SearchCustomerPersonDrivingLicenseVerification==="")
    {
      SearchCustomerPersonDrivingLicenseVerification="null";
    }
    if(SearchDocumentNumber==="")
    {
      SearchDocumentNumber="null";
    }
 
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDrivingLicenseVerification  + '/' + SearchDocumentNumber+'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerPersonDrivingLicenseVerification) 
  {
    advanceTable.customerPersonDrivingLicenseID=-1;
    advanceTable.userID=this.generalService.getUserID();
    //advanceTable.documentExpiryString=this.generalService.getTimeApplicable(advanceTable.documentExpiry);
  
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: CustomerPersonDrivingLicenseVerification)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.verificationDateString=this.generalService.getTimeApplicable(advanceTable.verificationDate);
    advanceTable.verifiedByID=this.generalService.getUserID();  
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
 
 
}
