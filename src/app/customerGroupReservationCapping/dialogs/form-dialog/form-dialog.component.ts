// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerGroupReservationCappingModel } from '../../customerGroupReservationCapping.model';
import { CustomerGroupReservationCappingService } from '../../customerGroupReservationCapping.service';
import { map, startWith } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { BulkSelectedCitiesDialogComponent } from '../bulk-selected-cities-dialog/bulk-selected-cities-dialog.component';
import { BulkSelectedVehiclesDialogComponent } from '../bulk-selected-vehicles-dialog/bulk-selected-vehicles-dialog.component';
import {
  CappingDuplicateCombination,
  CappingMessageDialogComponent
} from '../message-dialog/message-dialog.component';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerGroupReservationCappingModel;
  isLoading: boolean = false;
  saveDisabled: boolean = true;
  cappingTypeOptions: string[] = ['Hard Capping', 'Soft Capping'];

  public CityLists?: CityDropDown[] = [];
  existCityMessage: boolean = false;

  public PackageList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  packageTypeID: any;

  public VehicleList?: VehicleDropDown[] = [];
  vehicleID:any;
  cityFilterText = '';
  vehicleFilterText = '';
  CustomerGroupID: any;
  CustomerGroupName: any;
  cappingType: string;
  bulkIds: number[] = [];
  bulkRows: CustomerGroupReservationCappingModel[] = [];

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public advanceTableService: CustomerGroupReservationCappingService,
              private fb: FormBuilder,
              private matDialog: MatDialog,
  public _generalService:GeneralService)
  {
    this.CustomerGroupID=data.CustomerGroupID;
    this.CustomerGroupName=data.CustomerGroupName;
    this.action = data.action;
    if (this.action === 'bulk') {
      this.dialogTitle = 'Bulk Edit';
      this.bulkIds = data.bulkIds || [];
      this.bulkRows = data.bulkRows || [];
      this.advanceTable = this.bulkRows[0] || new CustomerGroupReservationCappingModel({});
      this.advanceTableForm = this.createContactForm();
      return;
    }
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Customer Group Reservation Capping';       
      this.advanceTable = data.advanceTable;
      this.cappingType = this.advanceTable.cappingType;
      this.packageTypeID = this.advanceTable.packageTypeID;
      this.vehicleID = this.advanceTable.vehicleID;
    }
    else 
    {
      this.dialogTitle = 'Customer Group Reservation Capping';
      this.advanceTable = new CustomerGroupReservationCappingModel({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerGroupReservationCappingID: [
        this.advanceTable.customerGroupReservationCappingID ??
        this.advanceTable.CustomerGroupReservationCappingID ??
        -1
      ],
      customerGroupID: [Number(this.CustomerGroupID) || 0],
      customerGroup: [this.CustomerGroupName],
      cityID: [this.action === 'add' ? [] : this.advanceTable.cityID],
      city: [this.action === 'bulk' ? this.getBulkDisplayValue('city') : this.advanceTable.city],
      packageTypeID: [this.advanceTable.packageTypeID],
      packageType: [this.action === 'bulk' ? this.getBulkDisplayValue('packageType') : this.advanceTable.packageType],
      cappingType: [
        this.action === 'bulk'
          ? this.getBulkDisplayValue('cappingType')
          : (this.advanceTable.cappingType || (this.action === 'add' ? 'Hard Capping' : null)),
        this.action === 'bulk' ? [] : Validators.required
      ],
      vehicleID: [
        this.action === 'add' ? [] : this.advanceTable.vehicleID,
        this.action === 'add' ? Validators.required : []
      ],
      vehicle: [this.action === 'bulk' ? this.getBulkDisplayValue('vehicle') : this.advanceTable.vehicle],
      mondayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.mondayCap)],
      tuesdayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.tuesdayCap)],
      wednesdayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.wednesdayCap)],
      thursdayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.thursdayCap)],
      fridayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.fridayCap)],
      saturdayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.saturdayCap)],
      sundayCap: [this.action === 'bulk' ? null : this.formatCapValue(this.advanceTable?.sundayCap)],
      activationStatus: [this.normalizeActivationStatus(this.advanceTable.activationStatus)]
    });
  }

  private normalizeActivationStatus(value: any): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
  }

  private formatCapValue(value: any): number | null {
    if (value === '' || value === undefined || value === null) {
      return null;
    }
    return value;
  }

  private parseCapInput(value: any): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (Number.isNaN(num)) {
      return null;
    }
    return num;
  }

  private applyCapValuesToForm(): void {
    const capFields = ['mondayCap', 'tuesdayCap', 'wednesdayCap', 'thursdayCap', 'fridayCap', 'saturdayCap', 'sundayCap'];
    const patch: any = {};
    capFields.forEach(field => {
      patch[field] = this.parseCapInput(this.advanceTableForm.get(field).value);
    });
    this.advanceTableForm.patchValue(patch);
  }

  private getCityNameFromRow(row: CustomerGroupReservationCappingModel): string {
    const name =
      row?.city ??
      row?.City ??
      row?.geoPointName ??
      row?.GeoPointName ??
      '';
    return String(name).trim();
  }

  getUniqueBulkCityNames(): string[] {
    if (!this.bulkRows?.length) {
      return [];
    }
    const seen = new Set<string>();
    const names: string[] = [];
    for (const row of this.bulkRows) {
      const name = this.getCityNameFromRow(row);
      if (!name) {
        continue;
      }
      const key = name.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      names.push(name);
    }
    return names.sort((a, b) => a.localeCompare(b));
  }

  openViewSelectedCities(): void {
    this.matDialog.open(BulkSelectedCitiesDialogComponent, {
      width: '440px',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: { cities: this.getUniqueBulkCityNames() }
    });
  }

  private getVehicleNameFromRow(row: CustomerGroupReservationCappingModel): string {
    const name = row?.vehicle ?? row?.Vehicle ?? '';
    return String(name).trim();
  }

  getUniqueBulkVehicleNames(): string[] {
    if (!this.bulkRows?.length) {
      return [];
    }
    const seen = new Set<string>();
    const names: string[] = [];
    for (const row of this.bulkRows) {
      const name = this.getVehicleNameFromRow(row);
      if (!name) {
        continue;
      }
      const key = name.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      names.push(name);
    }
    return names.sort((a, b) => a.localeCompare(b));
  }

  openViewSelectedVehicles(): void {
    this.matDialog.open(BulkSelectedVehiclesDialogComponent, {
      width: '440px',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: { vehicles: this.getUniqueBulkVehicleNames() }
    });
  }

  getBulkDisplayValue(field: string): string {
    if (!this.bulkRows?.length) {
      return '';
    }
    const values = this.bulkRows
      .map((row) => row?.[field])
      .filter((value) => value !== null && value !== undefined && value !== '');
    const unique = [...new Set(values.map((value) => String(value)))];
    if (!unique.length) {
      return '';
    }
    if (unique.length === 1) {
      return unique[0];
    }
    return `Multiple (${this.bulkRows.length} records)`;
  }

  getBulkActivationDisplay(): string {
    if (!this.bulkRows?.length) {
      return '';
    }
    const labels = this.bulkRows.map((row) => (row.activationStatus === true ? 'Active' : 'Deactive'));
    const unique = [...new Set(labels)];
    return unique.length === 1 ? unique[0] : 'Multiple';
  }

  private disableBulkReadOnlyFields(): void {
    const capFields = ['mondayCap', 'tuesdayCap', 'wednesdayCap', 'thursdayCap', 'fridayCap', 'saturdayCap', 'sundayCap'];
    Object.keys(this.advanceTableForm.controls).forEach((key) => {
      if (!capFields.includes(key)) {
        this.advanceTableForm.get(key)?.disable({ emitEvent: false });
      }
    });
  }

  public ngOnInit(): void
  {
    if (this.action === 'bulk') {
      this.disableBulkReadOnlyFields();
      return;
    }
    this.InitPackageType();
    this.InitVehicle();
    if (this.action === 'edit') {
      this.advanceTableForm.controls['cappingType'].disable();
      this.advanceTableForm.controls['packageType'].disable();
      this.advanceTableForm.controls['vehicleID'].clearValidators();
      this.advanceTableForm.controls['vehicleID'].disable();
      this.advanceTableForm.controls['vehicle'].disable();
      this.advanceTableForm.controls['city'].disable();
      this.advanceTableForm.controls['activationStatus'].disable();
    } else {
      this.cappingType = this.advanceTableForm.get('cappingType')?.value || 'Hard Capping';
      this.advanceTableForm.controls['cappingType'].valueChanges.subscribe(value => {
        this.cappingType = value;
        this.refreshCityList();
      });
    }
  }

  refreshCityList(): void {
    if (this.action !== 'add') {
      return;
    }
    const capType = this.advanceTableForm.get('cappingType').value;
    const pkgId = this.packageTypeID || this.advanceTableForm.get('packageTypeID').value;
    const vehicleIds = this.normalizeIdArray(this.advanceTableForm.get('vehicleID')?.value);
    if (this.CustomerGroupID && pkgId && vehicleIds.length && capType) {
      this.loadCitiesForVehicles(this.CustomerGroupID, pkgId, vehicleIds, capType);
    }
  }

  private loadCitiesForVehicles(customerGroupID: number, packageTypeID: number, vehicleIds: number[], cappingType: string): void {
    const requests = vehicleIds.map((vehicleID) =>
      this.advanceTableService.GetCityForCustomerGroupCapping(customerGroupID, packageTypeID, vehicleID, cappingType)
    );
    forkJoin(requests).subscribe(
      (results) => {
        const merged = new Map<number, CityDropDown>();
        (results || []).forEach((data) => {
          (data || []).forEach((city) => {
            const normalized = this.normalizeCityDropDown(city);
            if (normalized.geoPointID > 0) {
              merged.set(normalized.geoPointID, normalized);
            }
          });
        });
        this.CityLists = Array.from(merged.values()).sort((a, b) =>
          (a.geoPointName || '').localeCompare(b.geoPointName || '')
        );
        this.existCityMessage = this.CityLists.length === 0;
      },
      () => {
        this.CityLists = [];
        this.existCityMessage = true;
      }
    );
  }

  private getFirstSelectedVehicleId(): number {
    const raw = this.advanceTableForm.get('vehicleID')?.value;
    if (Array.isArray(raw) && raw.length > 0) {
      return Number(raw[0]);
    }
    const single = Number(this.vehicleID ?? raw);
    return Number.isFinite(single) && single > 0 ? single : 0;
  }

  get filteredCityList(): CityDropDown[] {
    const term = (this.cityFilterText || '').trim().toLowerCase();
    const list = this.CityLists || [];
    if (!term) {
      return list;
    }
    return list.filter((city) => (city.geoPointName || '').toLowerCase().includes(term));
  }

  get filteredVehicleList(): VehicleDropDown[] {
    const term = (this.vehicleFilterText || '').trim().toLowerCase();
    const list = this.VehicleList || [];
    if (!term) {
      return list;
    }
    return list.filter((option) => this.getVehicleOptionName(option).toLowerCase().includes(term));
  }

  onCityPanelOpen(opened: boolean): void {
    if (!opened) {
      this.cityFilterText = '';
    }
  }

  onVehiclePanelOpen(opened: boolean): void {
    if (!opened) {
      this.vehicleFilterText = '';
    }
  }

  submit() {}

  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit' || this.action==='bulk')
    {
      this.dialogRef.close();
    }
  }

  public BulkPut(): void {
    this.applyCapValuesToForm();
    const caps = {
      mondayCap: this.parseCapInput(this.advanceTableForm.get('mondayCap').value),
      tuesdayCap: this.parseCapInput(this.advanceTableForm.get('tuesdayCap').value),
      wednesdayCap: this.parseCapInput(this.advanceTableForm.get('wednesdayCap').value),
      thursdayCap: this.parseCapInput(this.advanceTableForm.get('thursdayCap').value),
      fridayCap: this.parseCapInput(this.advanceTableForm.get('fridayCap').value),
      saturdayCap: this.parseCapInput(this.advanceTableForm.get('saturdayCap').value),
      sundayCap: this.parseCapInput(this.advanceTableForm.get('sundayCap').value)
    };
    const hasAnyCap = Object.values(caps).some((v) => v !== null && v !== undefined);
    if (!hasAnyCap) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.saveDisabled = true;
      return;
    }
    const invalidCap = Object.values(caps).some((v) => v !== null && v !== undefined && Number(v) < 0);
    if (invalidCap) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.saveDisabled = true;
      return;
    }
    this.advanceTableService.bulkUpdate({
      ids: this.bulkIds,
      ...caps
    }).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerGroupReservationCappingBulkUpdate:CustomerGroupReservationCappingView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  private resolveRecordId(): number {
    const row = this.advanceTable || {};
    const id =
      row.customerGroupReservationCappingID ??
      row.CustomerGroupReservationCappingID ??
      this.advanceTableForm.get('customerGroupReservationCappingID')?.value;
    const numericId = Number(id);
    return Number.isFinite(numericId) ? numericId : 0;
  }

  private resolvePackageTypeId(packageTypeName: string): number {
    const fromForm = Number(this.advanceTableForm.get('packageTypeID')?.value);
    if (Number.isFinite(fromForm) && fromForm > 0) {
      return fromForm;
    }
    const match = this.PackageList?.find(
      (p) => p.packageType?.toLowerCase() === (packageTypeName || '').toLowerCase()
    );
    return match?.packageTypeID ? Number(match.packageTypeID) : 0;
  }

  private normalizeIdArray(value: any): number[] {
    if (!Array.isArray(value)) {
      const single = Number(value);
      return Number.isFinite(single) && single > 0 ? [single] : [];
    }
    return value.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
  }

  private buildPayload(): any {
    this.applyCapValuesToForm();
    const raw = this.advanceTableForm.getRawValue();
    raw.customerGroupID = Number(this.CustomerGroupID ?? raw.customerGroupID);
    raw.packageTypeID = this.resolvePackageTypeId(raw.packageType);
    if (!raw.cappingType) {
      raw.cappingType = null;
    }
    this.advanceTableForm.patchValue({
      packageTypeID: raw.packageTypeID
    });
    if (this.action === 'add') {
      raw.cityID = this.normalizeIdArray(raw.cityID);
      raw.vehicleID = this.normalizeIdArray(raw.vehicleID);
      raw.activationStatus = raw.activationStatus !== false && raw.activationStatus !== 'false';
    }
    if (this.action === 'edit') {
      raw.customerGroupReservationCappingID = this.resolveRecordId();
      raw.activationStatus = this.normalizeActivationStatus(raw.activationStatus);
    }
    return raw;
  }

  public Post(): void {
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.saveDisabled = true;
      return;
    }
    const payload = this.buildPayload();
    if (!payload.customerGroupID || payload.customerGroupID <= 0) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.saveDisabled = true;
      return;
    }
    if (!payload.packageTypeID || !payload.vehicleID?.length) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.saveDisabled = true;
      return;
    }
    if (!payload.cityID?.length) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.saveDisabled = true;
      return;
    }
    this.advanceTableService.add(payload).subscribe(
      response => {
        const savedId = Number(
          response?.customerGroupReservationCappingID ?? response?.CustomerGroupReservationCappingID
        );
        if (response?.activationStatus === 'Duplicate Data' || response?.message?.includes?.('Duplicate')) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
          return;
        }
        if (!Number.isFinite(savedId) || savedId <= 0) {
          this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
          this.saveDisabled = true;
          return;
        }
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerGroupReservationCappingCreate:CustomerGroupReservationCappingView:Success');
        this.saveDisabled = true;
      },
      error => {
        if (error?.status === 409) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        } else {
          this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
        }
        this.saveDisabled = true;
      }
    );
  }
  
  private mapConflictCombinations(items: any[]): CappingDuplicateCombination[] {
    return (items || []).map((item) => ({
      cappingType: (item?.cappingType ?? item?.CappingType ?? '').toString(),
      packageType: (item?.packageType ?? item?.PackageType ?? '').toString(),
      city: (item?.city ?? item?.City ?? '').toString(),
      vehicle: (item?.vehicle ?? item?.Vehicle ?? '').toString()
    }));
  }

  private showActiveRecordExistsMessage(combinations: CappingDuplicateCombination[]): void {
    this.matDialog.open(CappingMessageDialogComponent, {
      width: '560px',
      panelClass: 'cg-cap-message-dialog',
      autoFocus: false,
      data: {
        title: 'Activate Record',
        message:
          'The same existing record is already available as active. You cannot activate this record until the active one is deactivated.',
        duplicateCombinations: combinations,
        combinationListHeading: 'Combination(s):'
      }
    });
  }

  private submitUpdate(payload: any): void {
    this.advanceTableService.update(payload).subscribe(
      (response) => {
        if (
          response &&
          response.activationStatus &&
          typeof response.activationStatus === 'string' &&
          response.activationStatus.includes('Duplicate')
        ) {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        } else {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerGroupReservationCappingUpdate:CustomerGroupReservationCappingView:Success');
          this.saveDisabled = true;
        }
      },
      (error) => {
        const message = error?.error?.toString?.() ?? error?.error ?? '';
        if (typeof message === 'string' && message.includes('ActiveRecordExists')) {
          this.advanceTableService.bulkActivateCheck([payload.customerGroupReservationCappingID]).subscribe({
            next: (retry) => {
              const conflicts = this.mapConflictCombinations(retry?.conflicts);
              if (conflicts.length) {
                this.showActiveRecordExistsMessage(conflicts);
              } else {
                this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
              }
            },
            error: () => {
              this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
            }
          });
        } else {
          this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
        }
        this.saveDisabled = true;
      }
    );
  }

  public Put(): void {
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.saveDisabled = true;
      return;
    }
    const payload = this.buildPayload();
    if (!payload.customerGroupReservationCappingID) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.saveDisabled = true;
      return;
    }
    if (payload.activationStatus === true) {
      this.advanceTableService.bulkActivateCheck([payload.customerGroupReservationCappingID]).subscribe({
        next: (checkResult) => {
          const conflicts = this.mapConflictCombinations(checkResult?.conflicts);
          if (conflicts.length) {
            this.showActiveRecordExistsMessage(conflicts);
            this.saveDisabled = true;
            return;
          }
          this.submitUpdate(payload);
        },
        error: () => {
          this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
          this.saveDisabled = true;
        }
      });
      return;
    }
    this.submitUpdate(payload);
  }

  public confirmAdd(): void 
  {
    this.saveDisabled = false;
    if (this.action === 'bulk') {
      this.BulkPut();
    } else if(this.action=="edit")
    {
      this.Put();
    }
    else
    {
      this.Post();
    }
  }

    packageTypeValidator(PackageList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PackageList.some(group => group.packageType.toLowerCase() === value);
        return match ? null : { packageTypeInvalid: true };
      };
    }
    InitPackageType()
    {
      this._generalService.GetPackgeType().subscribe(
      data=>
      {
        this.PackageList=data;
        this.advanceTableForm.controls['packageType'].setValidators([Validators.required,this.packageTypeValidator(this.PackageList)]);
        this.advanceTableForm.controls['packageType'].updateValueAndValidity();  
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
    }    
    private _filterPackageType(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PackageList.filter(
        data => 
        {
          return data.packageType.toLowerCase().includes(filterValue);
        }
      );
    }
    onPackageTypeSelected(selectedPackageType: string) 
    {
      const selectedPackage = this.PackageList?.find(data => data.packageType === selectedPackageType);    
      if (selectedPackage) 
      {
        this.getPackageTypeID(selectedPackage.packageTypeID);
      }
    }    
    getPackageTypeID(packageTypeID: any)
    {
      this.packageTypeID=packageTypeID;
      this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
      this.refreshCityList();
    }

    getVehicleOptionId(option: VehicleDropDown): number {
      return Number(option?.vehicleID ?? option?.VehicleID);
    }

    getVehicleOptionName(option: VehicleDropDown): string {
      return option?.vehicle ?? option?.Vehicle ?? '';
    }

    getCityOptionId(city: CityDropDown): number {
      return Number(city?.geoPointID ?? city?.GeoPointID);
    }

    getCityOptionName(city: CityDropDown): string {
      return city?.geoPointName ?? city?.GeoPointName ?? '';
    }

    InitVehicle()
    {
      this._generalService.GetVehicle().subscribe(
      data=>
      {
        this.VehicleList = data || [];
        if (this.action === 'add') {
          this.advanceTableForm.controls['vehicleID'].setValidators([
            Validators.required,
            this.nonEmptyArrayValidator()
          ]);
          this.advanceTableForm.controls['cityID'].setValidators([
            Validators.required,
            this.nonEmptyArrayValidator()
          ]);
          this.advanceTableForm.controls['vehicleID'].updateValueAndValidity();
          this.advanceTableForm.controls['cityID'].updateValueAndValidity();
        }
      });
    }

    nonEmptyArrayValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return Array.isArray(value) && value.length > 0 ? null : { required: true };
      };
    }

    onVehicleSelectionChange(): void
    {
      this.vehicleID = this.getFirstSelectedVehicleId();
      this.refreshCityList();
    }

    private normalizeCityDropDown(city: any): CityDropDown {
      return {
        geoPointID: Number(city?.geoPointID ?? city?.GeoPointID ?? -1),
        geoPointName: city?.geoPointName ?? city?.GeoPointName ?? ''
      };
    }

    InitCity(CustomerGroupID,packageTypeID,vehicleID,cappingType) 
    {
      this.advanceTableService.GetCityForCustomerGroupCapping(CustomerGroupID,packageTypeID,vehicleID,cappingType).subscribe(
        data => {
          const list = (data || []).map((c) => this.normalizeCityDropDown(c)).filter((c) => c.geoPointID > 0);
          if(list.length)
          {
            this.CityLists = list;
            this.existCityMessage = false;
          }
          else
          {
            this.CityLists = [];
            this.existCityMessage=true;
          }
        },
        error => {
          console.error('Error fetching cities:', error);
        });
    }
}
