// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { PasswordReset } from './PasswordReset.model';
import { ForgotPassword } from './ForgotPassword.model';

@Injectable()
export class PasswordResetService {
  private API_URL: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'auth/';
  }

  resetPassword(model: PasswordReset) {
    return this.httpClient.post<any>(this.API_URL + 'reset', model);
  }

  forgotPasswordOTP(model: ForgotPassword) {
    return this.httpClient.post<any>(this.API_URL + 'ForgotPasswordOTP' , model);
  }

  forgotPassword(model: ForgotPassword) {
    return this.httpClient.post<any>(this.API_URL + 'ForgotPassword', model);
  }

  unlockOTP(model: ForgotPassword) {
    return this.httpClient.post<any>(this.API_URL + 'UnlockAccountOTP' , model);
  }

  unlockAccount(model: ForgotPassword) {
    return this.httpClient.post<any>(this.API_URL + 'UnlockAccount', model);
  }
}

