// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import moment from 'moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { QcMisCST, QcMisCSTSearchCriteria } from './qcMisCst.model';
import { QcMisCSTService } from './qcMisCst.service';
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
  selector: 'app-qcMisCst',
  templateUrl: './qcMisCst.component.html',
  styleUrls: ['./qcMisCst.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class QcMisCSTComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'qcMisCst';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;

  displayedColumns = [
    'reservationID',
    'pickupDate',
    'serviceLocation',
    'qcVerificationResult',
    'qcVerificationRemarks',
    'qcVerifiedByAgent'
  ];

  columnTitleMap = {
    reservationID: 'Booking No',
    pickupDate: 'Pick up Date',
    serviceLocation: 'Service Location',
    qcVerificationResult: 'QC Verification Result',
    qcVerificationRemarks: 'QC Verification Remarks',
    qcVerifiedByAgent: 'QC Verified By Agent'
  };

  dataSource: QcMisCST[] = [];
  PageNumber = 0;
  hasManualSearch = false;

  searchPickupDateFrom: any = '';
  searchPickupDateTo: any = '';
  searchLocationID = 0;
  searchCity = new FormControl('');

  locations: OrganizationalEntityDropDown[] = [];
  cityOptions: CityDropDown[] = [];

  constructor(
    private qcMisCSTService: QcMisCSTService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generalService.GetLocation().subscribe((data) => (this.locations = data || []));
    this.searchCity.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value && typeof value === 'object') {
          return of(this.cityOptions);
        }
        const term = (value || '').toString().trim();
        if (term.length < (this.generalService.lengthToCheck || 3)) {
          this.cityOptions = [];
          return of([]);
        }
        return this.generalService.GetCityDropDownForControlPanel(term);
      })
    ).subscribe((list) => (this.cityOptions = list || []));
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy(): void {
    this.stopExportPolling();
  }

  displayCity(option: any): string {
    return option && typeof option === 'object' ? option.geoPointName : option || '';
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
    this.searchLocationID = 0;
    this.searchCity.setValue('');
    this.cityOptions = [];
    this.PageNumber = 0;
    this.hasManualSearch = false;
    this.dataSource = [];
  }

  loadData(): void {
    const criteria = this.buildSearchCriteria();
    this.qcMisCSTService.getTableData(criteria, this.PageNumber).subscribe(
      (data) => {
        const rows = Array.isArray(data) ? data : (data?.$values || data?.data || []);
        this.dataSource = (rows || []).map((row) => this.normalizeRow(row));
      },
      (error: HttpErrorResponse) => {
        this.dataSource = [];
        this.showNotification('snackbar-danger', error?.message || 'QC MIS (CST) search failed', 'bottom', 'center');
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

    this.qcMisCSTService.startExportJob(criteria).subscribe(
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
    if (!this.exportJobId || !this.qcMisCSTService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.qcMisCSTService.downloadExportJob(this.exportJobId).subscribe(
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

    this.qcMisCSTService.cancelExportJob(this.exportJobId).subscribe(
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
      this.qcMisCSTService.isExportJobReady(this.exportJobStatus) &&
      !this.exportJobDownloading
    );
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.qcMisCSTService.isExportJobRunning(this.exportJobStatus);
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

  private normalizeRow(row: any) {
    if (!row) {
      return row;
    }
    return {
      reservationID: row.reservationID ?? row.ReservationID,
      pickupDate: row.pickupDate ?? row.PickupDate,
      serviceLocation: row.serviceLocation ?? row.ServiceLocation,
      qcVerificationResult: row.qcVerificationResult ?? row.QCVerificationResult,
      qcVerificationRemarks: row.qcVerificationRemarks ?? row.QCVerificationRemarks,
      qcVerifiedByAgent: row.qcVerifiedByAgent ?? row.QCVerifiedByAgent
    };
  }

  private buildSearchCriteria(): QcMisCSTSearchCriteria {
    const cityValue = this.searchCity.value;
    let cityID = 0;
    if (cityValue && typeof cityValue === 'object') {
      cityID = cityValue.geoPointID || 0;
    }

    return {
      pickupDateFrom: this.searchPickupDateFrom ? moment(this.searchPickupDateFrom).format('MMM DD yyyy') : '',
      pickupDateTo: this.searchPickupDateTo ? moment(this.searchPickupDateTo).format('MMM DD yyyy') : '',
      locationID: this.searchLocationID || 0,
      cityID
    };
  }

  private startExportPolling(jobId: string): void {
    this.stopExportPolling();
    this.exportPollSub = this.qcMisCSTService.pollExportJob(jobId).subscribe(
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

    this.qcMisCSTService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.qcMisCSTService.isExportJobRunning(status)) {
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
    link.download = preferredFileName || `qcMisCst_${timeStamp}.csv`;
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
