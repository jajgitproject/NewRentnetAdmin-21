// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { CustomerCategorySoldOutConfigService } from '../../customerCategorySoldOutConfig.service';
import { CustomerCategorySoldOutConfigModel } from '../../customerCategorySoldOutConfig.model';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-soldout-form-dialog',
  templateUrl: './form-dialog.component.html',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerCategorySoldOutConfigModel;
  isLoading = false;

  customerCategoryList: any[] = [];
  cityList: any[] = [];
  packageTypeList: any[] = [];
  vehicleList: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: CustomerCategorySoldOutConfigService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Sold-Out Config';
      this.advanceTable = data.advanceTable;
      this.patchDateTimesFromRow(this.advanceTable);
    } else {
      this.dialogTitle = 'Add Sold-Out Config';
      this.advanceTable = new CustomerCategorySoldOutConfigModel({});
    }
    this.advanceTableForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  createForm(): FormGroup {
    return this.fb.group({
      customerCategorySoldOutConfigID: [this.advanceTable.customerCategorySoldOutConfigID],
      customerCategoryID: [this.advanceTable.customerCategoryID, [Validators.required, Validators.min(1)]],
      cityID: [this.advanceTable.cityID, [Validators.required, Validators.min(1)]],
      packageTypeID: [this.advanceTable.packageTypeID, [Validators.required, Validators.min(1)]],
      vehicleID: [this.advanceTable.vehicleID, [Validators.required, Validators.min(1)]],
      fromDate: [this.advanceTable.fromDate, Validators.required],
      fromTime: [this.advanceTable.fromTime || '00:00', Validators.required],
      toDate: [this.advanceTable.toDate, Validators.required],
      toTime: [this.advanceTable.toTime || '23:59', Validators.required],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  loadLookups() {
    this._generalService.getCustomerCategory().subscribe((rows) => {
      this.customerCategoryList = Array.isArray(rows) ? rows : [];
    });
    this._generalService.GetCitys().subscribe((rows) => {
      this.cityList = Array.isArray(rows) ? rows : [];
    });
    this._generalService.GetPackageType().subscribe((rows) => {
      this.packageTypeList = Array.isArray(rows) ? rows : [];
    });
    this._generalService.GetVehicle().subscribe((rows) => {
      this.vehicleList = Array.isArray(rows) ? rows : [];
    });
  }

  private patchDateTimesFromRow(row: CustomerCategorySoldOutConfigModel) {
    const from = row.fromDateTime ? moment(row.fromDateTime) : null;
    const to = row.toDateTime ? moment(row.toDateTime) : null;
    if (from && from.isValid()) {
      row.fromDate = from.toDate();
      row.fromTime = from.format('HH:mm');
    }
    if (to && to.isValid()) {
      row.toDate = to.toDate();
      row.toTime = to.format('HH:mm');
    }
  }

  private combineDateTime(dateVal: any, timeVal: string): string {
    const d = moment(dateVal);
    const parts = (timeVal || '00:00').split(':');
    d.hour(Number(parts[0] || 0));
    d.minute(Number(parts[1] || 0));
    d.second(0);
    return d.format('YYYY-MM-DD HH:mm:ss');
  }

  private resolveSaveErrorMessage(err: any): string {
    // ErrorInterceptor rethrows a plain string — handle that first.
    if (typeof err === 'string' && err.trim()) {
      return err.trim();
    }
    const body = err?.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      if (typeof body.message === 'string' && body.message.trim()) {
        return body.message;
      }
      if (typeof body.title === 'string' && body.title.trim()) {
        return body.title;
      }
      if (typeof body.result === 'string' && body.result.trim()) {
        return body.result;
      }
      try {
        const json = JSON.stringify(body);
        if (json && json !== '{}') {
          return json;
        }
      } catch {
        // ignore
      }
    }
    if (typeof err?.message === 'string' && err.message.trim()) {
      return err.message;
    }
    return 'Save failed';
  }

  submit() {
    if (!this.advanceTableForm.valid) {
      this.showNotification('snackbar-warning', 'Please fill all required fields', 'bottom', 'center');
      return;
    }
    const raw = this.advanceTableForm.getRawValue();
    const payload = new CustomerCategorySoldOutConfigModel(raw);
    payload.fromDateTimeString = this.combineDateTime(raw.fromDate, raw.fromTime);
    payload.toDateTimeString = this.combineDateTime(raw.toDate, raw.toTime);
    // Do not send space-separated strings on DateTime fields — System.Text.Json
    // rejects them and [ApiController] returns 400 before the action runs.
    // API Add/Update parses FromDateTimeString / ToDateTimeString instead.
    payload.fromDateTime = null;
    payload.toDateTime = null;
    delete (payload as any).fromDate;
    delete (payload as any).toDate;
    delete (payload as any).fromTime;
    delete (payload as any).toTime;

    this.isLoading = true;
    const req$ =
      this.action === 'edit'
        ? this.advanceTableService.update(payload)
        : this.advanceTableService.add(payload);

    req$.subscribe(
      (res) => {
        this.isLoading = false;
        this._generalService.sendUpdate(
          this.action === 'edit'
            ? 'CustomerCategorySoldOutConfigUpdate:View:Success'
            : 'CustomerCategorySoldOutConfigCreate:View:Success'
        );
        this.dialogRef.close(1);
      },
      (err) => {
        this.isLoading = false;
        this.showNotification('snackbar-danger', this.resolveSaveErrorMessage(err), 'bottom', 'center');
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
