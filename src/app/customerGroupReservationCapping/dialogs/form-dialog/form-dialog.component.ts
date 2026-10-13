// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  CappingMessageDialogComponent,
  CappingMessageDialogVariant
} from '../message-dialog/message-dialog.component';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerGroupReservationCappingModel } from '../../customerGroupReservationCapping.model';
import { CustomerGroupReservationCappingService } from '../../customerGroupReservationCapping.service';
import { finalize, map, startWith } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';

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
  CustomerGroupID: any;
  CustomerGroupName: any;
  cappingType: string;
  private readonly softCappingExistsMessage = 'Record with Soft Capping is already Exist.';

  constructor(public dialogRef: MatDialogRef<FormDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              public advanceTableService: CustomerGroupReservationCappingService,
              private fb: FormBuilder,
              private messageDialog: MatDialog,
  public _generalService:GeneralService)
  {
    this.CustomerGroupID=data.CustomerGroupID;
    this.CustomerGroupName=data.CustomerGroupName;
    this.action = data.action;
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
      this.advanceTable.cappingType = 'Hard Capping';
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
      customerGroupID: [this.CustomerGroupID],
      customerGroup: [this.CustomerGroupName],
      cityID: [this.advanceTable.cityID],
      city: [this.advanceTable.city],
      packageTypeID: [this.advanceTable.packageTypeID],
      packageType: [this.advanceTable.packageType],
      cappingType: [this.advanceTable.cappingType || 'Hard Capping', Validators.required],
      vehicleID: [this.action === 'add' ? [] : this.advanceTable.vehicleID, Validators.required],
      vehicle: [this.advanceTable.vehicle],
      mondayCap: [this.formatCapValue(this.advanceTable?.mondayCap)],
      tuesdayCap: [this.formatCapValue(this.advanceTable?.tuesdayCap)],
      wednesdayCap: [this.formatCapValue(this.advanceTable?.wednesdayCap)],
      thursdayCap: [this.formatCapValue(this.advanceTable?.thursdayCap)],
      fridayCap: [this.formatCapValue(this.advanceTable?.fridayCap)],
      saturdayCap: [this.formatCapValue(this.advanceTable?.saturdayCap)],      
      sundayCap: [this.formatCapValue(this.advanceTable?.sundayCap)],
      activationStatus: [this.advanceTable.activationStatus]
    });
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

  public ngOnInit(): void
  {
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
      this.advanceTableForm.controls['cappingType'].valueChanges.subscribe(value => {
        this.cappingType = value;
        this.refreshCityList();
      });
      this.advanceTableForm.controls['vehicleID'].valueChanges.subscribe(() => {
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
    const vehicleSelection = this.advanceTableForm.get('vehicleID').value;
    const vehId = Array.isArray(vehicleSelection) && vehicleSelection.length > 0
      ? vehicleSelection[0]
      : (this.vehicleID || vehicleSelection);
    if (this.CustomerGroupID && pkgId && vehId && capType) {
      this.InitCity(this.CustomerGroupID, pkgId, vehId, capType);
    }
  }

  submit() {}

  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
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

  private resolveVehicleId(vehicleName: string): number {
    const fromForm = Number(this.advanceTableForm.get('vehicleID')?.value);
    if (Number.isFinite(fromForm) && fromForm > 0) {
      return fromForm;
    }
    const match = this.VehicleList?.find(
      (v) => v.vehicle?.toLowerCase() === (vehicleName || '').toLowerCase()
    );
    const id = match?.vehicleID ?? match?.VehicleID;
    return id ? Number(id) : 0;
  }

  private buildPayload(): any {
    this.applyCapValuesToForm();
    const raw = this.advanceTableForm.getRawValue();
    raw.customerGroupID = Number(raw.customerGroupID);
    raw.packageTypeID = this.resolvePackageTypeId(raw.packageType);
    if (this.action === 'add') {
      raw.vehicleID = Array.isArray(raw.vehicleID) ? raw.vehicleID.map((id) => Number(id)).filter((id) => id > 0) : [];
      raw.cityID = Array.isArray(raw.cityID) ? raw.cityID.map((id) => Number(id)).filter((id) => id > 0) : [];
    } else {
      raw.vehicleID = Number(raw.vehicleID) || this.resolveVehicleId(raw.vehicle);
    }
    this.advanceTableForm.patchValue({
      packageTypeID: raw.packageTypeID
    });
    if (this.action === 'edit') {
      raw.customerGroupReservationCappingID = this.resolveRecordId();
    }
    return raw;
  }

  private stopSaveLoading(): void {
    this.saveDisabled = true;
  }

  private showMessagePopup(
    message: string,
    title: string = 'Message',
    variant: CappingMessageDialogVariant = 'info'
  ): void {
    this.stopSaveLoading();
    this.messageDialog.open(CappingMessageDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      panelClass: 'capping-message-dialog-panel',
      disableClose: true,
      autoFocus: false,
      data: { title, message, variant }
    });
  }

  private showSoftCappingExistsPopup(): void {
    this.showMessagePopup(
      this.softCappingExistsMessage,
      'Customer Group Reservation Capping',
      'warning'
    );
  }

  /** ErrorInterceptor passes a plain string, not HttpErrorResponse. */
  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    const body = error?.error;
    if (typeof body === 'string') {
      return body;
    }
    if (body?.message) {
      return String(body.message);
    }
    if (body?.title) {
      return String(body.title);
    }
    return error?.message ? String(error.message) : '';
  }

  private isSoftCappingConflictError(error: any): boolean {
    return this.getErrorMessage(error).includes(this.softCappingExistsMessage);
  }

  private isSoftCappingConflictResponse(response: any): boolean {
    const status = response?.activationStatus;
    return typeof status === 'string' && status.includes(this.softCappingExistsMessage);
  }

  private handleSaveFailure(error: any, fallbackNotify: boolean = true): void {
    const msg = this.getErrorMessage(error);
    if (msg.includes(this.softCappingExistsMessage)) {
      this.showSoftCappingExistsPopup();
    } else if (msg) {
      this.showMessagePopup(msg, 'Customer Group Reservation Capping', 'error');
    } else if (fallbackNotify) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
    }
    this.stopSaveLoading();
  }

  private validateHardAgainstSoftCapping(payload: any): Observable<boolean> {
    if (payload.cappingType !== 'Hard Capping') {
      return of(true);
    }
    const checks: Observable<{ exists: boolean }>[] = [];
    payload.vehicleID.forEach((vehicleId: number) => {
      checks.push(
        this.advanceTableService.existsSoftCappingForCustomerGroupAndVehicle(
          payload.customerGroupID,
          vehicleId
        )
      );
    });
    if (checks.length === 0) {
      return of(true);
    }
    return new Observable((observer) => {
      forkJoin(checks).subscribe({
        next: (results) => {
          const conflict = results.some((r) => r?.exists === true || r?.Exists === true);
          if (conflict) {
            this.showSoftCappingExistsPopup();
            observer.next(false);
          } else {
            observer.next(true);
          }
          observer.complete();
        },
        error: () => {
          observer.next(true);
          observer.complete();
        }
      });
    });
  }

  public Post(): void {
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.stopSaveLoading();
      return;
    }
    const payload = this.buildPayload();
    if (!payload.packageTypeID || !payload.vehicleID || payload.vehicleID.length === 0) {
      this.showMessagePopup(
        'Please select a valid Package Type and at least one Vehicle.',
        'Validation',
        'warning'
      );
      this.stopSaveLoading();
      return;
    }
    if (!payload.cityID || payload.cityID.length === 0) {
      this.showMessagePopup('Please select at least one City.', 'Validation', 'warning');
      this.stopSaveLoading();
      return;
    }
    this.validateHardAgainstSoftCapping(payload).subscribe((canProceed) => {
      if (!canProceed) {
        this.stopSaveLoading();
        return;
      }
      this.submitCreate(payload);
    });
  }

  private submitCreate(payload: any): void {
    this.saveDisabled = false;
    this.advanceTableService.add(payload).pipe(
      finalize(() => this.stopSaveLoading())
    ).subscribe(
      response => {
        if (this.isSoftCappingConflictResponse(response)) {
          this.showSoftCappingExistsPopup();
          return;
        }
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        }
        else
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerGroupReservationCappingCreate:CustomerGroupReservationCappingView:Success');
        } 
      },
      error => {
        this.handleSaveFailure(error, true);
      }
    );
  }
  
  public Put(): void {
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.stopSaveLoading();
      return;
    }
    const payload = this.buildPayload();
    if (!payload.customerGroupReservationCappingID) {
      this._generalService.sendUpdate('CustomerGroupReservationCappingAll:CustomerGroupReservationCappingView:Failure');
      this.stopSaveLoading();
      return;
    }
    this.saveDisabled = false;
    this.advanceTableService.update(payload).pipe(
      finalize(() => this.stopSaveLoading())
    ).subscribe(
      response => {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
        }
        else
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerGroupReservationCappingUpdate:CustomerGroupReservationCappingView:Success');
        }
      },
      error => {
        this.handleSaveFailure(error, true);
      }
    );
  }

  public confirmAdd(): void 
  {
    if(this.action=="edit")
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

    InitVehicle()
    {
      this._generalService.GetVehicle().subscribe(
      data=>
      {
        this.VehicleList = data || [];
        if (this.action === 'add') {
          this.advanceTableForm.controls['vehicleID'].setValidators([Validators.required]);
          this.advanceTableForm.controls['vehicleID'].updateValueAndValidity();
        }
      });
    }

    InitCity(CustomerGroupID,packageTypeID,vehicleID,cappingType) 
    {
      this.advanceTableService.GetCityForCustomerGroupCapping(CustomerGroupID,packageTypeID,vehicleID,cappingType).subscribe(
        data => {
          if(data)
          {
            this.CityLists = data;
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
