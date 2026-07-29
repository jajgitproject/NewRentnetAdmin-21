// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  BulkEInvoiceLimits,
  BulkEInvoicePreviewResult,
  BulkEInvoiceSearchCriteria,
  BulkUploadJobStatus,
  StartBulkEInvoiceJobResult,
} from './bulkEInvoice.model';

@Injectable()
export class BulkEInvoiceService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'documentManagement';
  }

  getLimits(): Observable<BulkEInvoiceLimits> {
    return this.httpClient.get<BulkEInvoiceLimits>(`${this.API_URL}/bulk-einvoice/limits`);
  }

  preview(criteria: BulkEInvoiceSearchCriteria): Observable<BulkEInvoicePreviewResult> {
    return this.httpClient.post<BulkEInvoicePreviewResult>(
      `${this.API_URL}/bulk-einvoice/preview`,
      criteria || {}
    );
  }

  startJob(criteria: BulkEInvoiceSearchCriteria, performedBy: number): Observable<StartBulkEInvoiceJobResult> {
    return this.httpClient.post<StartBulkEInvoiceJobResult>(
      `${this.API_URL}/bulk-einvoice/start/${performedBy}`,
      criteria || {}
    );
  }

  cancelJob(jobId: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/bulk-einvoice/cancel/${jobId}`, {});
  }

  getJob(jobId: number): Observable<BulkUploadJobStatus> {
    return this.httpClient.get<BulkUploadJobStatus>(`${this.API_URL}/job/${jobId}`);
  }

  getJobErrors(jobId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/job/${jobId}/errors`);
  }
}
