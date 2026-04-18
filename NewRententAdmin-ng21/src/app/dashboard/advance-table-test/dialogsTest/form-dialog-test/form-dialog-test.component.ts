// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { AdvanceTableTest } from '../../advance-table-test.model';
import { AdvanceTableTestService } from '../../advance-table-test.service';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog-test.component.html',
  styleUrls: ['./form-dialog-test.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogTestComponent 
{
  selectedValue:string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: AdvanceTableTest;
  constructor(
    public dialogRef: MatDialogRef<FormDialogTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: AdvanceTableTestService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle =''
        data.advanceTable.fName + ' ' + data.advanceTable.lName;
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Country';
      this.advanceTable = new AdvanceTableTest({});
    }
    this.advanceTableForm = this.createContactForm();
  }
  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      id: [this.advanceTable.id],
      img: [this.advanceTable.img],
      fName: [this.advanceTable.fName, [Validators.required]],
      lName: [this.advanceTable.lName, [Validators.required]],
      email: [
        this.advanceTable.email,
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
     // gender: [this.advanceTable.gender],
      bDate: [
        formatDate(this.advanceTable.bDate, 'yyyy-MM-dd', 'en'),
        [Validators.required]
      ],
      address: [this.advanceTable.address],
      mobile: [this.advanceTable.mobile, [Validators.required]],
      country: [this.advanceTable.country],
      ActivationStatus:[this.advanceTable.ActivationStatus]

    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.advanceTableService.addAdvanceTableTest(
      this.advanceTableForm.getRawValue()
    );
  }
}


