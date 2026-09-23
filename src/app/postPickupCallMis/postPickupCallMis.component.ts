// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { PostPickupCallMis, PostPickupCallMisSearchCriteria } from './postPickupCallMis.model';
import { PostPickupCallMisService } from './postPickupCallMis.service';
import {
  extractExportErrorMessage,
  exportJobAcceptedSnackbarMessage,
  exportSearchButtonLabel,
  formatExportElapsedTime,
  IN_FLIGHT_EXPORT_MESSAGE,
  isExportJobCancelled,
  isExportJobNotFoundError,
  loadPersistedExportJobId,
  markExportDumpStarted,
  persistExportJobId
} from '../general/export-job.helper';
import { StoredMisExportsComponent } from '../general/stored-mis-exports.component';

@Component({
  standalone: false,
  selector: 'app-postPickupCallMis',
  templateUrl: './postPickupCallMis.component.html',
  styleUrls: ['./postPickupCallMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class PostPickupCallMisComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'postPickupCallMis';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;

  displayedColumns = [
    'bookingNo',
    'serviceLocation',
    'pickUpDate',
    'guestName',
    'customerName',
    'gender',
    'postPickupCallStatus',
    'postPickupCallCheckedBy',
    'postPickupCheckDatetime',
    'postPickupRemarks'
  ];

  columnTitleMap = {
    bookingNo: 'Booking No',
    serviceLocation: 'Service Location',
    pickUpDate: 'Pick up Date',
    guestName: 'Guest Name',
    customerName: 'Customer Name',
    gender: 'Gender',
    postPickupCallStatus: 'Post Pickup Call Status',
    postPickupCallCheckedBy: 'Post Pickup Call Checked By',
    postPickupCheckDatetime: 'Post Pickup Check Datetime',
    postPickupRemarks: 'Post Pickup Remarks'
  };

  dataSource: PostPickupCallMis[] = [];
  PageNumber = 0;
  hasManualSearch = false;

  searchPickupDateFrom: any = '';
  searchPickupDateTo: any = '';
  searchPostPickupCallFilter = 'All';

  constructor(
    private postPickupCallMisService: PostPickupCallMisService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy(): void {
    this.stopExportPolling();
  }

  SearchData(): void {
    this.PageNumber = 0;
    this.hasManualSearch = true;
    this.loadData();
  }

  refresh(): void {
    this.clearExportJob();
    this.searchPickupDateFrom = '';
    this.searchPickupDateTo = '';
    this.searchPostPickupCallFilter = 'All';
    this.PageNumber = 0;
    this.hasManualSearch = false;
    this.dataSource = [];
  }

  loadData(): void {
    const criteria = this.buildSearchCriteria();
    this.postPickupCallMisService.getTableData(criteria, this.PageNumber).subscribe(
      (data) => {
        const rows = Array.isArray(data) ? data : (data?.$values || data?.data || []);
        this.dataSource = (rows || []).map((row) => this.normalizeRow(row));
      },
      (error: HttpErrorResponse | string) => {
        this.dataSource = [];
        const message = typeof error === 'string'
          ? error
          : (error?.error || error?.message || 'Post Pickup Call MIS search failed');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  startExportJob(): void {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    if (!this.hasManualSearch) {
      this.showNotification('snackbar-danger', 'Run search first', 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    const criteria = this.buildSearchCriteria();
    this.exportJobRunning = true;

    this.postPickupCallMisService.startExportJob(criteria).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.exportJobRunning = false;
          this.exportJobError = 'Could not start export job.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          return;
        }

        this.exportJobId = jobId;
        persistExportJobId(this.exportJobPageKey, jobId);
        this.exportJobStatus = {
          jobId,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
        this.startExportPolling(jobId);
        this.showNotification('snackbar-info', exportJobAcceptedSnackbarMessage(startResult), 'bottom', 'center');
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Could not start export');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv(): void {
    if (!this.exportJobId || !this.postPickupCallMisService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.postPickupCallMisService.downloadExportJob(this.exportJobId).subscribe(
      async (blob: Blob) => {
        this.exportJobDownloading = false;

        if (!blob || blob.size === 0) {
          this.showNotification('snackbar-danger', 'Export file is empty or unavailable.', 'bottom', 'center');
          return;
        }

        const contentType = (blob.type || '').toLowerCase();
        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          const text = await blob.text();
          let message = 'Export file is not ready.';
          try {
            const parsed = JSON.parse(text || '{}');
            message = parsed.message || message;
          } catch {
            if (text && text.trim()) {
              message = text;
            }
          }
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerCsvDownload(blob, fileName);
      },
      async (error) => {
        this.exportJobDownloading = false;
        const message = await extractExportErrorMessage(error, 'Export download failed.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  cancelExportJob(): void {
    if (!this.exportJobId || !this.isExportJobInProgress()) {
      return;
    }

    this.postPickupCallMisService.cancelExportJob(this.exportJobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobRunning = false;
        this.stopExportPolling();
        this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
      },
      async (error) => {
        const message = await extractExportErrorMessage(error, 'Could not cancel export.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return (
      !!this.exportJobId &&
      this.postPickupCallMisService.isExportJobReady(this.exportJobStatus) &&
      !this.exportJobDownloading
    );
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.postPickupCallMisService.isExportJobRunning(this.exportJobStatus);
  }

  getExportJobStatusLabel(): string {
    return this.exportJobStatus?.status ?? this.exportJobStatus?.Status ?? '';
  }

  getExportJobMessage(): string {
    return this.exportJobStatus?.message ?? this.exportJobStatus?.Message ?? this.exportJobError ?? '';
  }

  getExportRowsExported(): number {
    return this.exportJobStatus?.rowsExported ?? this.exportJobStatus?.RowsExported ?? 0;
  }

  getExportElapsedTime(): string {
    return formatExportElapsedTime(this.exportJobStartedAt, this.exportJobStatus);
  }

  getExportButtonLabel(): string {
    const label = exportSearchButtonLabel(this.exportJobStatus, this.isExportJobInProgress());
    return label === 'Search' ? 'Export CSV' : label;
  }

  private normalizeRow(row: any) {
    if (!row) {
      return row;
    }
    return {
      bookingNo: row.bookingNo ?? row.BookingNo,
      serviceLocation: row.serviceLocation ?? row.ServiceLocation,
      pickUpDate: row.pickUpDate ?? row.PickUpDate,
      guestName: row.guestName ?? row.GuestName,
      customerName: row.customerName ?? row.CustomerName,
      gender: row.gender ?? row.Gender,
      postPickupCallStatus: row.postPickupCallStatus ?? row.PostPickupCallStatus,
      postPickupCallCheckedBy: row.postPickupCallCheckedBy ?? row.PostPickupCallCheckedBy,
      postPickupCheckDatetime: row.postPickupCheckDatetime ?? row.PostPickupCheckDatetime,
      postPickupRemarks: row.postPickupRemarks ?? row.PostPickupRemarks
    };
  }

  NextCall(): void {
    if (this.dataSource?.length > 0) {
      this.PageNumber++;
      this.loadData();
    }
  }

  PreviousCall(): void {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  private buildSearchCriteria(): PostPickupCallMisSearchCriteria {
    return {
      pickupDateFrom: this.searchPickupDateFrom ? moment(this.searchPickupDateFrom).format('MMM DD yyyy') : '',
      pickupDateTo: this.searchPickupDateTo ? moment(this.searchPickupDateTo).format('MMM DD yyyy') : '',
      postPickupCallFilter: this.searchPostPickupCallFilter || 'All'
    };
  }

  private startExportPolling(jobId: string): void {
    this.stopExportPolling();
    this.exportPollSub = this.postPickupCallMisService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, status);
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (isExportJobCancelled(status)) {
          this.exportJobRunning = false;
          this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (current === 'completed') {
          this.exportJobRunning = false;
          const rows = status?.rowsExported ?? status?.RowsExported ?? 0;
          this.showNotification(
            'snackbar-success',
            status?.message ?? `Export ready (${rows} rows). Click Download CSV.`,
            'bottom',
            'center'
          );
          this.stopExportPolling();
          this.storedExports?.refresh();
        }
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Export failed.');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
        this.stopExportPolling();
      }
    );
  }

  private stopExportPolling(): void {
    if (this.exportPollSub) {
      this.exportPollSub.unsubscribe();
      this.exportPollSub = undefined;
    }
  }

  private resumeExportJobIfNeeded(): void {
    const jobId = loadPersistedExportJobId(this.exportJobPageKey);
    if (!jobId) {
      return;
    }

    this.exportJobId = jobId;
    if (!this.exportJobStatus) {
      this.exportJobStatus = { status: 'Pending', message: 'Checking export status...' };
    }

    this.postPickupCallMisService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.postPickupCallMisService.isExportJobRunning(status)) {
          this.exportJobRunning = true;
          this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobRunning = false;
      },
      (error) => {
        if (isExportJobNotFoundError(error)) {
          persistExportJobId(this.exportJobPageKey, null);
          this.exportJobId = null;
          this.exportJobStatus = null;
          this.exportJobRunning = false;
          return;
        }

        this.exportJobRunning = true;
        this.startExportPolling(jobId);
      }
    );
  }

  private clearExportJob(): void {
    this.stopExportPolling();
    this.exportJobId = null;
    this.exportJobStatus = null;
    this.exportJobRunning = false;
    this.exportJobDownloading = false;
    this.exportJobError = '';
    this.exportJobStartedAt = null;
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `postPickupCallMis_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }

  private showNotification(colorName: string, text: string, placementFrom: any, placementAlign: any): void {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
