// @ts-nocheck

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Component, Inject, OnInit, ViewChild } from '@angular/core';

import { BookingRefusalService } from '../../bookingRefusal.service';

import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { BookingRefusal } from '../../bookingRefusal.model';

import { MAT_DATE_LOCALE } from '@angular/material/core';

import { GeneralService } from '../../../general/general.service';

import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import { map, startWith, tap } from 'rxjs/operators';



@Component({

  standalone: false,

  selector: 'app-form-dialog',

  templateUrl: './form-dialog.component.html',

  styleUrls: ['./form-dialog.component.sass'],

  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]

})

export class FormDialogComponent implements OnInit {

  action: string;

  dialogTitle: string;

  advanceTableForm: FormGroup;

  advanceTable: BookingRefusal;

  saveDisabled: boolean = true;



  customerList: any[] = [];

  cityList: any[] = [];

  packageList: any[] = [];

  vehicleList: any[] = [];

  locationList: any[] = [];



  private customerList$ = new BehaviorSubject<any[]>([]);

  private cityList$ = new BehaviorSubject<any[]>([]);

  private packageList$ = new BehaviorSubject<any[]>([]);

  private vehicleList$ = new BehaviorSubject<any[]>([]);

  private locationList$ = new BehaviorSubject<any[]>([]);



  customerPicker = new FormControl('');

  cityPicker = new FormControl('');

  dutyTypePicker = new FormControl('');

  vehiclePicker = new FormControl('');

  locationPicker = new FormControl('');



  customerOptions$: Observable<any[]>;

  cityOptions$: Observable<any[]>;

  dutyTypeOptions$: Observable<any[]>;

  vehicleOptions$: Observable<any[]>;

  locationOptions$: Observable<any[]>;



  @ViewChild('pickUpTimePicker') pickUpTimePicker: any;



  compareSelectValue = (a: any, b: any): boolean => {

    if (a == null || b == null) {

      return a === b;

    }

    return Number(a) === Number(b);

  };



  constructor(

    public dialogRef: MatDialogRef<FormDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,

    public advanceTableService: BookingRefusalService,

    private fb: FormBuilder,

    public _generalService: GeneralService

  ) {

    this.action = data.action;

    this.dialogTitle = this.action === 'edit' ? 'Edit Booking Refusal' : 'Add Booking Refusal';

    if (this.action === 'edit') {

      this.advanceTable = new BookingRefusal(data.advanceTable);

    } else {

      this.advanceTable = new BookingRefusal({});

    }

    this.advanceTableForm = this.createContactForm();

    if (this.action === 'edit') {

      this.initEditPickersFromRow();

    }

  }



  /** Pre-fill autocomplete controls so edit mode does not clear hidden IDs on init. */

  private initEditPickersFromRow(): void {

    if (this.advanceTable.customerID) {

      this.customerPicker.setValue(

        { customerID: this.advanceTable.customerID, customerName: this.advanceTable.customerName },

        { emitEvent: false }

      );

    }

    if (this.advanceTable.cityID) {

      this.cityPicker.setValue(

        { geoPointID: this.advanceTable.cityID, geoPointName: this.advanceTable.cityName },

        { emitEvent: false }

      );

    }

    if (this.advanceTable.packageTypeID) {

      this.dutyTypePicker.setValue(

        { packageTypeID: this.advanceTable.packageTypeID, packageType: this.advanceTable.dutyType },

        { emitEvent: false }

      );

    }

    if (this.advanceTable.vehicleID) {

      this.vehiclePicker.setValue(

        { vehicleID: this.advanceTable.vehicleID, vehicle: this.advanceTable.vehicle },

        { emitEvent: false }

      );

    }

    if (this.advanceTable.locationID) {

      this.locationPicker.setValue(

        {

          organizationalEntityID: this.advanceTable.locationID,

          organizationalEntityName: this.advanceTable.locationName

        },

        { emitEvent: false }

      );

    }

  }



  ngOnInit(): void {

    this.customerOptions$ = this.createFilteredOptions$(

      this.customerPicker,

      this.customerList$,

      'customerName',

      'customerID'

    );

    this.cityOptions$ = this.createFilteredOptions$(this.cityPicker, this.cityList$, 'geoPointName', 'cityID');

    this.dutyTypeOptions$ = this.createFilteredOptions$(

      this.dutyTypePicker,

      this.packageList$,

      'packageType',

      'packageTypeID'

    );

    this.vehicleOptions$ = this.createFilteredOptions$(this.vehiclePicker, this.vehicleList$, 'vehicle', 'vehicleID');

    this.locationOptions$ = this.createFilteredOptions$(

      this.locationPicker,

      this.locationList$,

      'organizationalEntityName',

      'locationID'

    );



    this._generalService.getCustomers().subscribe((data) => {

      this.customerList = this.unwrapList(data).map((x) => this.normalizeCustomer(x)).filter((x) => x.customerID > 0);

      this.customerList$.next(this.customerList);

      if (this.action === 'edit') {

        this.syncPickerFromForm('customer');

      }

    });

    this._generalService.GetCitys().subscribe((data) => {

      this.cityList = this.unwrapList(data).map((x) => this.normalizeCity(x)).filter((x) => x.geoPointID > 0);

      this.cityList$.next(this.cityList);

      if (this.action === 'edit') {

        this.syncPickerFromForm('city');

      }

    });

    this._generalService.GetPackageType().subscribe((data) => {

      this.packageList = this.unwrapList(data).map((x) => this.normalizePackageType(x)).filter((x) => x.packageTypeID > 0);

      this.packageList$.next(this.packageList);

      if (this.action === 'edit') {

        this.syncPickerFromForm('duty');

      }

    });

    this._generalService.GetVehicle().subscribe((data) => {

      this.vehicleList = this.unwrapList(data).map((x) => this.normalizeVehicle(x)).filter((x) => x.vehicleID > 0);

      this.vehicleList$.next(this.vehicleList);

      if (this.action === 'edit') {

        this.syncPickerFromForm('vehicle');

      }

    });

    this._generalService.GetLocation().subscribe((data) => {

      this.locationList = this.unwrapList(data).map((x) => this.normalizeLocation(x)).filter((x) => x.organizationalEntityID > 0);

      this.locationList$.next(this.locationList);

      if (this.action === 'edit') {

        this.syncPickerFromForm('location');

      }

    });

  }



  private createFilteredOptions$(

    picker: FormControl,

    list$: BehaviorSubject<any[]>,

    field: string,

    formIdField: string

  ): Observable<any[]> {

    return combineLatest([list$, picker.valueChanges.pipe(startWith(picker.value ?? ''))]).pipe(

      tap(([_, value]) => {

        if (typeof value === 'string') {

          const trimmed = String(value).trim();

          const existingId = Number(this.advanceTableForm.get(formIdField)?.value);

          if (trimmed === '' && existingId > 0) {

            return;

          }

          setTimeout(() => {

            this.advanceTableForm.patchValue({ [formIdField]: null }, { emitEvent: false });

          }, 0);

        }

      }),

      map(([list, value]) => this.filterList(list, value, field))

    );

  }



  private filterList(list: any[], value: any, field: string): any[] {

    const source = list || [];

    if (value && typeof value === 'object') {

      return source.slice(0, 200);

    }

    const term = String(value || '')

      .trim()

      .toLowerCase();

    if (!term) {

      return source.slice(0, 200);

    }

    return source.filter((item) => String(item[field] || '').toLowerCase().includes(term)).slice(0, 200);

  }



  /** Owl timer updates aria-owns when opened; defer to avoid NG0100 in dialog. */

  deferOpenTimePicker(): void {

    setTimeout(() => {

      const picker = this.pickUpTimePicker;

      if (picker && typeof picker.open === 'function') {

        picker.open();

      }

    }, 0);

  }



  private parseTimeToDate(timeStr: string): Date | null {

    if (!timeStr) {

      return null;

    }

    const parts = String(timeStr).trim().split(':');

    if (parts.length < 2) {

      return null;

    }

    const hours = parseInt(parts[0], 10);

    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {

      return null;

    }

    const d = new Date();

    d.setHours(hours, minutes, 0, 0);

    return d;

  }



  private unwrapList(data: any): any[] {

    if (Array.isArray(data)) {

      return data;

    }

    if (data?.$values && Array.isArray(data.$values)) {

      return data.$values;

    }

    if (data?.data && Array.isArray(data.data)) {

      return data.data;

    }

    return [];

  }



  onCustomerSelected(item: any): void {

    if (!item?.customerID) {

      return;

    }

    this.advanceTableForm.patchValue({ customerID: item.customerID });

    this.customerPicker.setValue(item, { emitEvent: false });

  }



  onCitySelected(item: any): void {

    if (!item?.geoPointID) {

      return;

    }

    this.advanceTableForm.patchValue({ cityID: item.geoPointID });

    this.cityPicker.setValue(item, { emitEvent: false });

  }



  onDutyTypeSelected(item: any): void {

    if (!item?.packageTypeID) {

      return;

    }

    this.advanceTableForm.patchValue({ packageTypeID: item.packageTypeID });

    this.dutyTypePicker.setValue(item, { emitEvent: false });

  }



  onVehicleSelected(item: any): void {

    if (!item?.vehicleID) {

      return;

    }

    this.advanceTableForm.patchValue({ vehicleID: item.vehicleID });

    this.vehiclePicker.setValue(item, { emitEvent: false });

  }



  onLocationSelected(item: any): void {

    if (!item?.organizationalEntityID) {

      return;

    }

    this.advanceTableForm.patchValue({ locationID: item.organizationalEntityID });

    this.locationPicker.setValue(item, { emitEvent: false });

  }



  displayCustomer = (item: any): string => (item && typeof item === 'object' ? item.customerName : item) || '';

  displayCity = (item: any): string => (item && typeof item === 'object' ? item.geoPointName : item) || '';

  displayDutyType = (item: any): string => (item && typeof item === 'object' ? item.packageType : item) || '';

  displayVehicle = (item: any): string => (item && typeof item === 'object' ? item.vehicle : item) || '';

  displayLocation = (item: any): string =>

    (item && typeof item === 'object' ? item.organizationalEntityName : item) || '';



  private syncPickerFromForm(type: string): void {

    if (this.action !== 'edit') {

      return;

    }

    switch (type) {

      case 'customer': {

        const id = Number(this.advanceTableForm.get('customerID')?.value);

        const row = this.customerList.find((x) => x.customerID === id);

        if (row) {

          this.customerPicker.setValue(row, { emitEvent: false });

        } else if (this.advanceTable.customerName) {

          this.customerPicker.setValue({ customerID: id, customerName: this.advanceTable.customerName }, { emitEvent: false });

        }

        break;

      }

      case 'city': {

        const id = Number(this.advanceTableForm.get('cityID')?.value);

        const row = this.cityList.find((x) => x.geoPointID === id);

        if (row) {

          this.cityPicker.setValue(row, { emitEvent: false });

        } else if (this.advanceTable.cityName) {

          this.cityPicker.setValue({ geoPointID: id, geoPointName: this.advanceTable.cityName }, { emitEvent: false });

        }

        break;

      }

      case 'duty': {

        const id = Number(this.advanceTableForm.get('packageTypeID')?.value);

        const row = this.packageList.find((x) => x.packageTypeID === id);

        if (row) {

          this.dutyTypePicker.setValue(row, { emitEvent: false });

        } else if (this.advanceTable.dutyType) {

          this.dutyTypePicker.setValue({ packageTypeID: id, packageType: this.advanceTable.dutyType }, { emitEvent: false });

        }

        break;

      }

      case 'vehicle': {

        const id = Number(this.advanceTableForm.get('vehicleID')?.value);

        const row = this.vehicleList.find((x) => x.vehicleID === id);

        if (row) {

          this.vehiclePicker.setValue(row, { emitEvent: false });

        } else if (this.advanceTable.vehicle) {

          this.vehiclePicker.setValue({ vehicleID: id, vehicle: this.advanceTable.vehicle }, { emitEvent: false });

        }

        break;

      }

      case 'location': {

        const id = Number(this.advanceTableForm.get('locationID')?.value);

        const row = this.locationList.find((x) => x.organizationalEntityID === id);

        if (row) {

          this.locationPicker.setValue(row, { emitEvent: false });

        } else if (this.advanceTable.locationName) {

          this.locationPicker.setValue(

            { organizationalEntityID: id, organizationalEntityName: this.advanceTable.locationName },

            { emitEvent: false }

          );

        }

        break;

      }

    }

  }



  normalizeCustomer(x: any) {

    return {

      customerID: Number(x?.customerID ?? x?.CustomerID ?? 0),

      customerName: x?.customerName ?? x?.CustomerName ?? ''

    };

  }



  normalizeCity(x: any) {

    return {

      geoPointID: Number(x?.geoPointID ?? x?.GeoPointID ?? 0),

      geoPointName: x?.geoPointName ?? x?.GeoPointName ?? ''

    };

  }



  normalizePackageType(x: any) {

    return {

      packageTypeID: Number(x?.packageTypeID ?? x?.PackageTypeID ?? 0),

      packageType: x?.packageType ?? x?.PackageType ?? ''

    };

  }



  normalizeVehicle(x: any) {

    return {

      vehicleID: Number(x?.vehicleID ?? x?.VehicleID ?? 0),

      vehicle: x?.vehicle ?? x?.Vehicle ?? ''

    };

  }



  normalizeLocation(x: any) {

    return {

      organizationalEntityID: Number(x?.organizationalEntityID ?? x?.OrganizationalEntityID ?? 0),

      organizationalEntityName: x?.organizationalEntityName ?? x?.OrganizationalEntityName ?? ''

    };

  }



  normalizeTimeForSelect(timeStr: string): string {

    if (!timeStr) {

      return '';

    }

    const parts = String(timeStr).trim().split(':');

    if (parts.length < 2) {

      return '';

    }

    const h = parseInt(parts[0], 10) || 0;

    const m = parseInt(parts[1], 10) || 0;

    const pad = (n: number) => (n < 10 ? '0' + n : String(n));

    return pad(h) + ':' + pad(m);

  }



  createContactForm(): FormGroup {

    let pickUpDateValue = null;

    if (this.advanceTable.pickUpDateString) {

      pickUpDateValue = new Date(this.advanceTable.pickUpDateString);

    } else if (this.advanceTable.pickUpDate) {

      pickUpDateValue = new Date(this.advanceTable.pickUpDate);

    }

    const pickUpTimeValue =

      this.parseTimeToDate(this.advanceTable.pickUpTimeString) ||

      this.parseTimeToDate(this.normalizeTimeForSelect(this.advanceTable.pickUpTimeString));

    const idValidators = [Validators.required, Validators.min(1)];

    return this.fb.group({

      reservationRefusalID: [this.advanceTable.reservationRefusalID],

      customerID: [this.advanceTable.customerID || null, idValidators],

      cityID: [this.advanceTable.cityID || null, idValidators],

      packageTypeID: [this.advanceTable.packageTypeID || null, idValidators],

      vehicleID: [this.advanceTable.vehicleID || null, idValidators],

      pickUpDate: [pickUpDateValue, Validators.required],

      pickUpTime: [pickUpTimeValue, Validators.required],

      locationID: [this.advanceTable.locationID || null, idValidators],

      remarks: [this.advanceTable.remarks, [Validators.required, Validators.maxLength(500)]],

      activationStatus: [this.action === 'add' ? true : this.advanceTable.activationStatus, Validators.required]

    });

  }



  private ensurePickerSelections(): boolean {

    const checks = [

      { picker: this.customerPicker, id: this.advanceTableForm.get('customerID')?.value, key: 'customerID' },

      { picker: this.cityPicker, id: this.advanceTableForm.get('cityID')?.value, key: 'cityID' },

      { picker: this.dutyTypePicker, id: this.advanceTableForm.get('packageTypeID')?.value, key: 'packageTypeID' },

      { picker: this.vehiclePicker, id: this.advanceTableForm.get('vehicleID')?.value, key: 'vehicleID' },

      { picker: this.locationPicker, id: this.advanceTableForm.get('locationID')?.value, key: 'locationID' }

    ];

    let ok = true;

    for (const c of checks) {

      if (!c.id || Number(c.id) < 1) {

        ok = false;

        this.advanceTableForm.get(c.key)?.markAsTouched();

      }

    }

    return ok;

  }



  onNoClick(): void {

    if (this.action === 'add') {

      this.advanceTableForm.reset({

        reservationRefusalID: -1,

        customerID: null,

        cityID: null,

        packageTypeID: null,

        vehicleID: null,

        pickUpDate: null,

        pickUpTime: null,

        locationID: null,

        remarks: '',

        activationStatus: true

      });

      this.customerPicker.reset('');

      this.cityPicker.reset('');

      this.dutyTypePicker.reset('');

      this.vehiclePicker.reset('');

      this.locationPicker.reset('');

    } else {

      this.dialogRef.close();

    }

  }



  public Post(): void {

    this.saveDisabled = false;

    const payload = this.advanceTableForm.getRawValue();

    this.advanceTableService.add(payload).subscribe(

      () => {

        this.saveDisabled = true;

        this.dialogRef.close();

        this._generalService.sendUpdate('BookingRefusalCreate:BookingRefusalView:Success');

      },

      (err) => {

        this.saveDisabled = true;

        console.error('Booking Refusal save failed:', err?.error ?? err?.message ?? err);

        this._generalService.sendUpdate('BookingRefusalAll:BookingRefusalView:Failure');

      }

    );

  }



  public Put(): void {

    this.saveDisabled = false;

    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(

      () => {

        this.saveDisabled = true;

        this.dialogRef.close();

        this._generalService.sendUpdate('BookingRefusalUpdate:BookingRefusalView:Success');

      },

      (err) => {

        this.saveDisabled = true;

        console.error('Booking Refusal update failed:', err?.error ?? err?.message ?? err);

        this._generalService.sendUpdate('BookingRefusalAll:BookingRefusalView:Failure');

      }

    );

  }



  public confirmAdd(): void {

    if (!this.ensurePickerSelections() || !this.advanceTableForm.valid) {

      this.advanceTableForm.markAllAsTouched();

      return;

    }

    if (this.action == 'edit') {

      this.Put();

    } else {

      this.Post();

    }

  }

}


