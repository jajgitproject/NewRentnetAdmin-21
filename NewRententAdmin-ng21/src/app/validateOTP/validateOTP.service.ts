// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ValidateOTP } from './validateOTP.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ValidateOTPService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + 'auth/';
  }

  resendPassword(model: ValidateOTP) {
    return this.httpClient.post<any>(this.API_URL + 'send-otp', model);
  }
  /** CRUD METHODS */
  getTableData(SearchValidateOTP:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchValidateOTP==="")
    {
      SearchValidateOTP="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchValidateOTP + '/' + SearchActivationStatus +'/' + PageNumber + '/ValidateOTP/Ascending');
  }
  getTableDataSort(SearchValidateOTP:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchValidateOTP==="")
    {
      SearchValidateOTP="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchValidateOTP + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchValidateOTP + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ValidateOTP) 
  {
    // advanceTable.validateOTPID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ValidateOTP)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(validateOTPID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ validateOTPID);
  }

}
  

