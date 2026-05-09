// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DriverInventoryAssociationService } from '../../driverInventoryAssociation.service';
import { DriverDropDownForAllotment } from '../../driverInventoryAssociation.model';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { DriverModel } from 'src/app/CarAndDriverAllotment/CarAndDriverAllotment.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-updateDriverMobile',
  templateUrl: './updateDriverMobile.component.html',
  styleUrls: ['./updateDriverMobile.component.sass'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class UpdateDriverMobileComponent {
  saveDisabled: boolean = true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverModel;
  AllotmentID: any;
  AllotmentStatus: any;
  status: string = '';
  buttonDisabled: boolean = false;
  normalizedStatus: string = '';
  filteredDriverListOptions: Observable<DriverDropDownForAllotment[]>;
  public AnotherDriverList?: DriverDropDownForAllotment[] = [];
  filteredCountryCodesOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodeList?: CountryCodeDropDown[] = [];

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateDriverMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public driverInventoryAssociationService: DriverInventoryAssociationService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;

    this.status = data?.status ?? data?.allotmentStatus ?? '';
    this.normalizedStatus = (this.status || '').toLowerCase().trim();
    const allowedStatuses = ['changes allow', 'alloted', 'allotted'];
    this.buttonDisabled = this.normalizedStatus
      ? !allowedStatuses.includes(this.normalizedStatus)
      : false;


    if (this.action === 'edit') {
      this.dialogTitle = 'Update Driver Mobile';
      this.advanceTable = data.advanceTable;

    } else {
      this.dialogTitle = 'Update Driver Mobile';
      this.advanceTable = new DriverModel({});
    }

    this.advanceTableForm = this.createContactForm();
    this.AllotmentID = data.allotmentID;
    this.reservationID = data.reservationID;
    this.AllotmentStatus = data.allotmentStatus
  }
  formControl = new FormControl('',
    [
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
    return this.fb.group(
      {
        driverID: [this.advanceTable.driverID],
        driverName: [this.advanceTable.driverName],
        mobile1: [this.advanceTable.mobile1, [Validators.required]],
        countryCodes: ["+91"],

      });
  }
  ngOnInit(): void {
    this.InitCountryISDCodes();
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onCountryCodes(event: any): void {
    this.advanceTableForm.patchValue({ countryCodes: event.option.value });

  }

  countryTypeValidator(CountryCodesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountryCodesList.some(group => group.countryISDCode?.toLowerCase() === value);
      return match ? null : { countryTypeInvalid: true };
    };
  }
  InitCountryISDCodes() {
    this._generalService.GetCountryCodes().subscribe
      (
        data => {
          this.CountryCodeList = data;
          this.advanceTableForm.controls['countryCodes'].setValidators([Validators.required,
          this.countryTypesValidator(this.CountryCodeList)
          ]);
          this.advanceTableForm.controls['countryCodes'].updateValueAndValidity();
          this.filteredCountryCodesOptions = this.advanceTableForm.controls['countryCodes'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCountryCodes(value || ''))
          );
        }
      );
  }
  private _filterCountryCodes(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => {
        return customer.icon.toLowerCase().indexOf(filterValue) === 0 || customer.countryISOCode.toLowerCase().indexOf(filterValue) === 0 || customer.countryISDCode.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  countryTypesValidator(CountryCodeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountryCodeList.some(group => group.countryISDCode?.toLowerCase() === value);
      return match ? null : { countryTypesInvalid: true };
    };
  }

  //---------AttachAnotherDriver-----------------
  onKeyupDriverName() {
    var Prefix = this.advanceTableForm.get("driverName").value;
    if (Prefix.length < 3) {
      this.AnotherDriverList = [];
      return;
    }
    this.driverInventoryAssociationService.GetAllDriverList(Prefix).subscribe(
      data => {
        this.AnotherDriverList = data;
        this.advanceTableForm.controls['driverName'].setValidators([Validators.required,
        this.driverListTypeValidator(this.AnotherDriverList)
        ]);
        this.advanceTableForm.controls['driverName'].updateValueAndValidity();

        this.filteredDriverListOptions = this.advanceTableForm.controls['driverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterAttachAnotherDriver(value || ''))
        )
      });;
  }
  private _asSearchString(v: unknown): string {
    return v == null || v === undefined ? '' : String(v);
  }

  /** Digits only for phone-style matching. */
  private _phoneDigits(s: string): string {
    return (s || '').replace(/\D/g, '');
  }

  private _attachAnotherRowMatches(
    customer: DriverDropDownForAllotment,
    filterValue: string,
    filterDigits: string
  ): boolean {
    const f = (v: unknown) => this._asSearchString(v).toLowerCase();
    if (f(customer.driverName).includes(filterValue)) {
      return true;
    }
    if (f(customer.supplier).includes(filterValue)) {
      return true;
    }
    if (f(customer.supplierType).includes(filterValue)) {
      return true;
    }
    if (f(customer.ownedSupplier).includes(filterValue)) {
      return true;
    }
    const mobile = f(customer.mobile1);
    if (mobile.includes(filterValue)) {
      return true;
    }
    if (filterDigits.length >= 3) {
      const mobileD = this._phoneDigits(this._asSearchString(customer.mobile1));
      if (mobileD.includes(filterDigits)) {
        return true;
      }
    }
    return false;
  }

  private _filterAttachAnotherDriver(value: string): any {
    const raw = (value || '').trim();
    const filterValue = raw.toLowerCase();
    // if (filterValue.length < 3) {
    //   return [];
    // }
    const filterDigits = this._phoneDigits(raw);

    return (this.AnotherDriverList || []).filter((customer) =>
      this._attachAnotherRowMatches(customer, filterValue, filterDigits)
    );
  }

  OnDriverSelected(selectedDriver: string) {
    const DriverName = this.AnotherDriverList.find(
      data => data.driverName + '-' + data.mobile1 + '-' + data.supplier + '-' + data.supplierType + '-' + data.ownedSupplier === selectedDriver
    );
    if (selectedDriver) {
      this.getDriverlistID(DriverName.driverID, DriverName.mobile1);
    }
  }

  getDriverlistID(driverID: any, mobile1: any) {
    this.driverID = driverID;
    this.advanceTableForm.patchValue({ driverID: this.driverID });
    this.advanceTableForm.patchValue({ mobile1: mobile1.split('-')[1] });
  }

  driverListTypeValidator(AnotherDriverList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = AnotherDriverList.some(group => ((group.driverName + '-' + group.mobile1 + '-' + group.supplier + '-' + group.supplierType + '-' + group.ownedSupplier).toLowerCase()) === value);
      return match ? null : { driverInvalid: true };
    };
  }



  submit() {
    // emppty stuff
  }


  public Put(): void {
    const phone1 = this.advanceTableForm.get('countryCodes').value;
    const phone2 = this.advanceTableForm.get('mobile1').value;
    const countryCodes = phone1.split('+')[1];
    const mobile1 = countryCodes + '-' + phone2;
    this.advanceTableForm.patchValue({ mobile1: mobile1 });
    this.driverInventoryAssociationService.updateDriverMobile(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {

          this.showNotification(
            'snackbar-success',
            'Driver Mobile Updated...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          this.dialogRef.close();
        },
        error => {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
        }
      )
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public confirmAdd(): void {
    this.saveDisabled = false;
    this.Put();
  }


}


