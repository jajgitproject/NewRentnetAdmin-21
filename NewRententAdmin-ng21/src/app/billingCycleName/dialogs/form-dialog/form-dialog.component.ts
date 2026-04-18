// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { BillingCycleNameService } from '../../billingCycleName.service';
import { BillingCycleName } from '../../billingCycleName.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: BillingCycleName;
  saveDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: BillingCycleNameService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Billing Cycle Name';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Billing Cycle Name';
      this.advanceTable = new BillingCycleName({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        billingCycleID: [this.advanceTable.billingCycleID],
        billingCycleName: [this.advanceTable.billingCycleName, [this.noWhitespaceValidator]],
        activationStatus: [this.advanceTable.activationStatus],
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    //console.log(this.advanceTableForm.value);
  }
  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();

    }
    else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }
  public Post(): void {

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) {
            this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
            this.saveDisabled = true;
          }
          else {
            this.dialogRef.close();

            this._generalService.sendUpdate('BillingCycleNameUpdate:BillingCycleNameView:Success');//To Send Updates  
            this.saveDisabled = true;

          }
        },
        error => {
          this._generalService.sendUpdate('BillingCycleNameAll:BillingCycleNameView:Failure');//To Send Updates 
          this.saveDisabled = true;
        }
      )
  }
  public Put(): void {

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {

          this.dialogRef.close();
          this._generalService.sendUpdate('BillingCycleNameUpdate:BillingCycleNameView:Success');//To Send Updates  
          this.saveDisabled = true;

        },
        error => {
          this._generalService.sendUpdate('BillingCycleNameAll:BillingCycleNameView:Failure');//To Send Updates 
          this.saveDisabled = true;
        }
      )
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
}


