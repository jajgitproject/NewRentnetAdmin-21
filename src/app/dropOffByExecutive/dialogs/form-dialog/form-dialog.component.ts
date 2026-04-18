// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DropOffByExecutive } from '../../dropOffByExecutive.model';
import { DropOffByExecutiveService } from '../../dropOffByExecutive.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogPickupExecutiveComponent } from 'src/app/fetchDataFromApp/dialogs/form-dialog/form-dialog.component';
import { FetchGpsAppDataDialogComponent } from '../../fetch-gps-app-data/fetch-gps-app-data.component';
import { GoogleAddressDropDown } from 'src/app/reservation/googleAddressDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReservationService } from 'src/app/reservation/reservation.service';
import moment from 'moment';
import { DateTimeKMModel } from 'src/app/reachedByExecutive/reachedByExecutive.model';
import { ReachedByExecutiveService } from 'src/app/reachedByExecutive/reachedByExecutive.service';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogDropOffByExecutiveComponent {
  showError: string;
  action: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DropOffByExecutive;
  dropOffAddress: any;
  driverName: any;
  registrationNumber: any;
  allotmentID: any;
  reservationID: any;
  dataSource: DropOffByExecutive[] | [];
  employeeDataSource: EmployeeDropDown[] | [];
  dropOffByExecutiveID: any;
  AllotmentID: any;
  dutySlipID: any;
  regno: any;
  dropOffEntry = false;
  ReservationID: any;
  dutySlipByDriverID: any;
  selectedValue: any;
  manualRadioDisabled: boolean = false;
  appRadioDisabled: boolean = false;
  gpsRadioDisabled: boolean = false;
  dropOffEntryMethod: string;
  saveDisabled: boolean = true;

  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];
  ifBlock = true;
  indeterminate = false;
  labelPosition: 'before' | 'before' = 'before';

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
  tab: any;

  dataSourceForValidation: DateTimeKMModel[] | [];
  locationOutDate: Date;
  locationOutTime: Date;
  locationOutKm: number;
  exactDate: any;
  pickupTime: any;
  pickUpDate: Date;
  pickUpTime: Date;
  pickUpKM: any;
  actualDate: Date;
  actualTime: Date;
  calculatedDropOffTime: Date;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogDropOffByExecutiveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dropOffByExecutiveService: DropOffByExecutiveService,
    public advanceTableService: DropOffByExecutiveService,
    public reachedByExecutiveService: ReachedByExecutiveService,
    public reservationService: ReservationService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.allotmentID = data.allotmentID;
    console.log(data);
    this.actualDate = new Date(data.rowRecord.pickup.pickupDate);
    console.log('Package Object:', data.rowRecord.package);

    if (data.rowRecord.pickup?.pickupTime) {
      // Step 1: Get actual pickup time
      this.actualTime = new Date(data.rowRecord.pickup.pickupTime);

      // Step 2: Get package string (e.g., "8 hours 80 min")
      const packageString: string = data.rowRecord.package?.package || '';
      console.log('Raw Package String:', packageString);

      // Step 3: Extract hours and minutes using regex
      const hourMatch = packageString.match(/(\d+)\s*(hour|hr|hrs)/i);
      const minuteMatch = packageString.match(/(\d+)\s*(min|mins|minutes)/i);

      let hours = hourMatch ? Number(hourMatch[1]) : 0;
      let minutes = minuteMatch ? Number(minuteMatch[1]) : 0;

      // Step 4: Convert excess minutes into hours
      const extraHours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      hours += extraHours;

      // Step 5: Calculate drop-off time
      const calculatedTime = new Date(this.actualTime);
      calculatedTime.setHours(calculatedTime.getHours() + hours);
      calculatedTime.setMinutes(calculatedTime.getMinutes() + remainingMinutes);

      // Step 6: Assign and optionally bind to form
      this.calculatedDropOffTime = calculatedTime;
      this.advanceTableForm?.get('dropOffTime')?.setValue(calculatedTime);

      // Step 7: Debug log
      console.log('Pickup Time:', this.actualTime.toLocaleTimeString());
      console.log('Package Duration:', hours, 'hours', remainingMinutes, 'minutes');
      console.log('Calculated Drop-Off Time:', this.calculatedDropOffTime.toLocaleTimeString());
    }
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    this.driverName = data.driverName;
    this.regno = data.regno;
    this.reservationID = data.reservationID;
    this.dutySlipID = data.dutySlipID;
    this.dutySlipByDriverID = data.dutySlipByDriverID;
    this.tab = data.tab;
    this.advanceTableForm = this.createContactForm();
    // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    // {
    //   this.isSaveAllowed = true;
    // } 
    // else
    // {
    //   this.isSaveAllowed = false;
    // }
         const status = (this.verifyDutyStatusAndCacellationStatus ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z\s]/g, ''); // 👈 ye line important hai

this.isSaveAllowed = status === 'changes allow';

    
    console.log(this.data.rowRecord)
    this.advanceTableForm.controls['dropOffEntryMethod'].setValue(data?.rowRecord?.dropOffEntryMethod);
    if (data?.rowRecord?.dropOffEntryMethod === 'Manual') {
      this.appRadioDisabled = true;
      this.gpsRadioDisabled = true;
    } else if (data?.rowRecord?.dropOffEntryMethod === 'App') {
      this.manualRadioDisabled = true;
      this.gpsRadioDisabled = true;
    } else if (data?.rowRecord?.dropOffEntryMethod === 'GPS') {
      this.manualRadioDisabled = true;
      this.appRadioDisabled = true;
    }
  }
AddressChange(address: Address) {

  this.dropOffAddress = address.formatted_address;

  this.advanceTableForm.patchValue({
    dropOffLatitude: address.geometry.location.lat(),
    dropOffLongitude: address.geometry.location.lng(),
    dropOffAddressString: this.dropOffAddress
  });

  this.advanceTableForm
    .get('dropOffAddressString')
    ?.updateValueAndValidity();
}


  public handleAddressChange(address: any) {
    this.dropOffAddress = address.formatted_address;
    this.advanceTableForm.patchValue({ dropOffAddressString: this.dropOffAddress });

    if (address.address_components.length > 1) {
      var pickupState = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) ===
          JSON.stringify(['administrative_area_level_1', 'political'])
      )[0].long_name;
    }

    if (address.address_components.length > 2) {
      var pickupCity = address.address_components.filter(
        (f) =>
          JSON.stringify(f.types) === JSON.stringify(['locality', 'political'])
      )[0].short_name;
    }

    this.googlePlacesForm.patchValue({ geoPointID: -1 });
    this.googlePlacesForm.patchValue({ latitude: address.geometry.location.lat() });
    this.googlePlacesForm.patchValue({ longitude: address.geometry.location.lng() });
    this.googlePlacesForm.patchValue({ geoSearchString: this.dropOffAddress });
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

  ngOnInit() {
    if (this.tab === "Manual") {
      this.saveManualData();

    }
    else if (this.tab === "APP") {
      this.saveAppData();
    }
    else if (this.tab === "GPS") {
      //this.getDataApp();
    }
    this.advanceTableForm.controls["pickUpTime"]?.setValue(this.data.rowRecord?.pickup?.pickupTime);
    this.advanceTableForm.controls['dropOffEntryMethod']?.setValue(this.data?.rowRecord?.dropOff);
    this.loadData();
    this.InitGoogleAddress();
    this.loadDataFordatetime();
    this.advanceTableForm.patchValue({ dropoffDate: [new Date()] });
    this.advanceTableForm.patchValue({ dropOffTime: [new Date()] });
    this.advanceTableForm.patchValue({ dropOffDateByApp: [new Date()] });
    this.advanceTableForm.patchValue({ dropOffTimeByApp: [new Date()] });
    // if (!this.advanceTableForm.get('dropOffEntryMethod').value) {
    //   this.advanceTableForm.patchValue({ dropOffEntryMethod: "Manual" });
    // }
  }

  loadData() {
    this.dropOffByExecutiveService.getDropOffExectiveDetails(this.allotmentID).subscribe
      (
        data => {

          this.dataSource = data;
          this.dropOffEntryMethod = this.dataSource[0].dropOffEntryMethod ?? 'Manual';
          if (this.dropOffEntryMethod === 'Manual') {
            this.dropOffEntry = false;
            this.ifBlock = true;
            this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0].dutySlipID });
            this.advanceTableForm.patchValue({ dropOffEntryMethod: "Manual" });
            this.advanceTableForm.patchValue({ executive: this.dataSource[0].firstName + " " + this.dataSource[0].lastName });
            this.advanceTableForm.patchValue({ dropOffEntryExecutiveID: this.dataSource[0].dropOffEntryExecutiveID });
            this.advanceTableForm.patchValue({ dropOffDate: this.dataSource[0].dropOffDate });
            this.advanceTableForm.patchValue({ dropOffTime: this.dataSource[0].dropOffTime });
            this.advanceTableForm.patchValue({ dropOffKM: this.dataSource[0].dropOffKM === 0 ? '' : this.dataSource[0].dropOffKM });
            this.advanceTableForm.patchValue({ dropOffAddressString: this.dataSource[0].dropOffAddressString });
            var value = this.dataSource[0].dropOffLatLong?.replace(
              '(',
              ''
            );
            value = value?.replace(')', '');
            var lat = value?.split(' ')[2];
            var long = value?.split(' ')[1];
            this.advanceTableForm.patchValue({ dropOffLatitude: lat });
            this.advanceTableForm.patchValue({ dropOffLongitude: long });
          } else if (this.dropOffEntryMethod === 'App') {
            this.dropOffEntry = true;
            this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0].dutySlipID });
            this.advanceTableForm.patchValue({ dropOffEntryMethod: "App" });
            this.advanceTableForm.patchValue({ executive: this.dataSource[0].firstName + " " + this.dataSource[0].lastName });
            this.advanceTableForm.patchValue({ dropOffEntryExecutiveID: this.dataSource[0].dropOffEntryExecutiveID });
            this.advanceTableForm.patchValue({ dropOffDateByApp: this.dataSource[0].dropOffDate });
            this.advanceTableForm.controls["dropOffDateByApp"].disable();
            this.advanceTableForm.patchValue({ dropOffTimeByApp: this.dataSource[0].dropOffTime });
            this.advanceTableForm.controls["dropOffTimeByApp"].disable();
            this.advanceTableForm.patchValue({ dropOffKmByApp: this.dataSource[0].dropOffKM });
            this.advanceTableForm.controls["dropOffKmByApp"].disable();
            this.advanceTableForm.patchValue({ dropOffAddressStringByApp: this.dataSource[0].dropOffAddressString });
            this.advanceTableForm.controls["dropOffAddressStringByApp"].disable();
            var value = this.dataSource[0].dropOffLatLong.replace(
              '(',
              ''
            );
            value = value.replace(')', '');
            var lat = value.split(' ')[2];
            var long = value.split(' ')[1];
            this.advanceTableForm.patchValue({ dropOffLatitudeByApp: lat });
            this.advanceTableForm.patchValue({ dropOffLongitudeByApp: long });
            this.advanceTableForm.controls["dropOffLatitudeByApp"].disable();
            this.advanceTableForm.controls["dropOffLongitudeByApp"].disable();
          }

          if (this.dropOffEntryMethod === null) {
            this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0].dutySlipID });
            this.advanceTableForm.patchValue({ dropOffEntryMethod: "Manual" });
            this.getEmployee();
          }
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  getEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = data;
        console.log(this.employeeDataSource)
        this.advanceTableForm.controls["executive"].disable();
        this.advanceTableForm.patchValue({ executive: this.employeeDataSource[0].firstName + " " + this.employeeDataSource[0].lastName });
        this.advanceTableForm.patchValue({ dropOffEntryExecutiveID: this.employeeDataSource[0].employeeID });
      }
    );
  }

  openAddStops() {
    const dialogRef = this.dialog?.open(FormDialogPickupExecutiveComponent,
      {
        data:
        {
          advanceTable: this.advanceTable,
          action: 'add',
        }
      });

  }
  createContactForm(): FormGroup {
    return this.fb.group(
      {
        dropOffEntryExecutiveID: [''],
        dutySlipID: [''],
        dutySlipByDriverID: [''],
        dropOffEntryMethod: [''],
        dropOffDate: [],
        dropOffKM: [''],
        dropOffLongitude: [''],
        dropOffLatitude: [''],
        dropOffTime: [],
        firstName: [''],
        lastName: [''],
       dropOffAddressString: [
  '',
  [Validators.required, this.googleDropOffValidator()]
],

        dropOffLatLong: [''],
        executive: [''],
        // App
        dropOffDateByApp: [new Date()],
        dropOffTimeByApp: [new Date()],
        dropOffKmByApp: [''],
        dropOffAddressStringByApp: [''],
        dropOffLongitudeByApp: [''],
        dropOffLatitudeByApp: [''],
        googleAddresses: [''],
     
    });

  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    console.log(this.advanceTableForm.value);
  }
  onNoClick(): void {

    this.advanceTableForm.reset();

  }
  public Post(): void {

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {

          this.dialogRef.close();
          this._generalService.sendUpdate('DropOffByExecutiveCreate:DropOffByExecutiveView:Success');//To Send Updates  

        },
        error => {
          this._generalService.sendUpdate('DropOffByExecutiveAll:DropOffByExecutiveView:Failure');//To Send Updates  
        }
      )
  }
  // public Put(): void {
  //   this.saveDisabled = false;
  //   this.advanceTableForm.patchValue({ dutySlipByDriverID: this.dutySlipByDriverID });
  //   this.advanceTableForm.patchValue({
  //     dropOffLatLong: this.advanceTableForm.value.dropOffLatitude
  //       +
  //       ',' +
  //       this.advanceTableForm.value.dropOffLongitude
  //   });
  //   this.advanceTableService.update(this.advanceTableForm.getRawValue())
  //     .subscribe(
  //       response => {
  //         this.dialogRef.close(response);
  //         this.showNotification(
  //           'snackbar-success',
  //           'Drop Off By Executive Updated...!!!',
  //           'bottom',
  //           'center'
  //         );
  //         this.saveDisabled = true;
  //       },
  //       error => {

  //         this.showNotification(
  //           'snackbar-danger',
  //           'Operation Failed.....!!!',
  //           'bottom',
  //           'center'
  //         );
  //         this.saveDisabled = true;
  //       }
  //     )
  // }

  // public Put(): void {
  //   this.advanceTableForm.patchValue({
  //     dutySlipByDriverID: this.dutySlipByDriverID,
  //     dropOffLatLong: this.advanceTableForm.value.dropOffLatitude + ',' + this.advanceTableForm.value.dropOffLongitude
  //   });

  //   // Check if form is invalid
  //   if (this.advanceTableForm.invalid) {
  //     const errorMessages = this.getFormValidationErrors(this.advanceTableForm);
  //     Swal.fire({
  //       title: 'Validation Errors',
  //       html: `<ul style="text-align:left;">${errorMessages.map(err => `<li>${err}</li>`).join('')}</ul>`,
  //       icon: 'error',
  //       confirmButtonText: 'OK',
  //       willOpen: () => {
  //         setTimeout(() => {
  //           const swalEl = document.querySelector('.swal2-container') as HTMLElement;
  //           if (swalEl) {
  //             swalEl.style.zIndex = '20000'; // force above any modal/dialog
  //           }
  //         }, 0);
  //       }
  //     });
  //     return; // Don't proceed if form is invalid
  //   }

  //   // Form is valid, proceed to save
  //   this.saveDisabled = false;

  //   this.advanceTableService.update(this.advanceTableForm.getRawValue())
  //     .subscribe(
  //       response => {
  //         this.dialogRef.close(response);
  //         this.showNotification(
  //           'snackbar-success',
  //           'Drop Off By Executive Updated...!!!',
  //           'bottom',
  //           'center'
  //         );
  //         this.saveDisabled = true;
  //       },
  //       error => {
  //         this.showNotification(
  //           'snackbar-danger',
  //           'Operation Failed.....!!!',
  //           'bottom',
  //           'center'
  //         );
  //         this.saveDisabled = true;
  //       }
  //     );
  // }

  // getFormValidationErrors(formGroup: FormGroup): string[] {
  //   const errors: string[] = [];
  //   Object.keys(formGroup.controls).forEach(key => {
  //     const controlErrors = formGroup.get(key)?.errors;
  //     if (controlErrors) {
  //       Object.keys(controlErrors).forEach(errorKey => {
  //         const fieldLabel = this.getFieldLabel(key); // Optional: convert field name to label
  //         switch (errorKey) {
  //           case 'required':
  //             errors.push(`${fieldLabel} is required.`);
  //             break;
  //           case 'min':
  //             errors.push(`${fieldLabel} must be greater than minimum value.`);
  //             break;
  //           case 'max':
  //             errors.push(`${fieldLabel} must be less than maximum value.`);
  //             break;
  //           case 'pattern':
  //             errors.push(`${fieldLabel} has an invalid format.`);
  //             break;
  //           case 'invalidDate':
  //             errors.push(`${fieldLabel} should not be earlier than pickup date.`);
  //             break;
  //           case 'invalidTime':
  //             errors.push(`${fieldLabel} should be after pickup time.`);
  //             break;
  //           case 'invalidKM':
  //             errors.push(`${fieldLabel} should be greater than pickup KM.`);
  //             break;
  //           default:
  //             errors.push(`${fieldLabel} is invalid.`);
  //         }
  //       });
  //     }
  //   });
  //   return errors;
  // }

  public Put(): void {
  this.advanceTableForm.patchValue({
    dutySlipByDriverID: this.dutySlipByDriverID,
    dropOffLatLong: this.advanceTableForm.value.dropOffLatitude + ',' + this.advanceTableForm.value.dropOffLongitude
  });

  this.saveDisabled = false;
   if (!this.isReportingValid()) 
    {
      return; // Don't proceed if invalid
    }
  this.advanceTableService.update(this.advanceTableForm.getRawValue())
    .subscribe(
      response => {
        this.dialogRef.close(response);
        this.showNotification(
          'snackbar-success',
          'Drop Off By Executive Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
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
    );
}

//  getFormValidationErrors(formGroup: FormGroup): string[] {
//   const errors: string[] = [];
//   Object.keys(formGroup.controls).forEach(key => {
//     const controlErrors = formGroup.get(key)?.errors;
//     if (controlErrors) {
//       Object.keys(controlErrors).forEach(errorKey => {
//         const fieldLabel = this.getFieldLabel(key);
//         switch (errorKey) {
//           case 'required':
//             errors.push(`${fieldLabel} is required.`);
//             break;
//           case 'min':
//             errors.push(`${fieldLabel} must be greater than the minimum value.`);
//             break;
//           case 'max':
//             errors.push(`${fieldLabel} must be less than the maximum value.`);
//             break;
//           case 'pattern':
//             errors.push(`${fieldLabel} has an invalid format.`);
//             break;
//           case 'invalidDate':
//             errors.push(`Drop Off Date must not be earlier than Pickup Date.`);
//             break;
//           case 'invalidTime':
//             errors.push(`Drop Off Time must be after Pickup Time.`);
//             break;
//           case 'invalidKM':
//             errors.push(`Drop KM should be greater than Pickup KM.`);
//             break;
//           default:
//             errors.push(`${fieldLabel} is invalid.`);
//         }
//       });
//     }
//   });
//   return errors;
// }

getFormValidationErrors(formGroup: FormGroup): string[] {
  const errors: string[] = [];
  Object.keys(formGroup.controls).forEach(key => {
    const controlErrors = formGroup.get(key)?.errors;
    if (controlErrors) {
      Object.keys(controlErrors).forEach(errorKey => {
        const fieldLabel = this.getFieldLabel(key);
        switch (errorKey) {
          case 'required':
            errors.push(`${fieldLabel} is required.`);
            break;
          case 'invalidDate':
            errors.push(`Drop Off Date should be equal to or greater than Pickup Date and Pickup Time.`);
            break;
          case 'invalidTime':
            errors.push(`Drop Off Time must be after Pickup Time.`);
            break;
          case 'invalidKM':
            errors.push(`Drop Off Km  equal to or greater than Pickup KM.`);
            break;
        }
      });
    }
  });
  return errors;
}

  getFieldLabel(field: string): string {
    const fieldMap: { [key: string]: string } = {
      dropOffEntryExecutiveID: 'Executive ID',
      dropOffDate: 'Drop Off Date',
      dropOffKM: 'Drop Off KM',
      dropOffLatitude: 'Drop Off Latitude',
      dropOffLongitude: 'Drop Off Longitude',
      dropOffTime: 'Drop Off Time',
      firstName: 'First Name',
      lastName: 'Last Name',
      // Add more fields as needed
    };
    return fieldMap[field] || field;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  saveManualData() {

    this.dropOffByExecutiveService.getDropOffDriverExectiveDetails(this.allotmentID).subscribe
      (
        data => {
          this.dataSource = data;
          console.log(this.dataSource)
          this.dropOffEntryMethod = 'Manual';
          this.dropOffEntry = false;
          this.ifBlock = true;
          this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
          this.advanceTableForm.patchValue({ dropOffEntryMethod: "Manual" });
          this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
          this.advanceTableForm.patchValue({ dropOffEntryExecutiveID: this.dataSource[0]?.dropOffEntryExecutiveID });
          // this.advanceTableForm.patchValue({ dropOffDate: this.dataSource[0]?.dropOffDate});
          // this.advanceTableForm.patchValue({ dropOffTime: this.dataSource[0]?.dropOffTime });
          this.advanceTableForm.patchValue({ dropOffKM: this.dataSource[0]?.dropOffKM === 0 ? '' : this.dataSource[0]?.dropOffKM });
          this.advanceTableForm.patchValue({ dropOffAddressString: this.dataSource[0]?.dropOffAddressString });
          var value = this.dataSource[0]?.dropOffLatLong?.replace(
            '(',
            ''
          );
          value = value?.replace(')', '');
          var lat = value?.split(' ')[2];
          var long = value?.split(' ')[1];
          this.advanceTableForm.patchValue({ dropOffLatitude: lat });
          this.advanceTableForm.patchValue({ dropOffLongitude: long });
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  saveAppData() {

    this.dropOffByExecutiveService.getDropOffAppExectiveDetails(this.allotmentID).subscribe
      (
        data => {

          this.dataSource = data;
          console.log(this.dataSource);
          this.dropOffEntryMethod = 'App';
          this.dropOffEntry = true;
          this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
          this.advanceTableForm.patchValue({ dropOffEntryMethod: "App" });
          this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
          this.advanceTableForm.patchValue({ dropOffEntryExecutiveID: this.dataSource[0]?.dropOffEntryExecutiveID });
          // this.advanceTableForm.patchValue({ dropOffDateByApp: this.dataSource[0]?.dropOffDate });
          this.advanceTableForm.controls["dropOffDateByApp"].disable();
          // this.advanceTableForm.patchValue({ dropOffTimeByApp: this.dataSource[0]?.dropOffTime });
          this.advanceTableForm.controls["dropOffTimeByApp"].disable();
          this.advanceTableForm.patchValue({ dropOffKmByApp: this.dataSource[0]?.dropOffKM === 0 ? '' : this.dataSource[0]?.dropOffKM });
          this.advanceTableForm.controls["dropOffKmByApp"].disable();
          this.advanceTableForm.patchValue({ dropOffAddressStringByApp: this.dataSource[0]?.dropOffAddressString });
          this.advanceTableForm.controls["dropOffAddressStringByApp"].disable();

          var value = this.dataSource[0]?.dropOffLatLong?.replace(
            '(',
            ''
          );
          value = value?.replace(')', '');
          var lat = value?.split(' ')[2];
          var long = value?.split(' ')[1];
          this.advanceTableForm.patchValue({ dropOffLatitudeByApp: lat });
          this.advanceTableForm.patchValue({ dropOffLongitudeByApp: long });

          this.advanceTableForm.controls["dropOffLatitudeByApp"].disable();
          this.advanceTableForm.controls["dropOffLongitudeByApp"].disable();
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );

  }

  selectRadioButton(event: any) {
    const selectedValue = event.value;
    this.advanceTableForm.patchValue({ dropOffEntryMethod: selectedValue });
    if (selectedValue === 'Manual') {
      this.advanceTableForm.controls["dropOffDate"].enable();
      this.advanceTableForm.controls["dropOffTime"].enable();
      this.advanceTableForm.controls["dropOffKM"].enable();
      this.advanceTableForm.controls["dropOffAddressString"].enable();
      this.advanceTableForm.controls["dropOffLatitude"].enable();
      this.advanceTableForm.controls["dropOffLongitude"].enable();
    } else if (selectedValue === 'App') {
      this.advanceTableForm.patchValue({
        dropOffEntryMethod: selectedValue,
      });
      this.advanceTableForm.controls["dropOffDate"].disable();
      this.advanceTableForm.controls["dropOffTime"].disable();
      this.advanceTableForm.controls["dropOffKM"].disable();
      this.advanceTableForm.controls["dropOffAddressString"].disable();
      this.advanceTableForm.controls["dropOffLatitude"].disable();
      this.advanceTableForm.controls["dropOffLongitude"].disable();
    }
  }

  openPickupTimeExective() {

    const dialogRef = this.dialog.open(FormDialogPickupExecutiveComponent,
      {
        width: '70%',
        height: '90%',
        data:
        {
          advanceTable: this.advanceTable,
          action: 'add',
          reservationID: this.reservationID,
        }
      });
    dialogRef.afterClosed().subscribe((item: any) => {
      console.log(item);
      if (item !== undefined) {
        console.log(item)
        this.advanceTableForm.patchValue({ dropOffKM: item.data.pickupKM });
        this.advanceTableForm.patchValue({ dropOffAddressString: item.data.pickupAddressString });
        this.advanceTableForm.patchValue({ dropOffLatitude: item.data.pickupLatitude });
        this.advanceTableForm.patchValue({ dropOffLongitude: item.data.pickupLongitude });
      }
    });
  }

  openGpsExective() {

    const dialogRef = this.dialog.open(FetchGpsAppDataDialogComponent,
      {
        data:
        {
          advanceTable: this.advanceTable,
          action: 'add',
          reservationID: this.reservationID,
        }
      });
    dialogRef.afterClosed().subscribe((item: any) => {
      this.advanceTableForm.patchValue({ dropOffKM: item.data[0].pickupKM });
      this.advanceTableForm.patchValue({ dropOffAddressString: item.data[0].pickupAddressString });
      this.advanceTableForm.patchValue({ dropOffLatitude: item.data[0].pickupLatitude });
      this.advanceTableForm.patchValue({ dropOffLongitude: item.data[0].pickupLongitude });
    });
  }

  InitGoogleAddress() {
    this._generalService.getGoogleAddress().subscribe(
      data => {
        this.GoogleAddressList = data;
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['dropOffAddressString'].valueChanges.pipe(
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
      this.bindDropSpotTypeandSpot(selectedBooker);
    }
  }

  bindDropSpotTypeandSpot(option: any) {
    this.advanceTableForm.patchValue({ dropOffAddressString: option.geoSearchString });
    var value = option?.geoLocation?.replace(
      '(',
      ''
    );
    value = value?.replace(')', '');
    var lat = value?.split(' ')[2];
    var long = value?.split(' ')[1];
    this.advanceTableForm.patchValue({ dropOffLatitude: lat });
    this.advanceTableForm.patchValue({ dropOffLongitude: long });
  }
  valueSwitch() {
    if (this.advanceTableForm.value.googleAddresses === true) {
      this.ifBlock = false;
      this.advanceTableForm.controls["dropOffAddressString"].setValue('');

    }
    if (this.advanceTableForm.value.googleAddresses === false) {
      this.ifBlock = true;
      this.advanceTableForm.controls["dropOffAddressString"].setValue('');
    }

  }

  onBlurUpdateDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('dropOffDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('dropOffDate')?.setErrors({ invalidDate: true });
    }
  }

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    console.log(inputValue);
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('dropOffTime').setValue(parsedTime);
      this.advanceTableForm.updateValueAndValidity();
    }
  }

  public loadDataFordatetime() {
    this.reachedByExecutiveService.getDataOfDateTimeKM(this.dutySlipID).subscribe
      (
        data => {
          this.dataSourceForValidation = data;
          console.log(this.dataSourceForValidation)
          this.pickUpDate = new Date(data.pickupDate);  // e.g. "2025-06-02T00:00:00"
          this.pickUpTime = new Date(data.pickupTime);  // e.g. "2025-06-02T15:00:00"
          this.pickUpKM = data.pickupKM;

        },
        (error: HttpErrorResponse) => { this.dataSourceForValidation = null; }
      );
  }

  private isReportingValid(): boolean {    
        const date = new Date(this.advanceTableForm.value.dropOffDate);
        const time = new Date(this.advanceTableForm.value.dropOffTime);
        const km = +this.advanceTableForm.value.dropOffKM;

        const pickupDateTime = new Date(this.pickUpDate);
        pickupDateTime.setHours(this.pickUpTime.getHours());
        pickupDateTime.setMinutes(this.pickUpTime.getMinutes());

        const dropOffDateTime = new Date(date);
        dropOffDateTime.setHours(time.getHours());
        dropOffDateTime.setMinutes(time.getMinutes());

        const isDateTimeValid = dropOffDateTime >= pickupDateTime;
        const isKmValid = km >= this.pickUpKM;

        const formatDateDDMMYYYY = (date: Date) => {
          const d = date.getDate().toString().padStart(2, '0');
          const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const y = date.getFullYear();
          return `${d}-${m}-${y}`;
        };

        if (!isDateTimeValid || !isKmValid) {
          Swal.fire({
            title: 'Invalid PickUp Details',
            icon: 'warning',
            html: `
              <b>Drop Off Date, Time and KM must be greater than Pickup values.</b><br><br>
              <b>Pickup Date:</b> ${formatDateDDMMYYYY(this.pickUpDate)}<br>
              <b>Pickup Time:</b> ${this.pickUpTime.toLocaleTimeString()}<br>
              <b>Pickup KM:</b> ${this.pickUpKM}
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
onDropOffTyping() {

  this.advanceTableForm.patchValue({
    dropOffLatitude: null,
    dropOffLongitude: null
  });

  this.advanceTableForm
    .get('dropOffAddressString')
    ?.updateValueAndValidity();
}




googleDropOffValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) return null;

    const value = control.value;
    const lat = control.parent.get('dropOffLatitude')?.value;

    // Required validator empty handle karega
    if (!value) return null;

    // Agar value hai but latitude nahi hai
    if (!lat) {
      return { invalidAddress: true };
    }

    return null;
  };
}



}




