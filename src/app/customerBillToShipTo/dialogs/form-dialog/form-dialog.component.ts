// @ts-nocheck
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
  private editStateID: number | null = null;
  private editCityID: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    public advanceTableService: CustomerBillToShipToService,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    this.CustomerID = Number(data.CustomerID);
    this.CustomerName = data.CustomerName;

    if (this.action === 'edit') {
      this.dialogTitle = 'Bill To / Ship To For';
      this.advanceTable = data.advanceTable;
      this.editStateID = this.toId(this.advanceTable.stateID);
      this.editCityID = this.toId(this.advanceTable.cityID);
    } else {
      this.dialogTitle = 'Bill To / Ship To For';
      this.advanceTable = new CustomerBillToShipTo({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.customerID = this.CustomerID;
    }

    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void {
    this.initGeoDropdownsForEditOrAdd();
  }

  createContactForm(): FormGroup {
    // On edit, geo IDs are applied after dropdown options load.
    return this.fb.group({
      customerConfigurationBillToShipToID: [this.advanceTable.customerConfigurationBillToShipToID],
      customerID: [this.advanceTable.customerID || this.CustomerID],
      address1: [this.advanceTable.address1, [Validators.required]],
      address2: [this.advanceTable.address2],
      stateID: [null, [Validators.required]],
      cityID: [null, [Validators.required]],
      pincode: [this.advanceTable.pincode, [Validators.required, Validators.maxLength(10)]],
      gstno: [this.advanceTable.gstno || this.advanceTable.gSTNO, [Validators.maxLength(20)]],
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

  compareById = (a: any, b: any): boolean => {
    const left = this.toId(a);
    const right = this.toId(b);
    return left !== null && right !== null && left === right;
  };

  getSelectedStateName(): string {
    const id = this.toId(this.advanceTableForm?.get('stateID')?.value) ?? this.editStateID;
    const match = (this.StatesList || []).find((s) => this.toId(s.geoPointID) === id);
    return match?.geoPointName || this.advanceTable?.stateName || '';
  }

  getSelectedCityName(): string {
    const id = this.toId(this.advanceTableForm?.get('cityID')?.value) ?? this.editCityID;
    const match = (this.CityList || []).find((c) => this.toId(c.geoPointID) === id);
    return match?.geoPointName || this.advanceTable?.cityName || '';
  }

  private toId(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  private normalizeGeoList(list: any[]): any[] {
    return (list || [])
      .map((item) => {
        const id = this.toId(item?.geoPointID ?? item?.GeoPointID);
        const name = item?.geoPointName ?? item?.GeoPointName ?? '';
        return {
          ...item,
          geoPointID: id,
          geoPointName: name,
        };
      })
      .filter((item) => item.geoPointID !== null);
  }

  private setControlValue(controlName: string, value: number | null): void {
    const control = this.advanceTableForm.get(controlName);
    if (!control) {
      return;
    }
    // Clear then set after options render so mat-select trigger refreshes.
    control.setValue(null, { emitEvent: false });
    this.cdr.detectChanges();
    setTimeout(() => {
      control.setValue(value, { emitEvent: false });
      control.updateValueAndValidity({ emitEvent: false });
      this.cdr.detectChanges();
    });
  }

  private initGeoDropdownsForEditOrAdd(): void {
    this._generalService.GetPickupSpotForReservation(2).subscribe(
      (data) => {
        this.StatesList = this.normalizeGeoList(data);
        this.cdr.detectChanges();

        if (this.action !== 'edit' || !this.editStateID) {
          return;
        }

        this.setControlValue('stateID', this.editStateID);
        this.loadCities(this.editStateID, this.editCityID);
      },
      () => {
        this.StatesList = [];
      }
    );
  }

  onStateChange(): void {
    const stateID = this.toId(this.advanceTableForm.get('stateID')?.value);
    this.advanceTableForm.patchValue({ cityID: null }, { emitEvent: false });
    this.CityList = [];
    this.editCityID = null;
    if (stateID) {
      this.editStateID = stateID;
      this.loadCities(stateID);
    }
  }

  loadCities(stateID: number, selectedCityID: number | null = null): void {
    this._generalService.GetCities(stateID).subscribe(
      (data) => {
        this.CityList = this.normalizeGeoList(data);
        this.cdr.detectChanges();
        if (selectedCityID) {
          this.setControlValue('cityID', selectedCityID);
        }
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

    const payload = this.buildPayload();
    if (!payload.startDate) {
      this.snackBar.open('Start Date is required. Please select a valid date.', 'Close', {
        duration: 4000,
        panelClass: ['snackbar-danger'],
      });
      return;
    }
    if (!payload.customerID || Number.isNaN(Number(payload.customerID))) {
      this.snackBar.open('Customer ID is missing. Re-open this page from Customer Actions.', 'Close', {
        duration: 4000,
        panelClass: ['snackbar-danger'],
      });
      return;
    }

    this.saveDisabled = false;

    if (this.action === 'edit') {
      this.advanceTableService.update(payload).subscribe({
        next: () => {
          this._generalService.sendUpdate('CustomerBillToShipToUpdate:CustomerBillToShipToView:Success');
          this.snackBar.open('Record updated.', 'Close', { duration: 2500 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.saveDisabled = true;
          this.snackBar.open(this.resolveErrorMessage(error, 'Failed to update record.'), 'Close', {
            duration: 5000,
            panelClass: ['snackbar-danger'],
          });
        },
      });
    } else {
      this.advanceTableService.add(payload).subscribe({
        next: () => {
          this._generalService.sendUpdate('CustomerBillToShipToCreate:CustomerBillToShipToView:Success');
          this.snackBar.open('Record saved.', 'Close', { duration: 2500 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.saveDisabled = true;
          this.snackBar.open(this.resolveErrorMessage(error, 'Failed to save record.'), 'Close', {
            duration: 5000,
            panelClass: ['snackbar-danger'],
          });
        },
      });
    }
  }

  private resolveErrorMessage(error: any, fallback: string): string {
    // ErrorInterceptor converts HttpErrorResponse into a plain string.
    if (typeof error === 'string' && error.trim()) {
      return error.trim();
    }
    if (error?.error?.message) {
      return String(error.error.message);
    }
    if (error?.error?.title) {
      return String(error.error.title);
    }
    if (error?.message) {
      return String(error.message);
    }
    return fallback;
  }

  private buildPayload(): CustomerBillToShipTo {
    const raw = this.advanceTableForm.getRawValue();
    const model = new CustomerBillToShipTo({
      ...raw,
      customerConfigurationBillToShipToID: Number(raw.customerConfigurationBillToShipToID || -1),
      customerID: Number(this.CustomerID),
      stateID: Number(raw.stateID),
      cityID: Number(raw.cityID),
      address1: (raw.address1 || '').trim(),
      address2: (raw.address2 || '').trim(),
      pincode: (raw.pincode || '').trim(),
      gstno: (raw.gstno || '').trim(),
      gSTNO: (raw.gstno || '').trim(),
      startDate: raw.startDate,
      endDate: raw.endDate || null,
      activationStatus: raw.activationStatus === true || raw.activationStatus === 'true',
    });
    return model;
  }
}
