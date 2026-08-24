// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  BulkUploadJobStatus,
  DutySlipLobExportCriteria,
  DutySlipLobExportPreviewResult,
  StartDutySlipLobExportJobResult,
} from './dutySlipLobExport.model';

@Injectable()
export class DutySlipLobExportService {
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {}

  private get apiUrl(): string {
    return this.generalService.BaseURL + 'documentManagement';
  }

  previewDutySlipLobExport(criteria: DutySlipLobExportCriteria): Observable<DutySlipLobExportPreviewResult> {
    return this.httpClient.post<DutySlipLobExportPreviewResult>(
      `${this.apiUrl}/backfill/duty-slip-lob/preview`,
      criteria || {}
    );
  }

  startDutySlipLobExportJob(
    criteria: DutySlipLobExportCriteria,
    performedBy: number
  ): Observable<StartDutySlipLobExportJobResult> {
    return this.httpClient.post<StartDutySlipLobExportJobResult>(
      `${this.apiUrl}/backfill/duty-slip-lob/start/${performedBy}`,
      criteria || {}
    );
  }

  cancelDutySlipLobExportJob(jobId: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/backfill/duty-slip-lob/cancel/${jobId}`, {});
  }

  forceClearStuckDutySlipLobExport(): Observable<{
    status?: string;
    clearedCount?: number;
    ClearedCount?: number;
    message?: string;
    Message?: string;
  }> {
    return this.httpClient.post<{
      status?: string;
      clearedCount?: number;
      ClearedCount?: number;
      message?: string;
      Message?: string;
    }>(`${this.apiUrl}/backfill/duty-slip-lob/force-clear-stuck`, {});
  }

  getJob(jobId: number): Observable<BulkUploadJobStatus> {
    return this.httpClient.get<BulkUploadJobStatus>(`${this.apiUrl}/job/${jobId}`);
  }

  getJobErrors(jobId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/job/${jobId}/errors`);
  }
}
