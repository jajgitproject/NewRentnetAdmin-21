// @ts-nocheck
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-booking-refusal-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class BookingRefusalSearchDialogComponent implements OnInit {
  searchForm: FormGroup;

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

  private readonly minPrefixLength = 3;

  constructor(
    public dialogRef: MatDialogRef<BookingRefusalSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.searchForm = this.fb.group({
      customerID: [null],
      cityID: [null],
      packageTypeID: [null],
      vehicleID: [null],
      locationID: [null],
      pickUpDate: [null],
      activationStatusFilter: ['active']
    });
  }

  ngOnInit(): void {
    if (this.data?.criteria) {
      this.applyExistingCriteria(this.data.criteria);
    }

    this.customerOptions$ = this.createPrefixOptions$(
      this.customerPicker,
      term => this._generalService.GetCustomerDropDownForControlPanel(term),
      x => this.normalizeCustomer(x)
    );
    this.cityOptions$ = this.createPrefixOptions$(
      this.cityPicker,
      term => this._generalService.GetCityDropDownForControlPanel(term),
      x => this.normalizeCity(x)
    );
    this.dutyTypeOptions$ = this.createPrefixOptions$(
      this.dutyTypePicker,
      term => this._generalService.GetDutyTypeDropDownForControlPanel(term),
      x => this.normalizePackageType(x)
    );
    this.vehicleOptions$ = this.createPrefixOptions$(
      this.vehiclePicker,
      term => this._generalService.GetVehicleDropDownForControlPanel(term),
      x => this.normalizeVehicle(x)
    );
    this.locationOptions$ = this.createPrefixOptions$(
      this.locationPicker,
      term => this._generalService.GetLocationDropDownForControlPanel(term),
      x => this.normalizeLocation(x)
    );
  }

  private createPrefixOptions$(
    picker: FormControl,
    fetch: (term: string) => Observable<any>,
    normalize: (x: any) => any
  ): Observable<any[]> {
    return picker.valueChanges.pipe(
      startWith(picker.value ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (value && typeof value === 'object') {
          return of([value]);
        }
        const term = String(value || '').trim();
        if (term.length < this.minPrefixLength) {
          return of([]);
        }
        return fetch(term).pipe(
          map(data => this.unwrapList(data).map(x => normalize(x)))
        );
      })
    );
  }

  onCustomerSelected(item: any): void {
    if (!item?.customerID) {
      return;
    }
    this.searchForm.patchValue({ customerID: item.customerID });
    this.customerPicker.setValue(item, { emitEvent: false });
  }

  onCitySelected(item: any): void {
    if (!item?.geoPointID) {
      return;
    }
    this.searchForm.patchValue({ cityID: item.geoPointID });
    this.cityPicker.setValue(item, { emitEvent: false });
  }

  onDutyTypeSelected(item: any): void {
    if (!item?.packageTypeID) {
      return;
    }
    this.searchForm.patchValue({ packageTypeID: item.packageTypeID });
    this.dutyTypePicker.setValue(item, { emitEvent: false });
  }

  onVehicleSelected(item: any): void {
    if (!item?.vehicleID) {
      return;
    }
    this.searchForm.patchValue({ vehicleID: item.vehicleID });
    this.vehiclePicker.setValue(item, { emitEvent: false });
  }

  onLocationSelected(item: any): void {
    if (!item?.organizationalEntityID) {
      return;
    }
    this.searchForm.patchValue({ locationID: item.organizationalEntityID });
    this.locationPicker.setValue(item, { emitEvent: false });
  }

  displayCustomer = (item: any): string => (item && typeof item === 'object' ? item.customerName : item) || '';
  displayCity = (item: any): string => (item && typeof item === 'object' ? item.geoPointName : item) || '';
  displayDutyType = (item: any): string => (item && typeof item === 'object' ? item.packageType : item) || '';
  displayVehicle = (item: any): string => (item && typeof item === 'object' ? item.vehicle : item) || '';
  displayLocation = (item: any): string =>
    (item && typeof item === 'object' ? item.organizationalEntityName : item) || '';

  onSearch(): void {
    const criteria = this.buildSearchCriteria();
    this.dialogRef.close({ searched: true, criteria });
  }

  onReset(): void {
    this.searchForm.reset({
      customerID: null,
      cityID: null,
      packageTypeID: null,
      vehicleID: null,
      locationID: null,
      pickUpDate: null,
      activationStatusFilter: 'active'
    });
    this.customerPicker.setValue('');
    this.cityPicker.setValue('');
    this.dutyTypePicker.setValue('');
    this.vehiclePicker.setValue('');
    this.locationPicker.setValue('');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private buildSearchCriteria(): any {
    const criteria: any = {};

    const customerID = Number(this.searchForm.get('customerID')?.value);
    if (customerID > 0) {
      criteria.customerID = customerID;
    } else {
      const name = this.textFromPicker(this.customerPicker, 'customerName');
      if (name) {
        criteria.customerName = name;
      }
    }

    const cityID = Number(this.searchForm.get('cityID')?.value);
    if (cityID > 0) {
      criteria.cityID = cityID;
    } else {
      const cityName = this.textFromPicker(this.cityPicker, 'geoPointName');
      if (cityName) {
        criteria.cityName = cityName;
      }
    }

    const packageTypeID = Number(this.searchForm.get('packageTypeID')?.value);
    if (packageTypeID > 0) {
      criteria.packageTypeID = packageTypeID;
    } else {
      const dutyType = this.textFromPicker(this.dutyTypePicker, 'packageType');
      if (dutyType) {
        criteria.dutyType = dutyType;
      }
    }

    const vehicleID = Number(this.searchForm.get('vehicleID')?.value);
    if (vehicleID > 0) {
      criteria.vehicleID = vehicleID;
    } else {
      const vehicle = this.textFromPicker(this.vehiclePicker, 'vehicle');
      if (vehicle) {
        criteria.vehicle = vehicle;
      }
    }

    const locationID = Number(this.searchForm.get('locationID')?.value);
    if (locationID > 0) {
      criteria.locationID = locationID;
    } else {
      const locationName = this.textFromPicker(this.locationPicker, 'organizationalEntityName');
      if (locationName) {
        criteria.locationName = locationName;
      }
    }

    const pickUpDate = this.searchForm.get('pickUpDate')?.value;
    if (pickUpDate) {
      try {
        const d = pickUpDate instanceof Date ? pickUpDate : new Date(pickUpDate);
        if (!isNaN(d.getTime())) {
          criteria.pickUpDateString = formatDate(d, 'yyyy-MM-dd', 'en-GB');
        }
      } catch (e) {
        /* ignore invalid date */
      }
    }

    const activationFilter = this.searchForm.get('activationStatusFilter')?.value;
    criteria.activationStatus = activationFilter === 'deactive' ? false : true;

    return criteria;
  }

  private mapActivationFilterFromCriteria(criteria: any): string {
    if (criteria?.activationStatus === false) {
      return 'deactive';
    }
    return 'active';
  }

  private textFromPicker(picker: FormControl, objectField: string): string {
    const value = picker.value;
    if (value && typeof value === 'object') {
      return String(value[objectField] || '').trim();
    }
    return String(value || '').trim();
  }

  private applyExistingCriteria(criteria: any): void {
    if (!criteria) {
      return;
    }
    this.searchForm.patchValue({
      customerID: criteria.customerID || null,
      cityID: criteria.cityID || null,
      packageTypeID: criteria.packageTypeID || null,
      vehicleID: criteria.vehicleID || null,
      locationID: criteria.locationID || null,
      activationStatusFilter: this.mapActivationFilterFromCriteria(criteria)
    });
    if (criteria.pickUpDateString) {
      const d = new Date(criteria.pickUpDateString);
      if (!isNaN(d.getTime())) {
        this.searchForm.patchValue({ pickUpDate: d });
      }
    }
    if (criteria.customerName || criteria.customerID) {
      this.customerPicker.setValue(
        { customerID: criteria.customerID, customerName: criteria.customerName || '' },
        { emitEvent: false }
      );
    }
    if (criteria.cityName || criteria.cityID) {
      this.cityPicker.setValue(
        { geoPointID: criteria.cityID, geoPointName: criteria.cityName || '' },
        { emitEvent: false }
      );
    }
    if (criteria.dutyType || criteria.packageTypeID) {
      this.dutyTypePicker.setValue(
        { packageTypeID: criteria.packageTypeID, packageType: criteria.dutyType || '' },
        { emitEvent: false }
      );
    }
    if (criteria.vehicle || criteria.vehicleID) {
      this.vehiclePicker.setValue(
        { vehicleID: criteria.vehicleID, vehicle: criteria.vehicle || '' },
        { emitEvent: false }
      );
    }
    if (criteria.locationName || criteria.locationID) {
      this.locationPicker.setValue(
        {
          organizationalEntityID: criteria.locationID,
          organizationalEntityName: criteria.locationName || ''
        },
        { emitEvent: false }
      );
    }
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
}
