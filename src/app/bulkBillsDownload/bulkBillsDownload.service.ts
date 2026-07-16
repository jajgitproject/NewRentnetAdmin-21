// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  BulkDownloadSearchCriteria,
  BulkDownloadInvoiceSummary,
  BulkUploadJobStatus,
  StartBulkDownloadJobRequest,
  StartBulkDownloadJobResult,
  StartBulkUploadJobResult,
  IrnBackfillSearchCriteria,
  IrnBackfillPreviewResult,
  StartIrnBackfillJobResult,
  ClosingDutySlipBackfillCriteria,
  ClosingDutySlipBackfillPreviewResult,
  StartClosingDutySlipBackfillJobResult,
  DutySlipDocumentBackfillCriteria,
  DutySlipDocumentBackfillPreviewResult,
  StartDutySlipDocumentBackfillJobResult,
  DutySlipPackageDownloadCriteria,
  DutySlipPackageDownloadPreviewResult,
  StartDutySlipPackageDownloadJobResult,
  CreditNoteSearchCriteria,
  CreditNoteSummary,
  StartCreditNoteDownloadJobRequest,
} from './bulkBillsDownload.model';

@Injectable()
export class BulkBillsDownloadService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'documentManagement';
  }

  searchInvoices(criteria: BulkDownloadSearchCriteria): Observable<BulkDownloadInvoiceSummary[]> {
    return this.httpClient.post<BulkDownloadInvoiceSummary[]>(
      `${this.API_URL}/download/search`,
      criteria || {}
    );
  }

  previewIrnBackfill(criteria: IrnBackfillSearchCriteria): Observable<IrnBackfillPreviewResult> {
    return this.httpClient.post<IrnBackfillPreviewResult>(
      `${this.API_URL}/backfill/irn-archive/preview`,
      criteria || {}
    );
  }

  startIrnBackfillJob(criteria: IrnBackfillSearchCriteria, performedBy: number): Observable<StartIrnBackfillJobResult> {
    return this.httpClient.post<StartIrnBackfillJobResult>(
      `${this.API_URL}/backfill/irn-archive/${performedBy}`,
      criteria || {}
    );
  }

  cancelIrnBackfillJob(jobId: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/backfill/irn-archive/cancel/${jobId}`, {});
  }

  previewClosingDutySlipBackfill(criteria: ClosingDutySlipBackfillCriteria): Observable<ClosingDutySlipBackfillPreviewResult> {
    return this.httpClient.post<ClosingDutySlipBackfillPreviewResult>(
      `${this.API_URL}/backfill/closing-duty-slip/preview`,
      criteria || {}
    );
  }

  startClosingDutySlipBackfillJob(
    criteria: ClosingDutySlipBackfillCriteria,
    performedBy: number
  ): Observable<StartClosingDutySlipBackfillJobResult> {
    return this.httpClient.post<StartClosingDutySlipBackfillJobResult>(
      `${this.API_URL}/backfill/closing-duty-slip/${performedBy}`,
      criteria || {}
    );
  }

  cancelClosingDutySlipBackfillJob(jobId: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/backfill/closing-duty-slip/cancel/${jobId}`, {});
  }

  forceClearStuckClosingDutySlipBackfill(): Observable<{ status?: string; clearedCount?: number; ClearedCount?: number; message?: string; Message?: string }> {
    return this.httpClient.post<{ status?: string; clearedCount?: number; ClearedCount?: number; message?: string; Message?: string }>(
      `${this.API_URL}/backfill/closing-duty-slip/force-clear-stuck`,
      {}
    );
  }

  previewVerifiedDutySlipBackfill(criteria: DutySlipDocumentBackfillCriteria): Observable<DutySlipDocumentBackfillPreviewResult> {
    return this.httpClient.post<DutySlipDocumentBackfillPreviewResult>(
      `${this.API_URL}/backfill/verified-duty-slip/preview`,
      criteria || {}
    );
  }

  startVerifiedDutySlipBackfillJob(
    criteria: DutySlipDocumentBackfillCriteria,
    performedBy: number
  ): Observable<StartDutySlipDocumentBackfillJobResult> {
    return this.httpClient.post<StartDutySlipDocumentBackfillJobResult>(
      `${this.API_URL}/backfill/verified-duty-slip/${performedBy}`,
      criteria || {}
    );
  }

  cancelVerifiedDutySlipBackfillJob(jobId: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/backfill/verified-duty-slip/cancel/${jobId}`, {});
  }

  forceClearStuckVerifiedDutySlipBackfill(): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/backfill/verified-duty-slip/force-clear-stuck`, {});
  }

  previewTollInterstateBackfill(criteria: DutySlipDocumentBackfillCriteria): Observable<DutySlipDocumentBackfillPreviewResult> {
    return this.httpClient.post<DutySlipDocumentBackfillPreviewResult>(
      `${this.API_URL}/backfill/toll-interstate/preview`,
      criteria || {}
    );
  }

  startTollInterstateBackfillJob(
    criteria: DutySlipDocumentBackfillCriteria,
    performedBy: number
  ): Observable<StartDutySlipDocumentBackfillJobResult> {
    return this.httpClient.post<StartDutySlipDocumentBackfillJobResult>(
      `${this.API_URL}/backfill/toll-interstate/${performedBy}`,
      criteria || {}
    );
  }

  cancelTollInterstateBackfillJob(jobId: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/backfill/toll-interstate/cancel/${jobId}`, {});
  }

  forceClearStuckTollInterstateBackfill(): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/backfill/toll-interstate/force-clear-stuck`, {});
  }

  previewDutySlipPackageDownload(
    criteria: DutySlipPackageDownloadCriteria,
    performedBy: number
  ): Observable<DutySlipPackageDownloadPreviewResult> {
    return this.httpClient.post<DutySlipPackageDownloadPreviewResult>(
      `${this.API_URL}/download/duty-slip-package/preview/${performedBy}`,
      criteria || {}
    );
  }

  startDutySlipPackageDownloadJob(
    criteria: DutySlipPackageDownloadCriteria,
    performedBy: number
  ): Observable<StartDutySlipPackageDownloadJobResult> {
    return this.httpClient.post<StartDutySlipPackageDownloadJobResult>(
      `${this.API_URL}/download/duty-slip-package/start/${performedBy}`,
      criteria || {}
    );
  }

  getInvoiceDuties(invoiceId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/invoice/${invoiceId}/duties`);
  }

  getInvoiceArchiveStatus(invoiceId: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/invoice/${invoiceId}/archive-status`);
  }

  getExistingInvoiceDocuments(invoiceId: number): Observable<any> {
    return this.httpClient.get(`${this.API_URL}/invoice/${invoiceId}/existing-documents`);
  }

  generateInvoicePdf(invoiceId: number, performedBy: number): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/invoice/${invoiceId}/generate-pdf/${performedBy}`, {});
  }

  generateInvoicePdfFromViewBillHtml(
    invoiceId: number,
    performedBy: number,
    html: string,
    baseUrl: string
  ): Observable<any> {
    return this.httpClient.post(
      `${this.API_URL}/invoice/${invoiceId}/generate-pdf-from-view-bill-html/${performedBy}`,
      { html, baseUrl }
    );
  }

  generateDutySlipPdf(dutySlipId: number, performedBy: number, invoiceId?: number | null): Observable<any> {
    const invoiceQuery = invoiceId ? `?invoiceId=${invoiceId}` : '';
    return this.httpClient.post(`${this.API_URL}/duty-slip/${dutySlipId}/generate-pdf/${performedBy}${invoiceQuery}`, {});
  }

  generateTollParkingPdfs(dutySlipId: number, performedBy: number, replaceExisting = true): Observable<any[]> {
    return this.httpClient.post<any[]>(
      `${this.API_URL}/duty-slip/${dutySlipId}/toll-parking/generate-pdf/${performedBy}?replaceExisting=${replaceExisting}`,
      {}
    );
  }

  generateInterstateTaxPdfs(dutySlipId: number, performedBy: number, replaceExisting = true): Observable<any[]> {
    return this.httpClient.post<any[]>(
      `${this.API_URL}/duty-slip/${dutySlipId}/interstate-tax/generate-pdf/${performedBy}?replaceExisting=${replaceExisting}`,
      {}
    );
  }

  startDownloadJob(request: StartBulkDownloadJobRequest, performedBy: number): Observable<StartBulkDownloadJobResult> {
    return this.httpClient.post<StartBulkDownloadJobResult>(
      `${this.API_URL}/download/start/${performedBy}`,
      request
    );
  }

  searchCreditNotes(criteria: CreditNoteSearchCriteria): Observable<CreditNoteSummary[]> {
    return this.httpClient.post<CreditNoteSummary[]>(
      `${this.API_URL}/download/credit-note/search`,
      criteria || {}
    );
  }

  startCreditNoteDownloadJob(request: StartCreditNoteDownloadJobRequest, performedBy: number): Observable<StartBulkDownloadJobResult> {
    return this.httpClient.post<StartBulkDownloadJobResult>(
      `${this.API_URL}/download/credit-note/start/${performedBy}`,
      request
    );
  }

  getJob(jobId: number): Observable<BulkUploadJobStatus> {
    return this.httpClient.get<BulkUploadJobStatus>(`${this.API_URL}/job/${jobId}`);
  }

  getJobErrors(jobId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/job/${jobId}/errors`);
  }

  downloadZip(jobId: number): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/download/job/${jobId}/file`, {
      responseType: 'blob',
    });
  }

  exportErrorsCsv(jobId: number): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/job/${jobId}/errors/export`, {
      responseType: 'blob',
    });
  }

  uploadReservationEmailBulk(files: File[], performedBy: number, replacePolicy: string): Observable<StartBulkUploadJobResult> {
    return this.uploadBulk(`${this.API_URL}/upload/reservation-email/bulk/${performedBy}`, files, replacePolicy);
  }

  uploadDutySlipBulk(files: File[], performedBy: number, replacePolicy: string): Observable<StartBulkUploadJobResult> {
    return this.uploadBulk(`${this.API_URL}/upload/duty-slip/bulk/${performedBy}`, files, replacePolicy);
  }

  uploadReservationEmailSingle(
    file: File,
    performedBy: number,
    replacePolicy: string,
    reservationId?: number | null
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (replacePolicy) formData.append('replacePolicy', replacePolicy);
    if (reservationId) formData.append('reservationId', String(reservationId));
    return this.httpClient.post(`${this.API_URL}/upload/reservation-email/${performedBy}`, formData);
  }

  uploadDutySlipSingle(
    file: File,
    performedBy: number,
    replacePolicy: string,
    dutySlipId?: number | null,
    manualDutySlipNumber?: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (replacePolicy) formData.append('replacePolicy', replacePolicy);
    if (dutySlipId) formData.append('dutySlipId', String(dutySlipId));
    if (manualDutySlipNumber) formData.append('manualDutySlipNumber', manualDutySlipNumber);
    return this.httpClient.post(`${this.API_URL}/upload/duty-slip/${performedBy}`, formData);
  }

  private uploadBulk(url: string, files: File[], replacePolicy: string): Observable<StartBulkUploadJobResult> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file, file.name));
    if (replacePolicy) formData.append('replacePolicy', replacePolicy);
    return this.httpClient.post<StartBulkUploadJobResult>(url, formData);
  }
}
