// @ts-nocheck
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DebitService } from '../../debit.service';
import { DebitLogEntry } from '../../debit-log.model';

@Component({
  standalone: false,
  selector: 'app-debit-log-dialog',
  templateUrl: './log-dialog.component.html',
  styleUrls: ['./log-dialog.component.sass']
})
export class DebitLogDialogComponent {
  isLoading = true;
  rows: DebitLogEntry[] = [];
  expandedLogId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<DebitLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private debitService: DebitService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.loadLog();
  }

  loadLog(): void {
    const debitId = this.data?.debitID ?? this.data?.debitId ?? this.data?.DebitID;
    if (!debitId) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.debitService.getLogs(debitId).subscribe({
      next: (res) => {
        this.isLoading = false;
        const list = Array.isArray(res) ? res : [];
        this.rows = list.map((r) => new DebitLogEntry(r));
        if (this.rows.length) {
          this.expandedLogId = this.rows[0].debitLogID;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.rows = [];
        this.snackBar.open('Failed to load debit logs.', 'Close', { duration: 4000 });
        this.cdr.detectChanges();
      }
    });
  }

  toggleExpanded(logId: number): void {
    this.expandedLogId = this.expandedLogId === logId ? null : logId;
  }

  userDisplay(row: DebitLogEntry): string {
    const name = (row.recordCreatedEditedDeletedByName || '').trim();
    if (name) {
      return name;
    }
    if (row.recordCreatedEditedDeletedByID) {
      return `User #${row.recordCreatedEditedDeletedByID}`;
    }
    return '—';
  }

  close(): void {
    this.dialogRef.close();
  }
}