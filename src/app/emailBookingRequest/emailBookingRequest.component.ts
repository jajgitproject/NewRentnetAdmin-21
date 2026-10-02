import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EmailBookingClerkEfficiencyRow, EmailBookingRequestListItem } from './emailBookingRequest.model';
import { EmailBookingRequestService } from './emailBookingRequest.service';
import { GeneralService } from '../general/general.service';

@Component({
  standalone: false,
  selector: 'app-emailBookingRequest',
  templateUrl: './emailBookingRequest.component.html',
  styleUrls: ['./emailBookingRequest.component.sass']
})
export class EmailBookingRequestComponent implements OnInit, OnDestroy {
  fromDateCtrl = new FormControl();
  toDateCtrl = new FormControl();
  trnCtrl = new FormControl('');
  statusCtrl = new FormControl('AwaitingConfirmation');
  viewCtrl = new FormControl('queue');
  rows: EmailBookingRequestListItem[] = [];
  loading = false;
  pollingMailbox = false;
  claiming = false;
  unconfirmedCount: number | null = null;
  availableCount: number | null = null;
  waitingCount: number | null = null;
  todayRows: EmailBookingClerkEfficiencyRow[] = [];
  myUserId = 0;
  testSubject = '';
  testFrom = '';
  testBody = '';
  testEmailDate: Date | null = new Date();
  private refreshTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private service: EmailBookingRequestService,
    private router: Router,
    private snackBar: MatSnackBar,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);
    this.fromDateCtrl.setValue(from);
    this.toDateCtrl.setValue(today);
    this.myUserId = Number(this.generalService.getUserID() || 0);
    this.search();
    this.refreshTimer = setInterval(() => this.search(true), 20000);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  search(silent = false): void {
    if (!silent) {
      this.loading = true;
    }
    this.service
      .search(
        this.formatDate(this.fromDateCtrl.value),
        this.formatDate(this.toDateCtrl.value),
        String(this.trnCtrl.value || '').trim() || null,
        this.statusCtrl.value,
        1,
        this.viewCtrl.value || 'queue'
      )
      .subscribe(
        (data) => {
          this.rows = (data || []).map((row) => this.normalizeRow(row));
          this.loading = false;
          this.refreshQueueCounts();
          this.refreshTodayPerformance();
        },
        () => {
          this.rows = [];
          this.loading = false;
          if (!silent) {
            this.snackBar.open('Could not load email booking requests. Check that UAT tables exist.', '', {
              duration: 4000
            });
          }
        }
      );
  }

  canConfigure(row: EmailBookingRequestListItem): boolean {
    if (this.isWaiting(row?.requestStatus)) {
      return true;
    }
    return this.isAwaiting(row?.requestStatus) && (!row?.isInProgress || !!row?.isMine);
  }

  nextEmail(): void {
    if (this.claiming) {
      return;
    }
    this.claiming = true;
    this.service.claimNext().subscribe(
      (res) => {
        this.claiming = false;
        const id = res?.emailBookingRequestId || this.parseId(res?.result);
        if (id) {
          this.router.navigate(['/emailBookingConfiguration'], { queryParams: { BookingID: id } });
          return;
        }
        this.snackBar.open(res?.result || 'No emails waiting.', '', { duration: 4000 });
        this.search();
      },
      (err) => {
        this.claiming = false;
        this.snackBar.open(err?.error?.result || 'No emails waiting.', '', { duration: 4000 });
        this.search();
      }
    );
  }

  openConfiguration(row: EmailBookingRequestListItem): void {
    if (!this.canConfigure(row)) {
      return;
    }
    const id = this.rowId(row);
    if (!id) {
      this.snackBar.open('This row has no request id.', '', { duration: 3000 });
      return;
    }
    if (this.isWaiting(row?.requestStatus)) {
      this.router.navigate(['/emailBookingConfiguration'], { queryParams: { BookingID: id } });
      return;
    }
    this.service.claim(id).subscribe(
      () => {
        this.router.navigate(['/emailBookingConfiguration'], { queryParams: { BookingID: id } });
      },
      (err) => {
        this.snackBar.open(err?.error?.result || 'Another clerk has this email.', '', { duration: 4000 });
        this.search();
      }
    );
  }

  private isAwaiting(status: string | undefined): boolean {
    return String(status || '').trim().toLowerCase() === 'awaitingconfirmation';
  }

  private isWaiting(status: string | undefined): boolean {
    return String(status || '').trim().toLowerCase() === 'waitingforreply';
  }

  pollMailbox(): void {
    if (this.pollingMailbox) {
      return;
    }
    this.pollingMailbox = true;
    this.service.pollNow().subscribe(
      (res) => {
        this.pollingMailbox = false;
        this.snackBar.open(res?.result || 'Mailbox read.', '', { duration: 4000 });
        this.search();
      },
      (err) => {
        this.pollingMailbox = false;
        this.snackBar.open(err?.error?.result || 'Could not read the mailbox.', '', { duration: 6000 });
      }
    );
  }

  ingestTest(): void {
    if (!this.testBody.trim()) {
      this.snackBar.open('Paste an email body first.', '', { duration: 3000 });
      return;
    }
    this.service.ingestTest(this.testSubject, this.testFrom, this.testBody, this.formatDate(this.testEmailDate)).subscribe(
      (res) => {
        const id = res?.emailBookingRequestId || this.parseId(res?.result);
        this.snackBar.open(res.result || 'Ingested', '', { duration: 3000 });
        if (id) {
          this.service.claim(id).subscribe(
            () => this.router.navigate(['/emailBookingConfiguration'], { queryParams: { BookingID: id } }),
            () => this.router.navigate(['/emailBookingConfiguration'], { queryParams: { BookingID: id } })
          );
          return;
        }
        this.search();
      },
      (err) => {
        this.snackBar.open(err?.error?.result || 'Ingest failed', '', { duration: 4000 });
      }
    );
  }

  private normalizeRow(row: any): EmailBookingRequestListItem {
    return {
      emailBookingRequestId: Number(row?.emailBookingRequestId ?? row?.EmailBookingRequestId ?? row?.EmailBookingRequestID ?? 0),
      emailBookingRequestGroupId: Number(row?.emailBookingRequestGroupId ?? row?.EmailBookingRequestGroupId ?? 0),
      customerTravelRequestNumber: row?.customerTravelRequestNumber ?? row?.CustomerTravelRequestNumber,
      customerName: row?.customerName ?? row?.CustomerName,
      requestDate: row?.requestDate ?? row?.RequestDate,
      requestTime: row?.requestTime ?? row?.RequestTime,
      pickupDate: row?.pickupDate ?? row?.PickupDate,
      pickupTime: row?.pickupTime ?? row?.PickupTime,
      requestStatus: row?.requestStatus ?? row?.RequestStatus,
      reservationEmailAiId: row?.reservationEmailAiId ?? row?.ReservationEmailAiId ?? row?.ReservationEmailAIID,
      confidence: row?.confidence ?? row?.Confidence,
      bookerName: row?.bookerName ?? row?.BookerName,
      bookerMobile: row?.bookerMobile ?? row?.BookerMobile,
      subject: row?.subject ?? row?.Subject,
      claimedByUserID: row?.claimedByUserID ?? row?.ClaimedByUserID,
      isMine: !!(row?.isMine ?? row?.IsMine),
      isInProgress: !!(row?.isInProgress ?? row?.IsInProgress)
    };
  }

  private rowId(row: EmailBookingRequestListItem | any): number {
    return Number(row?.emailBookingRequestId ?? row?.EmailBookingRequestId ?? row?.EmailBookingRequestID ?? 0);
  }

  private parseId(result: string | undefined): number {
    const match = String(result || '').match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  private refreshTodayPerformance(): void {
    const today = this.formatDate(new Date());
    this.service.clerkEfficiency(today, today).subscribe(
      (data) => {
        const rows = (data || []).map((row) => this.normalizeEfficiency(row));
        if (this.myUserId > 0 && !rows.some((row) => row.userID === this.myUserId)) {
          rows.unshift({
            userID: this.myUserId,
            clerkName: '',
            reservations: 0,
            updates: 0,
            cancellations: 0,
            notRelated: 0,
            total: 0
          });
        }
        this.todayRows = rows;
      },
      () => undefined
    );
  }

  private normalizeEfficiency(row: any): EmailBookingClerkEfficiencyRow {
    const reservations = Number(row?.reservations ?? row?.Reservations ?? 0);
    const updates = Number(row?.updates ?? row?.Updates ?? 0);
    const cancellations = Number(row?.cancellations ?? row?.Cancellations ?? 0);
    const notRelated = Number(row?.notRelated ?? row?.NotRelated ?? 0);
    return {
      userID: Number(row?.userID ?? row?.UserID ?? 0),
      clerkName: row?.clerkName ?? row?.ClerkName ?? ('User ' + (row?.userID ?? row?.UserID ?? '')),
      reservations,
      updates,
      cancellations,
      notRelated,
      total: Number(row?.total ?? row?.Total ?? reservations + updates + cancellations + notRelated)
    };
  }

  private refreshQueueCounts(): void {
    this.service.queueCounts().subscribe(
      (data) => {
        const unconfirmed = Number((data as any)?.unconfirmed ?? (data as any)?.Unconfirmed ?? 0);
        const available = Number((data as any)?.available ?? (data as any)?.Available ?? 0);
        const waiting = Number((data as any)?.waitingForReply ?? (data as any)?.WaitingForReply ?? 0);
        this.unconfirmedCount = Number.isFinite(unconfirmed) ? unconfirmed : 0;
        this.availableCount = Number.isFinite(available) ? available : 0;
        this.waitingCount = Number.isFinite(waiting) ? waiting : 0;
      },
      () => undefined
    );
  }

  private formatDate(value: Date | null): string | null {
    if (!value) {
      return null;
    }
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
