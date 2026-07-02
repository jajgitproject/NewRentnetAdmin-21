// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';
import {
  ApplicationAuditPageSettingRow,
  ApplicationAuditPageSettingUpdate
} from './applicationAuditSettings.model';

@Injectable()
export class ApplicationAuditSettingsService {
  private apiBase: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'applicationAudit';
  }

  getPageSettings(): Observable<ApplicationAuditPageSettingRow[]> {
    return this.httpClient.get<ApplicationAuditPageSettingRow[]>(
      this.apiBase + '/settings/pages'
    );
  }

  savePageSettings(
    performedBy: number,
    pages: ApplicationAuditPageSettingUpdate[]
  ): Observable<ApplicationAuditPageSettingRow[]> {
    return this.httpClient.put<ApplicationAuditPageSettingRow[]>(
      this.apiBase + '/settings/pages/' + performedBy,
      { pages }
    );
  }
}
