// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerGroupDSEmailsService } from '../../customerGroupDSEmails.service';
import { FormControl, Validators, FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerGroupDSEmails } from '../../customerGroupDSEmails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-customergroupdsemails-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponentCustomerGroupDSEmails {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerGroupDSEmails;
  CustomerGroupID!: number;
  CustomerGroup!: string;
  saveDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentCustomerGroupDSEmails>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerGroupDSEmailsService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.CustomerGroupID = data.customerGroupID;
    this.CustomerGroup = data.customerGroup;
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Duty Slip Email';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Duty Slip Email';
      this.advanceTable = new CustomerGroupDSEmails({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    if (this.action === 'edit') {
      return this.fb.group({
        customerGroupDSEmailsID: [this.advanceTable.customerGroupDSEmailsID],
        customerGroupID: [this.advanceTable.customerGroupID],
        emailID: [this.advanceTable.emailID, [Validators.required, this.singleEmailValidator]],
        activationStatus: [this.advanceTable.activationStatus, Validators.required]
      });
    }

    return this.fb.group({
      customerGroupDSEmailsID: [this.advanceTable.customerGroupDSEmailsID],
      customerGroupID: [this.advanceTable.customerGroupID],
      emailID: [this.advanceTable.emailID, [Validators.required, this.multiEmailValidator]],
      activationStatus: [true]
    });
  }

  singleEmailValidator(control: FormControl) {
    const value = (control.value || '').trim();
    if (!value) {
      return { required: true };
    }
    if (value.includes(',') || value.includes(';')) {
      return { multipleEmails: true };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) ? null : { invalidEmail: true };
  }

  multiEmailValidator(control: FormControl) {
    const value = (control.value || '').trim();
    if (!value) {
      return { required: true };
    }
    const emails = value.split(/[,;]/).map(e => e.trim()).filter(e => e);
    if (emails.length === 0) {
      return { required: true };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalid = emails.some(e => !emailPattern.test(e));
    return invalid ? { invalidEmail: true } : null;
  }

  submit() {}

  reset(): void {
    this.advanceTableForm.reset({
      customerGroupDSEmailsID: -1,
      customerGroupID: this.CustomerGroupID,
      emailID: '',
      activationStatus: true
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  public Post(): void {
    this.advanceTableForm.patchValue({
      customerGroupID: this.data.customerGroupID,
      activationStatus: true
    });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerGroupDSEmailsCreate:CustomerGroupDSEmailsView:Success');
          this.saveDisabled = true;
        },
        error => {
          this._generalService.sendUpdate('CustomerGroupDSEmailsAll:CustomerGroupDSEmailsView:Failure');
          this.saveDisabled = true;
        }
      );
  }

  public Put(): void {
    this.advanceTableForm.patchValue({ customerGroupID: this.advanceTable.customerGroupID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerGroupDSEmailsUpdate:CustomerGroupDSEmailsView:Success');
          this.saveDisabled = true;
        },
        error => {
          this._generalService.sendUpdate('CustomerGroupDSEmailsAll:CustomerGroupDSEmailsView:Failure');
          this.saveDisabled = true;
        }
      );
  }

  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }
}
