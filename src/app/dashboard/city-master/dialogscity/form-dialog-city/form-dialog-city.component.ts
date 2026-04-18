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
import { CityMaster } from '../../city-master.model';
import { CityMasterTestService } from '../../city-master.service';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog-city.component.html',
  styleUrls: ['./form-dialog-city.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogCityComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CityMaster;
  constructor(
    public dialogRef: MatDialogRef<FormDialogCityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CityMasterTestService,
    private fb: FormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle =
        data.advanceTable.fName + ' ' + data.advanceTable.lName;
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'New Record';
      this.advanceTable = new CityMaster({});
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
      gender: [this.advanceTable.gender],
      bDate: [
        formatDate(this.advanceTable.bDate, 'yyyy-MM-dd', 'en'),
        [Validators.required]
      ],
      address: [this.advanceTable.address],
      mobile: [this.advanceTable.mobile, [Validators.required]],
      country: [this.advanceTable.country]
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


