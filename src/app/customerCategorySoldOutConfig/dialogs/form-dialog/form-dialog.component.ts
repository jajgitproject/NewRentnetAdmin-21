// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { CustomerCategorySoldOutConfigService } from '../../customerCategorySoldOutConfig.service';
import { CustomerCategorySoldOutConfigModel } from '../../customerCategorySoldOutConfig.model';
import { GeneralService } from '../../../general/general.service';

function nonEmptyIdArray(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return Array.isArray(value) && value.some((id) => Number(id) > 0) ? null : { required: true };
}

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

  filteredCities: any[] = [];
  filteredPackageTypes: any[] = [];
  filteredVehicles: any[] = [];

  citySearchCtrl = new FormControl('');
  packageTypeSearchCtrl = new FormControl('');
  vehicleSearchCtrl = new FormControl('');

  @ViewChild('cityInput') cityInput: ElementRef<HTMLInputElement>;
  @ViewChild('packageTypeInput') packageTypeInput: ElementRef<HTMLInputElement>;
  @ViewChild('vehicleInput') vehicleInput: ElementRef<HTMLInputElement>;

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
    this.citySearchCtrl.valueChanges.subscribe((q) => this.filterCities(q));
    this.packageTypeSearchCtrl.valueChanges.subscribe((q) => this.filterPackageTypes(q));
    this.vehicleSearchCtrl.valueChanges.subscribe((q) => this.filterVehicles(q));
    this.loadLookups();
  }

  createForm(): FormGroup {
    const seedCity =
      this.advanceTable.cityID > 0 ? [this.advanceTable.cityID] : (this.advanceTable.cityIDs || []);
    const seedPackage =
      this.advanceTable.packageTypeID > 0
        ? [this.advanceTable.packageTypeID]
        : this.advanceTable.packageTypeIDs || [];
    const seedVehicle =
      this.advanceTable.vehicleID > 0
        ? [this.advanceTable.vehicleID]
        : this.advanceTable.vehicleIDs || [];

    return this.fb.group({
      customerCategorySoldOutConfigID: [this.advanceTable.customerCategorySoldOutConfigID],
      customerCategoryID: [this.advanceTable.customerCategoryID, [Validators.required, Validators.min(1)]],
      cityIDs: [seedCity, [nonEmptyIdArray]],
      packageTypeIDs: [seedPackage, [nonEmptyIdArray]],
      vehicleIDs: [seedVehicle, [nonEmptyIdArray]],
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
      this.filterCities(this.citySearchCtrl.value);
    });
    this._generalService.GetPackageType().subscribe((rows) => {
      this.packageTypeList = Array.isArray(rows) ? rows : [];
      this.filterPackageTypes(this.packageTypeSearchCtrl.value);
    });
    this._generalService.GetVehicle().subscribe((rows) => {
      this.vehicleList = Array.isArray(rows) ? rows : [];
      this.filterVehicles(this.vehicleSearchCtrl.value);
    });
  }

  cityId(row: any): number {
    return Number(row?.geoPointID ?? row?.GeoPointID ?? 0);
  }

  cityLabel(row: any): string {
    return (row?.geoPointName ?? row?.GeoPointName ?? '').toString();
  }

  packageTypeId(row: any): number {
    return Number(row?.packageTypeID ?? row?.PackageTypeID ?? 0);
  }

  packageTypeLabel(row: any): string {
    return (row?.packageType ?? row?.PackageType ?? '').toString();
  }

  vehicleId(row: any): number {
    return Number(row?.vehicleID ?? row?.VehicleID ?? 0);
  }

  vehicleLabel(row: any): string {
    return (row?.vehicle ?? row?.Vehicle ?? '').toString();
  }

  selectedCityLabels(): { id: number; label: string }[] {
    return this.mapSelected(this.advanceTableForm?.get('cityIDs')?.value, this.cityList, (r) => ({
      id: this.cityId(r),
      label: this.cityLabel(r)
    }));
  }

  selectedPackageTypeLabels(): { id: number; label: string }[] {
    return this.mapSelected(
      this.advanceTableForm?.get('packageTypeIDs')?.value,
      this.packageTypeList,
      (r) => ({ id: this.packageTypeId(r), label: this.packageTypeLabel(r) })
    );
  }

  selectedVehicleLabels(): { id: number; label: string }[] {
    return this.mapSelected(this.advanceTableForm?.get('vehicleIDs')?.value, this.vehicleList, (r) => ({
      id: this.vehicleId(r),
      label: this.vehicleLabel(r)
    }));
  }

  private mapSelected(
    ids: number[],
    source: any[],
    mapRow: (row: any) => { id: number; label: string }
  ): { id: number; label: string }[] {
    const selected = Array.isArray(ids) ? ids.map(Number) : [];
    return selected
      .filter((id) => id > 0)
      .map((id) => {
        const row = source.find((r) => mapRow(r).id === id);
        return row ? mapRow(row) : { id, label: String(id) };
      });
  }

  private filterCities(query: any) {
    const q = (typeof query === 'string' ? query : '').trim().toLowerCase();
    const selected: number[] = this.advanceTableForm?.get('cityIDs')?.value || [];
    this.filteredCities = this.cityList.filter((row) => {
      const id = this.cityId(row);
      if (!id || selected.includes(id)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return this.cityLabel(row).toLowerCase().includes(q);
    });
  }

  private filterPackageTypes(query: any) {
    const q = (typeof query === 'string' ? query : '').trim().toLowerCase();
    const selected: number[] = this.advanceTableForm?.get('packageTypeIDs')?.value || [];
    this.filteredPackageTypes = this.packageTypeList.filter((row) => {
      const id = this.packageTypeId(row);
      if (!id || selected.includes(id)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return this.packageTypeLabel(row).toLowerCase().includes(q);
    });
  }

  private filterVehicles(query: any) {
    const q = (typeof query === 'string' ? query : '').trim().toLowerCase();
    const selected: number[] = this.advanceTableForm?.get('vehicleIDs')?.value || [];
    this.filteredVehicles = this.vehicleList.filter((row) => {
      const id = this.vehicleId(row);
      if (!id || selected.includes(id)) {
        return false;
      }
      if (!q) {
        return true;
      }
      return this.vehicleLabel(row).toLowerCase().includes(q);
    });
  }

  onCitySelected(event: MatAutocompleteSelectedEvent) {
    this.addSelectedId('cityIDs', this.cityId(event.option.value));
    this.citySearchCtrl.setValue('');
    if (this.cityInput?.nativeElement) {
      this.cityInput.nativeElement.value = '';
    }
    this.filterCities('');
  }

  onPackageTypeSelected(event: MatAutocompleteSelectedEvent) {
    this.addSelectedId('packageTypeIDs', this.packageTypeId(event.option.value));
    this.packageTypeSearchCtrl.setValue('');
    if (this.packageTypeInput?.nativeElement) {
      this.packageTypeInput.nativeElement.value = '';
    }
    this.filterPackageTypes('');
  }

  onVehicleSelected(event: MatAutocompleteSelectedEvent) {
    this.addSelectedId('vehicleIDs', this.vehicleId(event.option.value));
    this.vehicleSearchCtrl.setValue('');
    if (this.vehicleInput?.nativeElement) {
      this.vehicleInput.nativeElement.value = '';
    }
    this.filterVehicles('');
  }

  removeCity(id: number) {
    this.removeSelectedId('cityIDs', id);
    this.filterCities(this.citySearchCtrl.value);
  }

  removePackageType(id: number) {
    this.removeSelectedId('packageTypeIDs', id);
    this.filterPackageTypes(this.packageTypeSearchCtrl.value);
  }

  removeVehicle(id: number) {
    this.removeSelectedId('vehicleIDs', id);
    this.filterVehicles(this.vehicleSearchCtrl.value);
  }

  private addSelectedId(controlName: string, id: number) {
    if (!id || id <= 0) {
      return;
    }
    const control = this.advanceTableForm.get(controlName);
    const current: number[] = Array.isArray(control?.value) ? [...control.value] : [];
    if (!current.includes(id)) {
      current.push(id);
      control.setValue(current);
      control.markAsDirty();
      control.updateValueAndValidity();
    }
  }

  private removeSelectedId(controlName: string, id: number) {
    const control = this.advanceTableForm.get(controlName);
    const current: number[] = Array.isArray(control?.value) ? control.value.filter((x) => Number(x) !== id) : [];
    control.setValue(current);
    control.markAsDirty();
    control.updateValueAndValidity();
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
      this.advanceTableForm.markAllAsTouched();
      this.showNotification('snackbar-warning', 'Please fill all required fields', 'bottom', 'center');
      return;
    }
    const raw = this.advanceTableForm.getRawValue();
    const cityIDs = (raw.cityIDs || []).map(Number).filter((id) => id > 0);
    const packageTypeIDs = (raw.packageTypeIDs || []).map(Number).filter((id) => id > 0);
    const vehicleIDs = (raw.vehicleIDs || []).map(Number).filter((id) => id > 0);

    const payload = new CustomerCategorySoldOutConfigModel(raw);
    payload.cityIDs = cityIDs;
    payload.packageTypeIDs = packageTypeIDs;
    payload.vehicleIDs = vehicleIDs;
    payload.cityID = cityIDs[0] || 0;
    payload.packageTypeID = packageTypeIDs[0] || 0;
    payload.vehicleID = vehicleIDs[0] || 0;
    payload.fromDateTimeString = this.combineDateTime(raw.fromDate, raw.fromTime);
    payload.toDateTimeString = this.combineDateTime(raw.toDate, raw.toTime);
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
      () => {
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
