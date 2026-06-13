// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { GeneralService } from '../../../general/general.service';
import { ContractTariffVerificationService } from '../../contractTariffVerification.service';
import {
  formatVerificationStatusDisplay,
  isPendingVerificationStatus,
  isRejectedStatus,
  isVerifiedStatus,
  normalizeStatusValue,
} from '../../contract-tariff-status.util';

@Component({
  standalone: false,
  selector: 'app-rate-row-details-dialog',
  templateUrl: './rate-row-details-dialog.component.html',
  styleUrls: ['./rate-row-details-dialog.component.scss'],
})
export class RateRowDetailsDialogComponent implements OnInit {
  fields: { field: string; label: string; value: any }[] = [];
  loading = true;
  errorMessage = '';
  remarks = '';
  actionInProgress = false;
  canVerifyRow = false;
  canRejectRow = false;

  constructor(
    public dialogRef: MatDialogRef<RateRowDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      sectionTitle: string;
      rateTableName: string;
      rateRowID: number;
      row: any;
      customerContractID: number;
      packageTypeID: number;
      roleName: string;
      isAuditor: boolean;
      isVerifier: boolean;
    },
    private service: ContractTariffVerificationService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.updateActionEligibility();
    this.loadDetails();
  }

  private loadDetails() {
    const table = this.data?.rateTableName;
    const rowId = Number(this.data?.rateRowID ?? 0);
    if (!table || !rowId) {
      this.loading = false;
      this.errorMessage = 'Invalid rate row reference.';
      this.cdr.markForCheck();
      return;
    }

    this.service
      .getRowDetails(table, rowId)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.fields = this.normalizeFields(res);
          if (this.fields.length === 0) {
            this.errorMessage = 'No row data found.';
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.fields = [];
          this.errorMessage = 'Could not load row details.';
          this.cdr.markForCheck();
        },
      });
  }

  private updateActionEligibility() {
    const row = this.data?.row;
    if (!row) {
      this.canVerifyRow = false;
      this.canRejectRow = false;
      return;
    }
    const status = this.getStatusForRole(row);
    this.canVerifyRow =
      (this.data.isAuditor || this.data.isVerifier) &&
      (isPendingVerificationStatus(status) || isRejectedStatus(status));
    this.canRejectRow =
      (this.data.isAuditor || this.data.isVerifier) &&
      (isPendingVerificationStatus(status) || isVerifiedStatus(status));
  }

  private getStatusForRole(row: any): string | null {
    const raw = this.data.isAuditor
      ? row.auditorVerificationStatus ?? row.AuditorVerificationStatus
      : row.verifierVerificationStatus ?? row.VerifierVerificationStatus;
    return normalizeStatusValue(raw);
  }

  verify() {
    this.applyAction('Verify');
  }

  reject() {
    this.applyAction('Reject');
  }

  private applyAction(action: string) {
    if (!this.data?.isAuditor && !this.data?.isVerifier) {
      this.showSnack('Your role cannot perform verification actions.', 'snackbar-danger');
      return;
    }
    const eligible = action === 'Verify' ? this.canVerifyRow : this.canRejectRow;
    if (!eligible) {
      const track = this.data.isAuditor ? 'auditor' : 'verifier';
      const display = formatVerificationStatusDisplay(this.getStatusForRole(this.data.row));
      this.showSnack(
        `This row cannot be ${action === 'Verify' ? 'verified' : 'rejected'} on your ${track} track (current status: "${display}").`,
        'snackbar-warning'
      );
      return;
    }

    this.executeAction(action);
  }

  private showSnack(message: string, panelClass: string): void {
    this.snackBar.open(message, '', {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass,
    });
  }

  private executeAction(action: string) {
    const body = {
      customerContractID: this.data.customerContractID,
      packageTypeID: this.data.packageTypeID,
      roleName: this.data.roleName,
      roleTrack: this.data.isAuditor ? 'Auditor' : this.data.isVerifier ? 'Verifier' : null,
      roleID: this.generalService.getRoleID(),
      remarks: this.remarks,
      userID: this.generalService.getUserID(),
      items: [
        {
          rateTableName: this.data.rateTableName,
          rateRowID: Number(this.data.rateRowID),
        },
      ],
    };

    this.actionInProgress = true;
    const call = action === 'Verify' ? this.service.verify(body) : this.service.reject(body);
    call
      .pipe(
        finalize(() => {
          this.actionInProgress = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          if (res?.result === 'Success' || res?.result === 'PartialSuccess') {
            this.dialogRef.close({ refresh: true, action, success: true });
          } else {
            this.showSnack(res?.errors?.join('\n') || 'Action failed.', 'snackbar-danger');
          }
        },
        error: (err) =>
          this.showSnack(err?.error?.errors?.join('\n') || 'Request failed.', 'snackbar-danger'),
      });
  }

  private normalizeFields(res: any): { field: string; label: string; value: any }[] {
    if (!res) return [];
    let payload = res;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        return [];
      }
    }
    const raw = payload?.fields ?? payload?.Fields ?? [];
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.$values) ? raw.$values : [];
    return list
      .map((f: any) => ({
        field: f.field ?? f.Field ?? '',
        label: f.label ?? f.Label ?? f.field ?? f.Field ?? '',
        value: f.value ?? f.Value,
      }))
      .filter((f) => !this.isExcludedField(f.field));
  }

  private isExcludedField(field: string): boolean {
    const name = (field || '').trim();
    if (!name) return true;
    const excluded = ['ActivationStatus', 'AuditorVerificationStatus', 'VerifierVerificationStatus'];
    return excluded.some((x) => x.toLowerCase() === name.toLowerCase());
  }

  formatValue(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  }

  isDateValue(value: any): boolean {
    if (!value) return false;
    if (value instanceof Date) return true;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const d = new Date(value);
      return !isNaN(d.getTime());
    }
    return false;
  }

  asDate(value: any): Date | null {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  close() {
    this.dialogRef.close();
  }
}
