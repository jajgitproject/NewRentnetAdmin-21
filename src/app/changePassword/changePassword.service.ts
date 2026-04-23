// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangePasswordModel } from './changePassword.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ChangePasswordService 
{
  private API_URL:string = '';
  private API_URL_Employee:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "auth/";
    this.API_URL_Employee=generalService.BaseURL+ "employee/";
  }
  /** CRUD METHODS */

  resetPassword(model: ChangePasswordModel) 
  {
    model.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + "ResetPassword", model);
  }

}
  

