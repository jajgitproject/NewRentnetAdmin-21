// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonDocumentVerification } from './customerPersonDocumentVerification.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonDocumentVerificationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonDocumentVerification";

  }
  /** CRUD METHODS */
  getTableData( customerPerson_ID:number,SearchCustomerPersonDocumentVerification:string, SearchDocumentNumber:string,SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {

    if(SearchCustomerPersonDocumentVerification==="")
    {
      SearchCustomerPersonDocumentVerification="null";
    }
    if(SearchDocumentNumber==="")
    {
      SearchDocumentNumber="null";
    }
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    console.log(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDocumentVerification  + '/' + SearchDocumentNumber+'/' +  SearchActivationStatus +'/' + PageNumber + '/customerPersonDocumentVerificationVerificationID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDocumentVerification  + '/' + SearchDocumentNumber+'/' +  SearchActivationStatus +'/' + PageNumber + '/customerPersonDocumentVerificationVerificationID/Ascending');
  }

  getTableDataSort(customerPerson_ID:number,SearchCustomerPersonDocumentVerification:string, SearchDocumentNumber:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  { 
    if(SearchCustomerPersonDocumentVerification==="")
    {
      SearchCustomerPersonDocumentVerification="null";
    }
    if(SearchDocumentNumber==="")
    {
      SearchDocumentNumber="null";
    }
 
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    //console.log(this.API_URL + "/kkk" +SearchCustomerPersonDocumentVerification + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+customerPerson_ID +'/'+SearchCustomerPersonDocumentVerification  + '/' + SearchDocumentNumber+'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  update(advanceTable: CustomerPersonDocumentVerification)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.documentVerifiedDateString=this.generalService.getTimeApplicable(advanceTable.documentVerifiedDate);
    advanceTable.documentVerifiedByID=this.generalService.getUserID(); 
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonDocumentVerificationVerificationid: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonDocumentVerificationVerificationid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
