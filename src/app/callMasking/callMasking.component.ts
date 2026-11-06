import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GeneralService } from '../general/general.service';
import { CallMaskHistoryRow } from './callMasking.model';
import { CallMaskingService } from './callMasking.service';

@Component({
  standalone: false,
  selector: 'app-callMasking',
  templateUrl: './callMasking.component.html',
  styleUrls: ['./callMasking.component.sass']
})
export class CallMaskingComponent implements OnInit {
  reservationIdCtrl = new FormControl(null);
  rows: CallMaskHistoryRow[] = [];
  totalCount = 0;
  pageNumber = 1;
  readonly pageSize = 50;
  isLoading = false;
  freeingId: number | null = null;

  constructor(
    private callMaskingService: CallMaskingService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  search(): void {
    this.pageNumber = 1;
    this.load();
  }

  clear(): void {
    this.reservationIdCtrl.setValue(null);
    this.search();
  }

  onPage(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.load();
  }

  markFree(row: CallMaskHistoryRow): void {
    if (!row?.isActive || this.freeingId != null) {
      return;
    }
    const confirmed = confirm(
      'Mark virtual number ' + (row.virtualNumber || '') +
      ' free for reservation ' + row.reservationID + '?'
    );
    if (!confirmed) {
      return;
    }

    this.freeingId = row.callMaskID;
    this.callMaskingService.markFree(row.callMaskID, this.generalService.getUserID()).subscribe(
      () => {
        this.freeingId = null;
        this.snackBar.open('Marked free', 'Close', { duration: 3000 });
        this.load();
      },
      (error) => {
        this.freeingId = null;
        this.snackBar.open(this.errorMessage(error), 'Close', { duration: 4000 });
      }
    );
  }

  private load(): void {
    const reservationId = this.reservationId();
    this.isLoading = true;
    this.callMaskingService.search(reservationId, this.pageNumber).subscribe(
      (page) => {
        this.rows = page?.rows || [];
        this.totalCount = page?.totalCount || 0;
        this.isLoading = false;
      },
      (error) => {
        this.rows = [];
        this.totalCount = 0;
        this.isLoading = false;
        this.snackBar.open(this.errorMessage(error), 'Close', { duration: 4000 });
      }
    );
  }

  private reservationId(): number | null {
    const raw = Number(this.reservationIdCtrl.value);
    if (Number.isFinite(raw) && raw > 0) {
      return raw;
    }
    return null;
  }

  private errorMessage(error: any): string {
    const message = error?.error?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
    return 'Call mask history could not be loaded.';
  }
}
