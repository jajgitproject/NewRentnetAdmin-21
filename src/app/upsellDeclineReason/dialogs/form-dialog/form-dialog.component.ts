// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UpsellDeclineReasonService } from '../../upsellDeclineReason.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { UpsellDeclineReason } from '../../upsellDeclineReason.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: UpsellDeclineReason;
  saveDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: UpsellDeclineReasonService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    this.dialogTitle = 'UpSell Decline Reason';
    if (this.action === 'edit') {
      this.advanceTable = new UpsellDeclineReason(data.advanceTable);
    } else {
      this.advanceTable = new UpsellDeclineReason({});
      this.advanceTable.isActive = true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      reasonID: [this.advanceTable.reasonID],
      reasonName: [this.advanceTable.reasonName, [this.noWhitespaceValidator]],
      displayOrder: [this.advanceTable.displayOrder, [Validators.required, Validators.min(0)]],
      isActive: [this.advanceTable.isActive, Validators.required]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  submit() {
  }

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset({
        reasonID: -1,
        reasonName: '',
        displayOrder: 0,
        isActive: true
      });
    } else {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.saveDisabled = false;
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.saveDisabled = true;
        this.dialogRef.close();
        this._generalService.sendUpdate('UpsellDeclineReasonCreate:UpsellDeclineReasonView:Success');
      },
      error => {
        this.saveDisabled = true;
        if (this.isDuplicateError(error)) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        } else {
          this._generalService.sendUpdate('UpsellDeclineReasonAll:UpsellDeclineReasonView:Failure');
        }
      }
    );
  }

  public Put(): void {
    this.saveDisabled = false;
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.saveDisabled = true;
        this.dialogRef.close();
        this._generalService.sendUpdate('UpsellDeclineReasonUpdate:UpsellDeclineReasonView:Success');
      },
      error => {
        this.saveDisabled = true;
        if (this.isDuplicateError(error)) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        } else {
          this._generalService.sendUpdate('UpsellDeclineReasonAll:UpsellDeclineReasonView:Failure');
        }
      }
    );
  }

  public confirmAdd(): void {
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }

  private isDuplicateError(error: any): boolean {
    return error?.error === 'Duplicate' || String(error?.error || '').indexOf('Duplicate') >= 0;
  }
}
