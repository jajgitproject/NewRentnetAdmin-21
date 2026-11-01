// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

export interface GlobalOtpConfiguration {
  bypassOTPForAll: boolean;
}

@Injectable()
export class GlobalOtpConfigurationService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'globalOtpConfiguration';
  }

  get(): Observable<GlobalOtpConfiguration> {
    return this.httpClient.get<GlobalOtpConfiguration>(this.API_URL);
  }

  update(performedBy: number, bypassOTPForAll: boolean): Observable<GlobalOtpConfiguration> {
    return this.httpClient.put<GlobalOtpConfiguration>(`${this.API_URL}/${performedBy}`, {
      bypassOTPForAll,
    });
  }
}
