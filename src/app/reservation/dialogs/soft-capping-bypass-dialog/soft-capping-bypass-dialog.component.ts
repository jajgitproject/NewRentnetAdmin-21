// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from '../../../employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';

export interface SoftCappingBypassPayload {
  softCappingByPassReason: string;
  softCappingByPassDetails: string;
  softCappingByPassApproverID: number;
}

export interface SoftCappingBypassDialogData {
  summaryMessage: string;
  bookingCount: number;
  cap: number;
  onSaveAfterBypass: (payload: SoftCappingBypassPayload) => Promise<void>;
}

@Component({
  standalone: false,
  selector: 'app-soft-capping-bypass-dialog',
  templateUrl: './soft-capping-bypass-dialog.component.html',
  styleUrls: ['./soft-capping-bypass-dialog.component.sass'],
})
export class SoftCappingBypassDialogComponent implements OnInit {
  readonly reasonOptions = [
    'VIP customer',
    'Corporate commitment',
    'Fleet available',
    'Operational requirement',
    'Other',
  ];

  approverOptions: Observable<EmployeeDropDown[]> = of([]);
  approverSearchLoading = false;
  saving = false;
  saveError = '';

  form = this.fb.group({
    reason: ['', Validators.required],
    details: ['', [Validators.required, Validators.minLength(10)]],
    approver: [null as EmployeeDropDown | string | null, Validators.required],
  });

  displayApprover = (value: EmployeeDropDown | string | null): string => {
    if (value == null || value === '') {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return this.formatEmployeeLabel(value);
  };

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    public dialogRef: MatDialogRef<SoftCappingBypassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SoftCappingBypassDialogData
  ) {}

  ngOnInit(): void {
    this.approverOptions = this.form.controls['approver'].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        if (this.isEmployeeSelection(value)) {
          return of([]);
        }
        const term = String(value ?? '').trim();
        if (term.length < 3) {
          return of([]);
        }
        this.approverSearchLoading = true;
        return this.generalService.searchEmployeesByPrefix(term).pipe(
          map((list) => list || []),
          catchError(() => of([])),
          finalize(() => {
            this.approverSearchLoading = false;
          })
        );
      })
    );
  }

  get approverHintText(): string {
    if (this.approverSearchLoading) {
      return 'Searching employees…';
    }
    if (this.approverInputLength() < 3) {
      return 'Enter 3 or more characters to search';
    }
    return ' ';
  }

  private isEmployeeSelection(value: unknown): value is EmployeeDropDown {
    return value != null && typeof value === 'object' && !Array.isArray(value);
  }

  resolveEmployeeId(employee: EmployeeDropDown | any): number | null {
    if (!employee) {
      return null;
    }
    const raw = employee.employeeID ?? employee.EmployeeID ?? employee.id ?? employee.ID;
    const id = Number(raw);
    return Number.isFinite(id) && id > 0 ? id : null;
  }

  formatEmployeeLabel(employee: EmployeeDropDown | any): string {
    if (!employee) {
      return '';
    }
    const name = String(
      employee.name
      ?? employee.Name
      ?? `${employee.firstName ?? employee.FirstName ?? ''} ${employee.lastName ?? employee.LastName ?? ''}`.trim()
      ?? employee.employeeName
      ?? ''
    ).trim();
    const id = employee.employeeID ?? employee.EmployeeID;
    const office = employee.employeeOfficeID ?? employee.EmployeeOfficeID;
    const parts = [name];
    if (office) {
      parts.push(`#${office}`);
    } else if (id) {
      parts.push(`ID ${id}`);
    }
    return parts.filter(Boolean).join(' — ');
  }

  onApproverSelected(employee: EmployeeDropDown): void {
    const id = this.resolveEmployeeId(employee);
    if (!id) {
      return;
    }
    this.form.patchValue({ approver: employee }, { emitEvent: false });
    this.form.controls['approver'].setErrors(null);
    this.form.controls['approver'].markAsDirty();
  }

  private getSelectedApproverId(): number | null {
    const value = this.form.get('approver')?.value;
    if (this.isEmployeeSelection(value)) {
      return this.resolveEmployeeId(value);
    }
    return null;
  }

  approverInputLength(): number {
    const value = this.form.get('approver')?.value;
    if (this.isEmployeeSelection(value)) {
      return this.displayApprover(value).length;
    }
    return String(value ?? '').length;
  }

  submit(): void {
    if (this.saving) {
      return;
    }
    this.saveError = '';
    const approverId = this.getSelectedApproverId();
    if (this.form.get('reason')?.invalid) {
      this.form.controls['reason'].markAsTouched();
    }
    if (this.form.get('details')?.invalid) {
      this.form.controls['details'].markAsTouched();
    }
    if (!approverId) {
      this.form.controls['approver'].setErrors({ notSelected: true });
      this.form.controls['approver'].markAsTouched();
    }
    if (this.form.get('reason')?.invalid || this.form.get('details')?.invalid || !approverId) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: SoftCappingBypassPayload = {
      softCappingByPassReason: this.form.getRawValue().reason,
      softCappingByPassDetails: this.form.getRawValue().details || '',
      softCappingByPassApproverID: approverId,
    };

    const save = this.data?.onSaveAfterBypass;
    if (!save) {
      this.dialogRef.close(payload);
      return;
    }

    this.saving = true;
    this.dialogRef.disableClose = true;
    save(payload)
      .then(() => {
        this.dialogRef.close({ ...payload, savedFromDialog: true });
      })
      .catch((err) => {
        this.saving = false;
        this.dialogRef.disableClose = false;
        const message =
          err?.error?.message
          ?? err?.message
          ?? 'Save failed. Please try again.';
        this.saveError = message;
      });
  }

  cancel(): void {
    if (this.saving) {
      return;
    }
    this.dialogRef.close(null);
  }
}
