// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminReportDownloadMonitoringService } from './adminReportDownloadMonitoring.service';
import { ShowFieldsDialogComponent } from './show-fields-dialog.component';

@Component({
  standalone: false,
  selector: 'app-admin-report-download-monitoring',
  templateUrl: './adminReportDownloadMonitoring.component.html',
  styleUrls: ['./adminReportDownloadMonitoring.component.sass']
})
export class AdminReportDownloadMonitoringComponent implements OnInit, OnDestroy {
  readonly reportTypeOptions = [
    { value: '', label: 'All' },
    { value: 'DutyRegister', label: 'Duty Register' },
    { value: 'ZonalDutyRegister', label: 'Zonal Duty Register' },
    { value: 'BillDetailMIS', label: 'Bill Detail MIS' },
    { value: 'BookingMIS', label: 'Booking MIS' }
  ];

  readonly statusOptions = [
    { value: '', label: 'All' },
    { value: 'Queued', label: 'Queued' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  readonly pageSize = 50;
  readonly pageSizeOptions = [50];

  reportTypeFilter = '';
  statusFilter = '';
  jobs: any[] = [];
  pagedJobs: any[] = [];
  pageIndex = 0;
  loading = false;
  loaded = false;
  cancellingJobId: string | null = null;
  fieldsJobId: string | null = null;

  private pollSub: Subscription | null = null;

  constructor(
    private service: AdminReportDownloadMonitoringService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.startPolling();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  refresh(): void {
    this.loadOnce();
  }

  search(): void {
    this.pageIndex = 0;
    this.loadOnce();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.applyPage();
  }

  canCancel(job: any): boolean {
    const status = this.getStatus(job);
    return status === 'Queued' || status === 'Processing';
  }

  cancelQueue(job: any): void {
    const jobId = this.getJobId(job);
    if (!jobId || !this.canCancel(job) || this.cancellingJobId) {
      return;
    }

    this.cancellingJobId = jobId;
    this.service.cancel(jobId).subscribe({
      next: () => {
        this.cancellingJobId = null;
        this.snackBar.open('Queue cancelled.', '', {
          duration: 2500,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-success'
        });
        this.loadOnce();
      },
      error: (err) => {
        this.cancellingJobId = null;
        const message =
          err?.error?.message || err?.error?.Message || 'Could not cancel export.';
        this.snackBar.open(message, '', {
          duration: 4000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      }
    });
  }

  showFields(job: any): void {
    const jobId = this.getJobId(job);
    if (!jobId || this.fieldsJobId) {
      return;
    }

    this.fieldsJobId = jobId;
    this.service.getFields(jobId).subscribe({
      next: (data) => {
        this.fieldsJobId = null;
        this.dialog.open(ShowFieldsDialogComponent, {
          width: '560px',
          data
        });
      },
      error: (err) => {
        this.fieldsJobId = null;
        const message =
          err?.error?.message || err?.error?.Message || 'Could not load selected fields.';
        this.snackBar.open(message, '', {
          duration: 4000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      }
    });
  }

  getJobId(job: any): string {
    return job?.jobId || job?.JobId || '';
  }

  getUserName(job: any): string {
    return job?.userName || job?.UserName || ('User ' + (job?.userID || job?.UserID || ''));
  }

  getReportType(job: any): string {
    return job?.jobTypeLabel || job?.JobTypeLabel || job?.jobType || job?.JobType || '';
  }

  getFieldCount(job: any): number | string {
    const count = job?.fieldCount ?? job?.FieldCount;
    return count == null ? '' : count;
  }

  getCreatedOn(job: any): any {
    return job?.createdOn || job?.CreatedOn;
  }

  getStatus(job: any): string {
    return job?.status || job?.Status || '';
  }

  getSuspendedBy(job: any): string {
    const name = job?.cancelledByUserName || job?.CancelledByUserName;
    if (name) {
      return name;
    }
    const id = job?.cancelledByUserID || job?.CancelledByUserID;
    return id > 0 ? 'User ' + id : '';
  }

  formatDate(value: any): string {
    if (!value) {
      return '';
    }
    return moment(value).format('DD-MMM-YYYY HH:mm:ss');
  }

  private startPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = timer(0, 8000)
      .pipe(switchMap(() => this.service.listMonitoring(this.reportTypeFilter || undefined, this.statusFilter || undefined)))
      .subscribe({
        next: (data) => this.applyList(data),
        error: () => {
          this.loading = false;
          this.loaded = true;
        }
      });
  }

  private loadOnce(): void {
    this.loading = true;
    this.service.listMonitoring(this.reportTypeFilter || undefined, this.statusFilter || undefined).subscribe({
      next: (data) => this.applyList(data),
      error: () => {
        this.loading = false;
        this.loaded = true;
        this.snackBar.open('Could not load monitoring list.', '', {
          duration: 3500,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
          panelClass: 'snackbar-danger'
        });
      }
    });
  }

  private applyList(data: any): void {
    this.loading = false;
    this.loaded = true;
    const list = data?.jobs || data?.Jobs;
    this.jobs = Array.isArray(list) ? list : [];
    const maxPage = Math.max(0, Math.ceil(this.jobs.length / this.pageSize) - 1);
    if (this.pageIndex > maxPage) {
      this.pageIndex = maxPage;
    }
    this.applyPage();
  }

  private applyPage(): void {
    const start = this.pageIndex * this.pageSize;
    this.pagedJobs = this.jobs.slice(start, start + this.pageSize);
  }
}
