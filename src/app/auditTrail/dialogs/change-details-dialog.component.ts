import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuditChangedField, AuditTrailEvent } from '../auditTrail.model';

@Component({
  standalone: true,
  selector: 'app-audit-change-details-dialog',
  templateUrl: './change-details-dialog.component.html',
  styleUrls: ['./change-details-dialog.component.sass'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule]
})
export class AuditChangeDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AuditChangeDetailsDialogComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      event: AuditTrailEvent;
      loading: boolean;
      operationLabel: string;
    }
  ) {}

  setDetail(event: AuditTrailEvent, operationLabel: string): void {
    this.data.event = event;
    this.data.operationLabel = operationLabel;
    this.data.loading = false;
    this.cdr.detectChanges();
  }

  driverPair(): { oldDriver: string; newDriver: string } {
    const evt = this.data?.event;
    const fromEventOld = String(evt?.oldDriver || '').trim();
    const fromEventNew = String(evt?.newDriver || '').trim();
    if (fromEventOld || fromEventNew) {
      return { oldDriver: fromEventOld, newDriver: fromEventNew };
    }

    let oldDriver = '';
    let newDriver = '';
    for (const row of evt?.changedFields || []) {
      const name = String(row.field || '').trim().toLowerCase();
      const value = String(row.newValue || row.oldValue || '').trim();
      if (name === 'old driver') {
        oldDriver = value;
      } else if (name === 'new driver') {
        newDriver = value;
      } else if (name === 'driver' || name === 'allotteddriver') {
        oldDriver = oldDriver || String(row.oldValue || '').trim();
        newDriver = newDriver || String(row.newValue || '').trim();
      }
    }
    return { oldDriver, newDriver };
  }

  hasDriverPair(): boolean {
    const pair = this.driverPair();
    return !!(pair.oldDriver || pair.newDriver);
  }

  displayValue(value: string | null | undefined): string {
    const text = String(value || '').trim();
    return text || '—';
  }

  isDriverRow(row: AuditChangedField): boolean {
    const name = String(row?.field || '').trim().toLowerCase();
    return name === 'old driver' || name === 'new driver';
  }

  changedFields(): AuditChangedField[] {
    const rows = this.data?.event?.changedFields || [];
    const skip = new Set([
      'userid',
      'allotmentbyuser',
      'allotmentbyuserid',
      'allotmentdate',
      'allotmenttime',
      'dateofallotment',
      'timeofallotment',
      'modifieddate',
      'modifiedon',
      'timestamputc'
    ]);
    const visible = rows
      .filter((row) => !skip.has(String(row.field || '').replace(/[\s_]/g, '').toLowerCase()))
      .map((row) => {
        const name = String(row.field || '').trim().toLowerCase();
        if (name === 'old driver') {
          return {
            ...row,
            oldValue: String(row.newValue || row.oldValue || '').trim(),
            newValue: ''
          };
        }
        if (name === 'new driver') {
          return {
            ...row,
            oldValue: '',
            newValue: String(row.newValue || row.oldValue || '').trim()
          };
        }
        return row;
      });

    const oldDriver = visible.filter((row) => String(row.field || '').trim().toLowerCase() === 'old driver');
    const newDriver = visible.filter((row) => String(row.field || '').trim().toLowerCase() === 'new driver');
    const rest = visible.filter((row) => {
      const name = String(row.field || '').trim().toLowerCase();
      return name !== 'old driver' && name !== 'new driver';
    });
    return [...oldDriver, ...newDriver, ...rest];
  }
}
