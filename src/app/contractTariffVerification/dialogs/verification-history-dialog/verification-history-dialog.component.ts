// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ContractTariffVerificationService } from '../../contractTariffVerification.service';

@Component({
  standalone: false,
  selector: 'app-verification-history-dialog',
  templateUrl: './verification-history-dialog.component.html',
  styleUrls: ['./verification-history-dialog.component.scss'],
})
export class VerificationHistoryDialogComponent implements OnInit {
  logs: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<VerificationHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rateTableName: string; rateRowId?: number; rateRowID?: number; title?: string },
    private service: ContractTariffVerificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const table = this.data?.rateTableName;
    const rowId = Number(this.data?.rateRowId ?? this.data?.rateRowID ?? 0);
    if (!table || !rowId) {
      this.loading = false;
      this.errorMessage = 'Invalid rate row reference.';
      this.cdr.markForCheck();
      return;
    }

    this.service
      .getLog(table, rowId)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.markForCheck();
      }))
      .subscribe({
        next: (res) => {
          this.logs = this.normalizeLogs(res);
          this.cdr.markForCheck();
        },
        error: () => {
          this.logs = [];
          this.errorMessage = 'Could not load verification history.';
          this.cdr.markForCheck();
        },
      });
  }

  private normalizeLogs(res: any): any[] {
    if (!res) return [];
    if (Array.isArray(res)) return res.map((l) => this.normalizeLogEntry(l));
    if (Array.isArray(res?.$values)) return res.$values.map((l) => this.normalizeLogEntry(l));
    if (typeof res === 'string') {
      try {
        const parsed = JSON.parse(res);
        return this.normalizeLogs(parsed);
      } catch {
        return [];
      }
    }
    return [];
  }

  private normalizeLogEntry(l: any): any {
    if (!l) return l;
    return {
      roleTrack: l.roleTrack ?? l.RoleTrack,
      action: l.action ?? l.Action,
      previousStatus: l.previousStatus ?? l.PreviousStatus,
      newStatus: l.newStatus ?? l.NewStatus,
      remarks: l.remarks ?? l.Remarks,
      performedBy: l.performedBy ?? l.PerformedBy,
      performedDate: l.performedDate ?? l.PerformedDate,
    };
  }

  formatAction(action: string): string {
    if (!action) return '—';
    if (action === 'RateEdit') return 'Rate Edit';
    return action;
  }

  formatStatusChange(log: any): string {
    const prev = log?.previousStatus?.trim() || '—';
    const next = log?.newStatus?.trim();
    const nextDisplay = !next || next === '(cleared)' ? '—' : next;
    return `${prev} → ${nextDisplay}`;
  }

  close() {
    this.dialogRef.close();
  }
}
