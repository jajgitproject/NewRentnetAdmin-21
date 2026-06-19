// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { IncidenceEmailToBeSentToService } from '../../incidenceEmailToBeSentTo.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { IncidenceEmailToBeSentTo } from '../../incidenceEmailToBeSentTo.model';
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
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: IncidenceEmailToBeSentTo;
  saveDisabled: boolean = true;
  typeOptions: string[] = ['Internal', 'External'];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: IncidenceEmailToBeSentToService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Incidence Email To Be Sent To';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Incidence Email To Be Sent To';
      this.advanceTable = new IncidenceEmailToBeSentTo({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.incidenceEmailToBeSentToType = 'Internal';
    }
    this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      incidenceEmailToBeSentToID: [this.advanceTable.incidenceEmailToBeSentToID],
      incidenceEmailToBeSentTo: [this.advanceTable.incidenceEmailToBeSentTo, [Validators.required, this.noWhitespaceValidator]],
      incidenceEmailToBeSentToType: [this.advanceTable.incidenceEmailToBeSentToType, Validators.required],
      activationStatus: [this.advanceTable.activationStatus, Validators.required]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  submit() {}

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();
      this.advanceTableForm.patchValue({
        activationStatus: true,
        incidenceEmailToBeSentToType: 'Internal'
      });
    } else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('IncidenceEmailToBeSentToCreate:IncidenceEmailToBeSentToView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('IncidenceEmailToBeSentToAll:IncidenceEmailToBeSentToView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public Put(): void {
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('IncidenceEmailToBeSentToUpdate:IncidenceEmailToBeSentToView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('IncidenceEmailToBeSentToAll:IncidenceEmailToBeSentToView:Failure');
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
