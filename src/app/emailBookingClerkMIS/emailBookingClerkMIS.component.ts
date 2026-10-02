import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EmailBookingClerkEfficiencyRow } from '../emailBookingRequest/emailBookingRequest.model';
import { EmailBookingRequestService } from '../emailBookingRequest/emailBookingRequest.service';

@Component({
  standalone: false,
  selector: 'app-emailBookingClerkMIS',
  templateUrl: './emailBookingClerkMIS.component.html',
  styleUrls: ['./emailBookingClerkMIS.component.sass']
})
export class EmailBookingClerkMISComponent implements OnInit {
  fromDateCtrl = new FormControl();
  toDateCtrl = new FormControl();
  rows: EmailBookingClerkEfficiencyRow[] = [];
  loading = false;

  constructor(
    private service: EmailBookingRequestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.fromDateCtrl.setValue(today);
    this.toDateCtrl.setValue(today);
    this.search();
  }

  search(): void {
    this.loading = true;
    this.service.clerkEfficiency(this.formatDate(this.fromDateCtrl.value), this.formatDate(this.toDateCtrl.value)).subscribe(
      (data) => {
        this.rows = (data || []).map((row) => this.normalize(row));
        this.loading = false;
      },
      () => {
        this.rows = [];
        this.loading = false;
        this.snackBar.open('Could not load clerk efficiency.', '', { duration: 4000 });
      }
    );
  }

  get totals(): EmailBookingClerkEfficiencyRow {
    return this.rows.reduce(
      (acc, row) => ({
        userID: 0,
        clerkName: 'Total',
        reservations: acc.reservations + row.reservations,
        updates: acc.updates + row.updates,
        cancellations: acc.cancellations + row.cancellations,
        notRelated: acc.notRelated + row.notRelated,
        total: acc.total + row.total
      }),
      { userID: 0, clerkName: 'Total', reservations: 0, updates: 0, cancellations: 0, notRelated: 0, total: 0 }
    );
  }

  private normalize(row: any): EmailBookingClerkEfficiencyRow {
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
