// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from '../../../general/general.service';
import { StatesDropDown } from '../../../organizationalEntity/stateDropDown.model';
import { CityDropDown } from '../../../city/cityDropDown.model';
import { CustomerBillToShipTo } from '../../customerBillToShipTo.model';
import { CustomerBillToShipToService } from '../../customerBillToShipTo.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerBillToShipTo;
  CustomerID: number;
  CustomerName: string;
  saveDisabled = true;
  StatesList: StatesDropDown[] = [];
  CityList: CityDropDown[] = [];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public advanceTableService: CustomerBillToShipToService,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    this.CustomerID = data.CustomerID;
    this.CustomerName = data.CustomerName;

    if (this.action === 'edit') {
      this.dialogTitle = 'Bill To / Ship To For';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Bill To / Ship To For';
      this.advanceTable = new CustomerBillToShipTo({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.customerID = this.CustomerID;
    }

    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void {
    this.loadStates();
    if (this.action === 'edit' && this.advanceTable.stateID) {
      this.loadCities(this.advanceTable.stateID);
    }
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      customerConfigurationBillToShipToID: [this.advanceTable.customerConfigurationBillToShipToID],
      customerID: [this.advanceTable.customerID || this.CustomerID],
      address1: [this.advanceTable.address1, [Validators.required]],
      address2: [this.advanceTable.address2],
      stateID: [this.advanceTable.stateID || null, [Validators.required]],
      cityID: [this.advanceTable.cityID || null, [Validators.required]],
      pincode: [this.advanceTable.pincode, [Validators.required, Validators.maxLength(10)]],
      gstno: [this.advanceTable.gstno, [Validators.maxLength(20)]],
      startDate: [this.advanceTable.startDate, [Validators.required]],
      endDate: [this.advanceTable.endDate],
      activationStatus: [
        this.advanceTable.activationStatus === undefined || this.advanceTable.activationStatus === null
          ? true
          : this.advanceTable.activationStatus,
        [Validators.required],
      ],
    });
  }

  loadStates(): void {
    this._generalService.GetPickupSpotForReservation(2).subscribe(
      (data) => {
        this.StatesList = data || [];
      },
      () => {
        this.StatesList = [];
      }
    );
  }

  onStateChange(): void {
    const stateID = this.advanceTableForm.get('stateID')?.value;
    this.advanceTableForm.patchValue({ cityID: null });
    this.CityList = [];
    if (stateID) {
      this.loadCities(stateID);
    }
  }

  loadCities(stateID: number): void {
    this._generalService.GetCities(stateID).subscribe(
      (data) => {
        this.CityList = data || [];
      },
      () => {
        this.CityList = [];
      }
    );
  }

  onNoClick(action: string): void {
    if (action === 'add') {
      this.advanceTableForm.reset({
        customerConfigurationBillToShipToID: -1,
        customerID: this.CustomerID,
        activationStatus: true,
      });
      this.CityList = [];
    } else {
      this.dialogRef.close();
    }
  }

  confirmAdd(): void {
    if (!this.advanceTableForm.valid) {
      this.advanceTableForm.markAllAsTouched();
      return;
    }

    this.saveDisabled = false;
    const payload = this.buildPayload();

    if (this.action === 'edit') {
      this.advanceTableService.update(payload).subscribe(
        () => {
          this._generalService.sendUpdate('CustomerBillToShipToUpdate:CustomerBillToShipToView:Success');
          this.snackBar.open('Record updated.', 'Close', { duration: 2500 });
          this.dialogRef.close();
        },
        () => {
          this.saveDisabled = true;
          this.snackBar.open('Failed to update record.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-danger'],
          });
        }
      );
    } else {
      this.advanceTableService.add(payload).subscribe(
        () => {
          this._generalService.sendUpdate('CustomerBillToShipToCreate:CustomerBillToShipToView:Success');
          this.snackBar.open('Record saved.', 'Close', { duration: 2500 });
          this.dialogRef.close();
        },
        () => {
          this.saveDisabled = true;
          this.snackBar.open('Failed to save record.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-danger'],
          });
        }
      );
    }
  }

  private buildPayload(): CustomerBillToShipTo {
    const raw = this.advanceTableForm.getRawValue();
    const model = new CustomerBillToShipTo(raw);
    model.customerID = this.CustomerID;
    model.gstno = raw.gstno;
    model.gSTNO = raw.gstno;
    return model;
  }
}
