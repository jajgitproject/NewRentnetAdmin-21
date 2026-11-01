// @ts-nocheck
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import moment from 'moment';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StoredMisExportsService } from './stored-mis-exports.service';

@Component({
  selector: 'app-mis-export-queue-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="mis-export-queue-panel">
      <div class="mis-export-queue-header">
        <span class="mis-export-queue-count">{{ totalCount }} job{{ totalCount === 1 ? '' : 's' }} queued or running</span>
        <button mat-stroked-button type="button" (click)="refresh()" [disabled]="loading">Refresh</button>
      </div>

      <mat-progress-bar *ngIf="loading && !loaded" mode="indeterminate"></mat-progress-bar>

      <div class="mis-export-queue-banner mis-export-queue-banner-lock" *ngIf="showLockBanner">
        Export lock is held by another server session. Waiting for it to release.
        If this persists for several minutes, recycle the API app pool.
      </div>

      <div class="mis-export-queue-banner mis-export-queue-banner-running" *ngIf="showRunningBanner">
        {{ runningJobCount }} export{{ runningJobCount === 1 ? '' : 's' }} currently running across the server.
      </div>

      <p class="mis-export-queue-empty" *ngIf="loaded && !jobs.length">
        No MIS export jobs are queued or running.
      </p>

      <div class="mis-export-queue-table-wrap" *ngIf="jobs.length">
        <table class="mis-export-queue-table">
          <thead>
            <tr>
              <th>Queue #</th>
              <th>Export</th>
              <th>User</th>
              <th>Status</th>
              <th>Ahead</th>
              <th>Rows</th>
              <th>Started</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let job of jobs">
              <td>{{ getQueuePosition(job) }}</td>
              <td>{{ getJobTypeLabel(job) }}</td>
              <td>{{ getUserName(job) }}</td>
              <td>
                <span class="mis-export-queue-status" [class.running]="isRunning(job)">
                  {{ getStatus(job) }}
                </span>
              </td>
              <td>{{ getJobsAhead(job) }}</td>
              <td>{{ getRowsExported(job) }}</td>
              <td>{{ formatDate(getCreatedOn(job)) }}</td>
              <td class="mis-export-queue-message">{{ getMessage(job) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .mis-export-queue-panel {
      margin-top: 8px;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fafafa;
    }
    .mis-export-queue-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .mis-export-queue-count {
      font-weight: 600;
      font-size: 14px;
    }
    .mis-export-queue-banner {
      margin: 0 0 12px;
      padding: 10px 12px;
      border-radius: 4px;
      font-size: 13px;
      line-height: 1.45;
    }
    .mis-export-queue-banner-lock {
      background: #fff3e0;
      border: 1px solid #ffb74d;
      color: #e65100;
    }
    .mis-export-queue-banner-running {
      background: #e3f2fd;
      border: 1px solid #64b5f6;
      color: #1565c0;
    }
    .mis-export-queue-empty {
      margin: 0;
      font-size: 13px;
      color: #5f6368;
    }
    .mis-export-queue-table-wrap {
      overflow-x: auto;
    }
    .mis-export-queue-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .mis-export-queue-table th,
    .mis-export-queue-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #eee;
      text-align: left;
      vertical-align: top;
    }
    .mis-export-queue-table th {
      font-weight: 600;
      background: #f5f5f5;
      white-space: nowrap;
    }
    .mis-export-queue-message {
      max-width: 360px;
      word-break: break-word;
      color: #444;
    }
    .mis-export-queue-status.running {
      color: #d32f2f;
      font-weight: 600;
    }
  `]
})
export class MisExportQueuePanelComponent implements OnInit, OnDestroy {
  jobs: any[] = [];
  totalCount = 0;
  remoteExportHeld = false;
  runningJobCount = 0;
  pendingJobCount = 0;
  loaded = false;
  loading = false;
  private pollSub?: Subscription;
  private readonly pollIntervalMs = 5000;

  get showLockBanner(): boolean {
    return this.loaded && this.remoteExportHeld && this.runningJobCount === 0 && this.jobs.length > 0;
  }

  get showRunningBanner(): boolean {
    return this.loaded && this.runningJobCount > 0;
  }

  constructor(private storedMisExportsService: StoredMisExportsService) {}

  ngOnInit() {
    this.refresh();
    this.pollSub = timer(this.pollIntervalMs, this.pollIntervalMs)
      .pipe(switchMap(() => this.storedMisExportsService.listQueued()))
      .subscribe(
        (result: any) => this.applyResult(result),
        () => {}
      );
  }

  ngOnDestroy() {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = undefined;
    }
  }

  refresh() {
    this.loading = true;
    this.storedMisExportsService.listQueued().subscribe(
      (result: any) => {
        this.applyResult(result);
        this.loading = false;
      },
      () => {
        this.loaded = true;
        this.loading = false;
      }
    );
  }

  private applyResult(result: any) {
    this.jobs = result?.jobs ?? result?.Jobs ?? [];
    this.totalCount = result?.totalCount ?? result?.TotalCount ?? this.jobs.length;
    this.remoteExportHeld = !!(result?.remoteExportHeld ?? result?.RemoteExportHeld);
    this.runningJobCount = result?.runningJobCount ?? result?.RunningJobCount ?? 0;
    this.pendingJobCount = result?.pendingJobCount ?? result?.PendingJobCount ?? 0;
    this.loaded = true;
  }

  getQueuePosition(job: any): string {
    const position = job?.queuePosition ?? job?.QueuePosition;
    return position != null && position > 0 ? String(position) : '—';
  }

  getJobTypeLabel(job: any): string {
    return job?.jobTypeLabel ?? job?.JobTypeLabel ?? job?.jobType ?? job?.JobType ?? '—';
  }

  getUserName(job: any): string {
    const name = (job?.userName ?? job?.UserName ?? '').toString().trim();
    if (name) {
      return name;
    }
    return this.getUserId(job);
  }

  getUserId(job: any): string {
    const userId = job?.userID ?? job?.UserID;
    return userId != null ? String(userId) : '—';
  }

  getStatus(job: any): string {
    return job?.status ?? job?.Status ?? '—';
  }

  isRunning(job: any): boolean {
    return String(this.getStatus(job)).toLowerCase() === 'running';
  }

  getRowsExported(job: any): string {
    const rows = job?.rowsExported ?? job?.RowsExported;
    return rows != null && rows > 0 ? String(rows) : '—';
  }

  getJobsAhead(job: any): string {
    const ahead = job?.jobsAhead ?? job?.JobsAhead;
    if (this.isRunning(job)) {
      return '—';
    }
    return ahead != null ? String(ahead) : '—';
  }

  getMessage(job: any): string {
    return job?.message ?? job?.Message ?? '';
  }

  getCreatedOn(job: any): any {
    return job?.createdOn ?? job?.CreatedOn;
  }

  formatDate(value: any): string {
    if (!value) {
      return '—';
    }
    return moment(value).format('DD MMM YYYY HH:mm');
  }
}
