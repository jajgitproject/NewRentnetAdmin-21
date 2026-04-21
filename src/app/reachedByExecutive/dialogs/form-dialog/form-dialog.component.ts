// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { ReachedByExecutiveService } from '../../reachedByExecutive.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ReachedByExecutive, DateTimeKMModel } from '../../reachedByExecutive.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Address } from '@compat/google-places-shim-objects/address';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { FormDialogComponent as FetchDataRBE } from 'src/app/fetchDataRBE/dialogs/form-dialog/form-dialog.component';
import { FetchDataFromGPSComponent } from '../fetch-data-from-gps/fetch-data-from-gps.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { GoogleAddressDropDown } from 'src/app/reservation/googleAddressDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { ReservationService } from 'src/app/reservation/reservation.service';
import moment from 'moment';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent {
  @ViewChild('googlePlacesDropdown') googlePlacesDropdown: TemplateRef<any>;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ReachedByExecutive;
  addressString: string;
  options = {
    componentRestrictions: { country: 'IN' }
  };

  isGoogleAddressEnabled: boolean = true;
  employeeDataSource: EmployeeDropDown[] | [];
  dutySlipList: any;
  dutySlipData: ReachedByExecutive[] = [];
  allotmentID: number;
  dutySlipID: any;
  AllotmentID: any;
  dataSource: ReachedByExecutive[] | [];
  employeeID: number;
  driverName: any;
  regno: any;
  reservationID: any;
  registrationNumber: any;
  pickupKm: any;
  pickupLatitude: any;
  dutyslip: any;
  dutyslipByDriverID: any;
  reportingToGuestEntry: boolean;
  reportingToGuestEntryMethod: string;
  autoComplete: any;
  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];
  ifBlock = true;
  indeterminate = false;
  labelPosition: 'before' | 'before' = 'before';
  reportingToGuestAddressString: any;
  saveDisabled: boolean = true;
  tab: any;
  dutySlipByDriverID: any;
  dataSourceForValidation:DateTimeKMModel[]|[];
  locationOutDate: Date;
  locationOutTime: Date;
  locationOutKm: number;
  exactDate: any;
  pickupTime: any;
  actualDate: Date;
  actualTime: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReachedByExecutiveService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public reservationService: ReservationService,
    public _generalService: GeneralService
  ) {
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    this.allotmentID = data.allotmentID;
    this.driverName = data.driverName;
    this.regno = data.regno;
    this.reservationID = data.reservationID;
    this.dutySlipID = data.dutySlipID;
    this.dutySlipByDriverID = data.dutySlipByDriverID;
    this.tab = data.tab;
    this.actualDate = new Date(data.rowRecord.pickup.pickupDate);
    this.actualTime = new Date(data.rowRecord.pickup.pickupTime);
    //this.actualTime = pickupTime.setMinutes(pickupTime.getMinutes() - 20);
    
    this.advanceTableForm = this.createContactForm();
    // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    // {
    //   this.isSaveAllowed = false;
    // } 
    // else
    // {
    //   this.isSaveAllowed = true;
    // }
const status = (this.verifyDutyStatusAndCacellationStatus ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z\s]/g, ''); // 👈 ye line important hai

this.isSaveAllowed = status === 'changes allow';
  }

  getEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = data;
        this.advanceTableForm.controls["executive"].disable();
        this.advanceTableForm.patchValue({ executive: this.employeeDataSource[0].firstName + " " + this.employeeDataSource[0].lastName });
        this.advanceTableForm.patchValue({ reportingToGuestEntryExecutiveID: this.employeeDataSource[0].employeeID });
      }
    );
  }

  fetchData() {
    const dialogRef = this.dialog.open(FetchDataRBE, {
      width: '70%',
      height: '80%',
      data: {
        action: 'add',
        reservationID: this.reservationID
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {

        this.advanceTableForm.patchValue({ reportingToGuestAddressString: res.data.pickupAddressString });
        this.advanceTableForm.patchValue({ reportingToGuestKM: res.data.pickupKM });
        this.advanceTableForm.patchValue({ latitude: res.data.pickupLatitude });
        this.advanceTableForm.patchValue({ longitude: res.data.pickupLongitude });
      }
    })
  }

  fetchDataGPS() {
    const dialogRef = this.dialog.open(FetchDataFromGPSComponent, {
      data: {
        action: 'add',
        reservationID: this.reservationID
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== undefined) {
        
        this.advanceTableForm.patchValue({ reportingToGuestAddressString: res.data[0].pickupAddressString });
        this.advanceTableForm.patchValue({ reportingToGuestKM: res.data[0].pickupKM });
        this.advanceTableForm.patchValue({ latitude: res.data[0].pickupLatitude });
        this.advanceTableForm.patchValue({ longitude: res.data[0].pickupLongitude });
      }
    })
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      dutySlipID: [''],
      dutySlipByDriverID: [''],
      reportingToGuestEntryExecutiveID: [''],
      reportingToGuestEntryMethod: [''],
      executive: [''],
      reportingToGuestDate: [''],
      reportingToGuestTime: [new Date()],
     reportingToGuestAddressString: [
  '',
  [Validators.required, this.googleAddressValidator()]
],


      latitude: [''],
      longitude: [''],
      reportingToGuestKM: [''],
      firstName: [''],
      lastName: [''],
      reportingToGuestLatLong: [''],

      reportingToGuestDateByApp: [new Date()],
      reportingToGuestTimeByApp: [new Date()],
      reportingToGuestAddressStringByApp: [''],
      latitudeByApp: [''],
      longitudeByApp: [''],
      reportingToGuestKMByApp: [''],
      googleAddresses: [''],
      reportingToGuestLatLongByApp: ['']
    });
  }

  googlePlacesForm = this.fb.group({
    geoPointID: [''],
    geoLocation: [''],
    latitude: [''],
    longitude: [''],
    geoSearchString: [''],
    geoPointName: [''],
    googlePlacesID: [''],
    activationStatus: ['']
  })
onAddressTyping() {

  this.advanceTableForm.patchValue({
    latitude: null,
    longitude: null
  });

  const control = this.advanceTableForm.get('reportingToGuestAddressString');

  control?.markAsTouched(); // ADD THIS
  control?.updateValueAndValidity();
}



  googleAddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) return null;

    const latitude = control.parent.get('latitude')?.value;
    const value = control.value;

    if (!value) return null; // required handle karega

    if (!latitude) {
      return { invalidAddress: true };
    }

    return null;
  };
}


  selectRadioButton(event: any) {
    const selectedValue = event.value;
    this.advanceTableForm.patchValue({ reportingToGuestEntryMethod: selectedValue });
    if (selectedValue === 'Manual') {
      this.advanceTableForm.controls["reportingToGuestDate"].enable();
      this.advanceTableForm.controls["reportingToGuestTime"].enable();
      this.advanceTableForm.controls["reportingToGuestKM"].enable();
      this.advanceTableForm.controls["reportingToGuestAddressString"].enable();
      this.advanceTableForm.controls["latitude"].enable();
      this.advanceTableForm.controls["longitude"].enable();

    }
    else if (selectedValue === 'App') {
      this.advanceTableForm.controls["reportingToGuestDate"].disable();
      this.advanceTableForm.controls["reportingToGuestTime"].disable();
      this.advanceTableForm.controls["reportingToGuestKM"].disable();
      this.advanceTableForm.controls["reportingToGuestAddressString"].disable();
      this.advanceTableForm.controls["latitude"].disable();
      this.advanceTableForm.controls["longitude"].disable();
    }
  }

  getDataManual() {
    this.advanceTableService.getReachedByDriverExecutive(this.allotmentID).subscribe(
      data => {
        this.dataSource = data;

        this.reportingToGuestEntryMethod = 'Manual';
        this.reportingToGuestEntry = false;

        this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
        this.advanceTableForm.patchValue({ reportingToGuestEntryMethod: "Manual" });
        this.advanceTableForm.controls["executive"].disable();
        this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
        this.advanceTableForm.patchValue({ reportingToGuestEntryExecutiveID: this.dataSource[0]?.reportingToGuestEntryExecutiveID });
        if(this.data?.rowRecord?.reportingToGuestDate){
          this.advanceTableForm.patchValue({ reportingToGuestDate: this.data?.rowRecord?.reportingToGuestDate });
        } 
        else {
          this.advanceTableForm.patchValue({ reportingToGuestDate: this.dataSource[0]?.reportingToGuestDate });
        } 
        if (this.data?.rowRecord?.reportingToGuestTime) {
          this.advanceTableForm.patchValue({ reportingToGuestTime: this.data?.rowRecord?.reportingToGuestTime });
        } else if (this.data?.rowRecord?.pickup?.pickupTime) {
          const pickupTime = new Date(this.data.rowRecord.pickup.pickupTime);
          pickupTime.setMinutes(pickupTime.getMinutes() - 20);
          const exactDate = new Date(pickupTime);
          this.advanceTableForm.patchValue({ reportingToGuestDate: exactDate });
          this.advanceTableForm.patchValue({ reportingToGuestTime: pickupTime });
        }
        this.advanceTableForm.patchValue({ reportingToGuestKM: this.dataSource[0]?.reportingToGuestKM });
        this.advanceTableForm.patchValue({ reportingToGuestAddressString: this.dataSource[0]?.reportingToGuestAddressString });
        var value = this.dataSource[0]?.reportingToGuestLatLong?.replace(
          '(',
          ''
        );
        value = value?.replace(')', '');
        var lat = value?.split(' ')[2];
        var long = value?.split(' ')[1];
        this.advanceTableForm.patchValue({ latitude: lat });
        this.advanceTableForm.patchValue({ longitude: long });

      },

      (error: HttpErrorResponse) => { this.dataSource = null; }
    );

  }

  getDataApp() {
    this.advanceTableService.getReachedByAppExecutive(this.allotmentID).subscribe(
      data => {
        this.dataSource = data;

        this.reportingToGuestEntryMethod = 'App';
        this.reportingToGuestEntry = true;

        this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
        this.advanceTableForm.patchValue({ reportingToGuestEntryMethod: "App" });
        this.advanceTableForm.controls["executive"].disable();
        this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
        this.advanceTableForm.patchValue({ reportingToGuestEntryExecutiveID: this.dataSource[0]?.reportingToGuestEntryExecutiveID });
        this.advanceTableForm.patchValue({ reportingToGuestDateByApp: this.dataSource[0]?.reportingToGuestDate });
        this.advanceTableForm.controls["reportingToGuestDateByApp"].disable();
        this.advanceTableForm.patchValue({ reportingToGuestTimeByApp: this.dataSource[0]?.reportingToGuestTime });
        this.advanceTableForm.controls["reportingToGuestTimeByApp"].disable();
        this.advanceTableForm.patchValue({ reportingToGuestKMByApp: this.dataSource[0]?.reportingToGuestKM });
        this.advanceTableForm.controls["reportingToGuestKMByApp"].disable();
        this.advanceTableForm.patchValue({ reportingToGuestAddressStringByApp: this.dataSource[0]?.reportingToGuestAddressString });
        this.advanceTableForm.controls["reportingToGuestAddressStringByApp"].disable();
        var value = this.dataSource[0]?.reportingToGuestLatLong?.replace(
          '(',
          ''
        );
        value = value?.replace(')', '');
        var lat = value?.split(' ')[2];
        var long = value?.split(' ')[1];
        this.advanceTableForm.patchValue({ latitudeByApp: lat });
        this.advanceTableForm.patchValue({ longitudeByApp: long });
        this.advanceTableForm.controls["latitudeByApp"].disable();
        this.advanceTableForm.controls["longitudeByApp"].disable();
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );

  }

  ngOnInit() 
  {
    if (this.tab === "Manual") {
      this.getDataManual();
    }
    else if (this.tab === "APP") {
      this.getDataApp();
    }
    else if (this.tab === "GPS") {
      //this.getDataApp();
    }
    this.InitGoogleAddress();
    if (!this.advanceTableForm.get('reportingToGuestEntryMethod').value) {
      this.advanceTableForm.patchValue({ reportingToGuestEntryMethod: "Manual" });
    }
    this.getDataManual();
    this.getEmployee();
    window.addEventListener('scroll', this.scrollEvent, true);
    this.loadData();
  }

  scrollEvent = (): void => {
    if (this.autoComplete && this.autoComplete.panelOpen) {
      this.autoComplete.updatePosition();
    }
  };

 AddressChange(address: Address) {

  const lat = address.geometry.location.lat();
  const lng = address.geometry.location.lng();

  this.advanceTableForm.patchValue({
    latitude: lat,
    longitude: lng,
    reportingToGuestAddressString: address.formatted_address
  });

  this.advanceTableForm
    .get('reportingToGuestAddressString')
    ?.updateValueAndValidity();
}


  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
  }

  onNoClick(): void {
    this.advanceTableForm.reset();
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void {

    this.saveDisabled = false;
    if (!this.isReportingValid()) 
    {
      return; // Don't proceed if invalid
    }
    this.advanceTableForm.patchValue({ dutySlipID: this.dutySlipID });
    this.advanceTableForm.patchValue({ executive: this.employeeDataSource[0].firstName + ' ' + this.employeeDataSource[0].lastName });
    this.advanceTableForm.patchValue({ reportingToGuestEntryExecutiveID: this.employeeDataSource[0].employeeID });
    this.advanceTableForm.patchValue({
      reportingToGuestLatLong: this.advanceTableForm.value.latitude
        + ',' +
        this.advanceTableForm.value.longitude
    });
    this.advanceTableForm.patchValue({ dutySlipByDriverID: this.dutySlipByDriverID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close(response);
          this.showNotification(
            'snackbar-success',
            'Reached By Executive Updated...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
        },
        error => {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
        }
      )
  }

  toggleAutocomplete(): void {
    if (!this.isGoogleAddressEnabled) {
      this.advanceTableForm.get('reportingToGuestAddressString')?.reset();
    }
  }

  InitGoogleAddress() {
    this._generalService.getGoogleAddress().subscribe(
      data => {
        this.GoogleAddressList = data;
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['reportingToGuestAddressString'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterGA(value || ''))
        );
      });

  }

  private _filterGA(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length === 0) {
      return []
    }
    return this.GoogleAddressList.filter(
      customer => {
        return customer.geoSearchString.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  onAddressSelected(selectedBookerName: string) {
    const selectedBooker = this.GoogleAddressList.find(
      data => data.geoSearchString === selectedBookerName
    );

    if (selectedBooker) {
      this.bindPickupSpotTypeandSpot(selectedBooker);
    }
  }

  bindPickupSpotTypeandSpot(option: any) {
    this.advanceTableForm.patchValue({ reportingToGuestAddressString: option.geoSearchString });
    var value = option?.geoLocation?.replace(
      '(',
      ''
    );
    value = value?.replace(')', '');
    var lat = value?.split(' ')[2];
    var long = value?.split(' ')[1];
    this.advanceTableForm.patchValue({ latitude: lat });
    this.advanceTableForm.patchValue({ longitude: long });
  }

  valueSwitch() {
    if (this.advanceTableForm.value.googleAddresses === true) {
      this.ifBlock = false;
      this.advanceTableForm.controls["reportingToGuestAddressString"].setValue('');

    }
    if (this.advanceTableForm.value.googleAddresses === false) {
      this.ifBlock = true;
      this.advanceTableForm.controls["reportingToGuestAddressString"].setValue('');
    }

  }

  public handleAddressChange(address: any) {
    this.reportingToGuestAddressString = address.formatted_address;
    this.advanceTableForm.patchValue({ reportingToGuestAddressString: this.reportingToGuestAddressString });

    if (address.address_components.length > 1) {
      var dropoffState = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) ===
          JSON.stringify(['administrative_area_level_1', 'political'])
      )[0].long_name;
    }

    if (address.address_components.length > 2) {
      var dropOffCity = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) === JSON.stringify(['locality', 'political'])
      )[0].short_name;
    }
    this.googlePlacesForm.patchValue({ geoPointID: -1 });
    this.googlePlacesForm.patchValue({ latitude: address.geometry.location.lat() });
    this.googlePlacesForm.patchValue({ longitude: address.geometry.location.lng() });
    this.googlePlacesForm.patchValue({ geoSearchString: this.reportingToGuestAddressString });
    this.googlePlacesForm.patchValue({ geoPointName: 'Google Address' });
    this.googlePlacesForm.patchValue({ googlePlacesID: address.place_id });
    this.googlePlacesForm.patchValue({ activationStatus: true });
    this.PostGoogleAddress();
  }

  public PostGoogleAddress(): void {
    this.googlePlacesForm.patchValue({
      geoLocation: this.googlePlacesForm.value.latitude
        +
        ',' +
        this.googlePlacesForm.value.longitude
    });
    this.reservationService.addGoogleAddress(this.googlePlacesForm.value)
      .subscribe(
        response => {

        },
        error => {

        }
      )
  }

  onBlurUpdateDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('reportingToGuestDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('reportingToGuestDate')?.setErrors({ invalidDate: true });
    }
  }

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('reportingToGuestTime').setValue(parsedTime);
    }
  }


  public loadData() 
  {
    this.advanceTableService.getDataOfDateTimeKM(this.dutySlipID).subscribe
    (
      data =>   
      {
        this.dataSourceForValidation = data;
        this.locationOutDate = new Date(data.locationOutDate);  // e.g. "2025-06-02T00:00:00"
        this.locationOutTime = new Date(data.locationOutTime);  // e.g. "2025-06-02T15:00:00"
        this.locationOutKm = data.locationOutKM;
      },
      (error: HttpErrorResponse) => { this.dataSourceForValidation = null;}
    );
  }

      private isReportingValid(): boolean {    
        const date = new Date(this.advanceTableForm.value.reportingToGuestDate);
        const time = new Date(this.advanceTableForm.value.reportingToGuestTime);
        const km = +this.advanceTableForm.value.reportingToGuestKM;

        const locationOutDateTime = new Date(this.locationOutDate);
        locationOutDateTime.setHours(this.locationOutTime.getHours());
        locationOutDateTime.setMinutes(this.locationOutTime.getMinutes());

        const reportingDateTime = new Date(date);
        reportingDateTime.setHours(time.getHours());
        reportingDateTime.setMinutes(time.getMinutes());

        const isDateTimeValid = reportingDateTime >= locationOutDateTime;
        const isKmValid = km >= this.locationOutKm;

        const formatDateDDMMYYYY = (date: Date) => {
          const d = date.getDate().toString().padStart(2, '0');
          const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const y = date.getFullYear();
          return `${d}-${m}-${y}`;
        };


        if (!isDateTimeValid || !isKmValid) {
          Swal.fire({
            title: 'Invalid Reporting Details',
            icon: 'warning',
            html: `
              <b>Reporting Date, Time and KM must be greater than Location Out values.</b><br><br>
              <b>Location Out Date:</b> ${formatDateDDMMYYYY(this.locationOutDate)}<br>
              <b>Location Out Time:</b> ${this.locationOutTime.toLocaleTimeString()}<br>
              <b>Location Out KM:</b> ${this.locationOutKm}
              `,
            customClass: {
              container: 'swal2-popup-high-zindex'
            }
            }).then((result) => {
              if (result.isConfirmed) {
                this.saveDisabled = true;
              }
          });
          return false;
        }
      return true;
    }


}



