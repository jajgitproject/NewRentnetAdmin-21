import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';
import { CallMaskGenderSetting } from './customerCallMasking.model';

@Injectable()
export class CustomerCallMaskingService {
  private apiBase: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'callMaskGenderSetting';
  }

  get(): Observable<CallMaskGenderSetting> {
    return this.httpClient.get<CallMaskGenderSetting>(this.apiBase);
  }

  save(setting: CallMaskGenderSetting): Observable<CallMaskGenderSetting> {
    return this.httpClient.put<CallMaskGenderSetting>(this.apiBase, setting);
  }
}
