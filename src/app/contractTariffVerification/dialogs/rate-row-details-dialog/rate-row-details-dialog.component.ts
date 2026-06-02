// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
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
      Swal.fire('Access', 'Your role cannot perform verification actions.', 'error');
      return;
    }
    const eligible = action === 'Verify' ? this.canVerifyRow : this.canRejectRow;
    if (!eligible) {
      const track = this.data.isAuditor ? 'auditor' : 'verifier';
      const display = formatVerificationStatusDisplay(this.getStatusForRole(this.data.row));
      Swal.fire(
        'Not allowed',
        `This row cannot be ${action === 'Verify' ? 'verified' : 'rejected'} on your ${track} track (current status: "${display}").`,
        'info'
      );
      return;
    }

    const isVerify = action === 'Verify';
    let message = `You are about to ${isVerify ? 'verify' : 'reject'} this row for your ${
      this.data.isAuditor ? 'auditor' : 'verifier'
    } track.`;
    if (this.remarks?.trim()) {
      message += `<br><br>Remarks: ${this.remarks.trim()}`;
    }

    Swal.fire({
      title: isVerify ? 'Confirm verification' : 'Confirm rejection',
      html: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: isVerify ? 'Yes, verify' : 'Yes, reject',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.executeAction(action);
    });
  }

  private executeAction(action: string) {
    const body = {
      customerContractID: this.data.customerContractID,
      packageTypeID: this.data.packageTypeID,
      roleName: this.data.roleName,
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
            Swal.fire('Success', action + ' completed.', 'success').then(() => {
              this.dialogRef.close({ refresh: true });
            });
          } else {
            Swal.fire('Failed', res?.errors?.join('\n') || 'Action failed.', 'error');
          }
        },
        error: (err) =>
          Swal.fire('Error', err?.error?.errors?.join('\n') || 'Request failed.', 'error'),
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
