// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { DispatchByExecutiveService } from '../../dispatchByExecutive.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DispatchByExecutive } from '../../dispatchByExecutive.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Address } from '@compat/google-places-shim-objects/address';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { DispatchByExecutiveDropDown } from '../../dispatchByExecutiveDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogFetchComponent } from 'src/app/dispatchFetchData/dialogs/form-dialog/form-dialog.component';
import { FetchDataFromGPSComponent } from '../fetch-data-from-gps/fetch-data-from-gps.component';
import { MatRadioButton } from '@angular/material/radio';
import { GoogleAddressDropDown } from 'src/app/reservation/googleAddressDropDown.model';
import { ReservationService } from 'src/app/reservation/reservation.service';
import moment from 'moment';
import { ThemeService } from 'ng2-charts';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogDBEComponent {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DispatchByExecutive;
  //address: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  addressString: string;
  public EmployeeList?: EmployeeDropDown[] = [];
  public dispatchList?: DispatchByExecutiveDropDown[] = [];
  dataSource: DispatchByExecutive[] | null;
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  //public dispatchByExecutiveService: DispatchByExecutiveService
  DriverName: any;
  RegistrationNumber: any;
  AllotmentID: any;
  ReservationID: any;
  LocationOutEntryExecutiveID: any;
  locationOutLocationOrHubID: any;
  organizationalEntityAddressString:any;
  dutySlipID: any;
  //DutySlipByDriverID: any;
  dutySlipByDriverID: any;
  locationOutEntryMethod: string;
  selectedValue: string;
  locationOutEntry: boolean;
  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];
  ifBlock=true;
  indeterminate = false;
  labelPosition: 'before' | 'before' = 'before';
  locationOutAddressString: any;
  saveDisabled:boolean=true;
  tab: any;
  location: any;
  locationID: any;
  IntervalInTime: any;
  FromToDate: string;
  CustomerAlertShow:boolean=false;
  CustomerAlert: string ='';
  locOutDateTime:any;
  actualTime: any;
  actualDate: Date;
  pickupTime: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogDBEComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DispatchByExecutiveService,
    public dispatchByExecutiveService: DispatchByExecutiveService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public reservationService: ReservationService,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    this.advanceTable = data.advanceTable;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;

    this.advanceTable = new DispatchByExecutive({});
    //this.advanceTable.activationStatus=true;

    this.advanceTableForm = this.createContactForm();
    // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    // {
    //   this.isSaveAllowed = true;
    // } 
    // else
    // {
    //   this.isSaveAllowed = false;
    // }
   const status = (this.verifyDutyStatusAndCacellationStatus || '')
  .trim()
  .toLowerCase();

this.isSaveAllowed = status === 'changes allow';
    
    this.ReservationID = data.reservationID;
    this.AllotmentID = data.allotmentID;
    this.RegistrationNumber = data.registrationNumber;
    this.DriverName = data.driverName;
    this.dutySlipID=data.dutySlipID;
    this.dutySlipByDriverID=data.dutySlipByDriverID;
    // this.location=data.rowRecord.transferedLocation;
    // this.locationID=data.rowIndex.transferedLocationID;
    this.tab=data.tab;
    this.getCustomerAlertForDispatch(data.rowRecord.customerID)

    this.actualDate = new Date(data.rowRecord.pickup.pickupDate);
    this.pickupTime = new Date(data.rowRecord.pickup.pickupTime);
    //this.actualTime = this.pickupTime.setMinutes(this.pickupTime.getMinutes() - 90);
  }
  

  ngOnInit() {
    if(this.tab==="Manual")
    {
      this.getDataManual();
    }
    else if(this.tab==="App")
    {
      this.getDataApp();
    }
    else if(this.tab==="GPS")
    {
      //this.getDataApp();
    }
    // this.loadData();
    this.InitGoogleAddress();
  //   if (!this.advanceTableForm.get('locationOutEntryMethod').value) {
  //    this.advanceTableForm.patchValue({ locationOutEntryMethod: "Manual" });
  //  }
     //this.getDataApp();
     //this.getDataManual();
     this.uploadedByName();
     //this.InitLocationHub();
     //this.getIntervalInTime();
 
   }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        locationOutEntryExecutiveID: [''],
        dutySlipID: [''],
        dutySlipByDriverID: [''],
        locationOutEntryMethod: [''],
        manualDutySlipNumber: [''],
        manualDutySlipNumberByApp: [''],
        locationOutKM:[''],
        actualCarMovedFrom: [''], 
        actualCarMovedFromByApp: [''],    
        locationOutDate: [''],
        locationOutTime: [''],
      locationOutAddressString: [
  '',
  [Validators.required, this.googleAddressValidator()]
],
        locationOutLatitude: [''],
        locationOutLongitude: [''],
        executive: [''],
        locationOutLatLong:[''],
        locationOutLocationOrHubID:[''],
       locationOutLocationOrHub: [''
],


        locationOutLocationOrHubByApp: [''],
        
        locationOutKMByApp: [''],
        locationOutLatitudeByApp: [''],
        locationOutLongitudeByApp: [''],
        locationOutAddressStringByApp:[''],
        locationOutLatLongByApp:[''],
        locationOutDateByApp:[new Date()],
        locationOutTimeByApp:[new Date()],
        googleAddresses:[''],
      });

  }

  googlePlacesForm = this.fb.group({
    geoPointID: [''],
    geoLocation: [''],
    latitude:[''],
    longitude:[''],
    geoSearchString: [''],
    geoPointName: [''],
    googlePlacesID:[''],
    activationStatus:['']
  })
  // selectRadioButton(event: any) {
  //   this.selectedValue = event?.value;
  //   if (this.selectedValue === 'Manual') {
  //         this.getDataManual();
         
  //       } else if (this.selectedValue === 'App') {
  //         this.getDataApp();
  //       }
    
  // }
  validateLocationOutTime() {
    if (this.data.rowRecord?.pickup?.pickupTime && this.data.rowRecord?.pickup?.pickupDate) {
        const pickupTime = this.data.rowRecord.pickup.pickupTime.split('T')[1];  // Pickup Time (HH:mm:ss)
        let userSelectedTime = this.advanceTableForm.get('locationOutTime')?.value; // User Input Time

        const pickupDate = this.data.rowRecord.pickup.pickupDate.split('T')[0];  // Pickup Time (HH:mm:ss)
        let userSelectedDate = this.advanceTableForm.get('locationOutDate')?.value; // User Input Time
        userSelectedDate = moment(userSelectedDate).format('yyyy-MM-DD');

        userSelectedTime = moment(userSelectedTime).format('HH:mm:ss');
        if (userSelectedTime > pickupTime || userSelectedDate > pickupDate) {
            this.advanceTableForm.get('locationOutTime')?.setErrors({ invalidTime: true });
        } else {
            this.advanceTableForm.get('locationOutTime')?.setErrors(null);
        }
    }
}



  selectRadioButton(event: any) {
    const selectedValue = event.value;
    this.advanceTableForm.patchValue({ locationOutEntryMethod: selectedValue });
    if (selectedValue === 'Manual') {
      this.advanceTableForm.controls["locationOutDate"].enable();
      this.advanceTableForm.controls["locationOutTime"].enable();
      this.advanceTableForm.controls["locationOutKM"].enable();
      this.advanceTableForm.controls["locationOutAddressString"].enable();
      this.advanceTableForm.controls["locationOutLatitude"].enable();
      this.advanceTableForm.controls["locationOutLongitude"].enable();
    
    } else if (selectedValue === 'App') {
      // this.advanceTableForm.patchValue({
      //   locationOutEntryMethod: selectedValue,
      // });
    
      this.advanceTableForm.controls["locationOutDate"].disable();
      this.advanceTableForm.controls["locationOutTime"].disable();
      this.advanceTableForm.controls["locationOutKM"].disable();
      this.advanceTableForm.controls["locationOutAddressString"].disable();
      this.advanceTableForm.controls["locationOutLatitude"].disable();
      this.advanceTableForm.controls["locationOutLongitude"].disable();
    }
  }

  getIntervalInTime()
  {
    this.advanceTableService.GetLocationOutIntervalInMinutes(this.data.rowRecord.customerID).subscribe(
      data=>
      {
        this.IntervalInTime = data.locationOutIntervalInMinutes;
        if (this.data.rowRecord?.pickup?.pickupTime && this.data.rowRecord?.pickup?.pickupDate) {
          const pickupDate = new Date(this.data.rowRecord?.pickup?.pickupDate);
          const eventTime = new Date(this.data.rowRecord?.pickup?.pickupTime);
          const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
          if(this.IntervalInTime===0 || this.IntervalInTime===null)
          {
            combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
          }
          else
          {
            combinedDateTime.setMinutes(combinedDateTime.getMinutes() - this.IntervalInTime);
          }
          
          this.locOutDateTime=new Date(combinedDateTime);
          this.advanceTableForm.patchValue({locationOutDate:this.locOutDateTime});
          this.advanceTableForm.patchValue({locationOutTime:this.locOutDateTime});
        
        }
      }
    );
  }

  setLocationOutDateTime() {
    if (this.data.rowRecord?.pickup?.pickupTime && this.data.rowRecord?.pickup?.pickupDate) {
      const pickupDate = new Date(this.data.rowRecord?.pickup?.pickupDate);
      const eventTime = new Date(this.data.rowRecord?.pickup?.pickupTime);
      const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
      combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
      this.locOutDateTime=new Date(combinedDateTime);
      this.advanceTableForm.patchValue({locationOutDate:this.locOutDateTime});
      this.advanceTableForm.patchValue({locationOutTime:this.locOutDateTime});
    
    }
  }


 getDataManual() {
  this.dispatchByExecutiveService.getDispatchDetailsForDriver(this.AllotmentID).subscribe(
    data => {
      this.dataSource = data;

      if (this.dataSource[0].locationOutLocationOrHubID === 0) {

        this.advanceTableForm.controls["locationOutLocationOrHub"].disable();

        this.advanceTableForm.patchValue({
          locationOutLocationOrHub: this.data.rowRecord.transferedLocation,
          locationOutLocationOrHubID: this.data.rowRecord.transferedLocationID,
          locationOutAddressString: this.data.rowRecord.organizationalEntityAddressString
        });

        var organizationalEntityGeoLocation =
          this.data.rowRecord.organizationalEntityGeoLocation?.replace('(', '').replace(')', '');

        const { lat: orgLat, long: orgLong } = this.parseCoordinates(organizationalEntityGeoLocation);

        if (orgLat !== null && orgLong !== null) {
          this.advanceTableForm.patchValue({
            locationOutLatitude: orgLat,
            locationOutLongitude: orgLong
          });
        }

        // ✅ ONLY when no saved time → auto interval lagao
        if (!this.dataSource[0]?.locationOutTime) {
          this.getIntervalInTime();
        }

      } else {

        this.locationOutEntryMethod = 'Manual';
        this.locationOutEntry = false;

        this.InitLocationHub();

        this.advanceTableForm.patchValue({
          dutySlipID: this.dataSource[0]?.dutySlipID,
          locationOutEntryMethod: "Manual",
          executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName,
          locationOutEntryExecutiveID: this.dataSource[0]?.locationOutEntryExecutiveID,
          manualDutySlipNumber: this.dataSource[0]?.manualDutySlipNumber,
          actualCarMovedFrom: this.dataSource[0]?.actualCarMovedFrom,
          locationOutLocationOrHub: this.dataSource[0]?.locationOutLocationOrHub,
          locationOutLocationOrHubID: this.dataSource[0]?.locationOutLocationOrHubID,
          locationOutDate: this.dataSource[0]?.locationOutDate,
          locationOutTime: this.dataSource[0]?.locationOutTime,
          locationOutKM: this.dataSource[0]?.locationOutKM,
          locationOutAddressString: this.dataSource[0]?.locationOutAddressString
        });

        this.advanceTableForm.controls["executive"].disable();

        var value = this.dataSource[0]?.locationOutLatLong?.replace('(', '').replace(')', '');

        if (value) {
          const { lat: dataLat, long: dataLong } = this.parseCoordinates(value);

          if (dataLat !== null && dataLong !== null) {
            this.advanceTableForm.patchValue({
              locationOutLatitude: dataLat,
              locationOutLongitude: dataLong
            });
          }
        }

        // ✅ ONLY when no saved time → auto interval lagao
        if (!this.dataSource[0]?.locationOutTime) {
          this.getIntervalInTime();
        }
      }
    },
    (error: HttpErrorResponse) => {
      this.dataSource = null;
    }
  );
}
  getDataApp(){
    this.dispatchByExecutiveService.getDispatchDetailsForApp(this.AllotmentID).subscribe
    (
      data => {
        this.dataSource = data;
        this.locationOutEntryMethod = 'App';
          this.locationOutEntry = true;
          
          this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
          this.advanceTableForm.patchValue({ locationOutEntryMethod: "App" });
          // this.advanceTableForm.controls["locationOutEntryMethod"].disable();
          this.advanceTableForm.controls["executive"].disable();
          this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
          this.advanceTableForm.patchValue({ locationOutEntryExecutiveID: this.dataSource[0]?.locationOutEntryExecutiveID });
          this.advanceTableForm.patchValue({ manualDutySlipNumberByApp: this.dataSource[0]?.manualDutySlipNumber });

          this.advanceTableForm.controls["manualDutySlipNumberByApp"].disable();
          this.advanceTableForm.patchValue({ locationOutLocationOrHubByApp: this.dataSource[0]?.locationOutLocationOrHub });
          this.advanceTableForm.controls["locationOutLocationOrHubByApp"].disable();
          this.advanceTableForm.patchValue({ actualCarMovedFromByApp: this.dataSource[0]?.actualCarMovedFrom });
         
          this.advanceTableForm.controls["actualCarMovedFromByApp"].disable();
          this.advanceTableForm.patchValue({ locationOutDateByApp: this.dataSource[0]?.locationOutDate });
          this.advanceTableForm.controls["locationOutDateByApp"].disable();
          this.advanceTableForm.patchValue({ locationOutTimeByApp: this.dataSource[0]?.locationOutTime });
          this.advanceTableForm.controls["locationOutTimeByApp"].disable();
          this.advanceTableForm.patchValue({ locationOutKMByApp: this.dataSource[0]?.locationOutKM });
          this.advanceTableForm.controls["locationOutKMByApp"].disable();
          this.advanceTableForm.patchValue({ locationOutAddressStringByApp: this.dataSource[0]?.locationOutAddressString });
          this.advanceTableForm.controls["locationOutAddressStringByApp"].disable();

          var value = this.dataSource[0]?.locationOutLatLong?.replace(
            '(',
            ''
          );
          value = value?.replace(')', '');
          if (value) {
            const { lat: appLat, long: appLong } = this.parseCoordinates(value);
            if (appLat !== null && appLong !== null) {
              this.advanceTableForm.patchValue({ locationOutLatitudeByApp: appLat });
              this.advanceTableForm.patchValue({ locationOutLongitudeByApp: appLong });
            } else {
              console.warn('Failed to parse App locationOutLatLong:', value);
            }
          }

          this.advanceTableForm.controls["locationOutLatitudeByApp"].disable();
          this.advanceTableForm.controls["locationOutLongitudeByApp"].disable();
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );

  }
  
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

 onAddressTyping() {
  this.advanceTableForm.patchValue({
    locationOutLatitude: null,
    locationOutLongitude: null
  });

  const control = this.advanceTableForm.get('locationOutAddressString');

  control?.markAsTouched();   // 👈 ye missing hai
  control?.updateValueAndValidity();
}
// onAddressTyping() {
//   this.advanceTableForm.patchValue({
//     locationOutLatitude: null,
//     locationOutLongitude: null
//   });

//   const control = this.advanceTableForm.get('locationOutAddressString');
//   control?.markAsTouched();
//   control?.updateValueAndValidity();
// }




  AddressChange(address: Address) {
    if (!address) {
      console.error('No address provided');
      return;
    }
    
    const lat = address.geometry.location.lat();
    const lng = address.geometry.location.lng();
    
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates from Google Maps:', { lat, lng });
      this.showNotification(
        'snackbar-danger',
        'Invalid coordinates from Google Maps',
        'bottom',
        'center'
      );
      return;
    }
    
    this.advanceTableForm.patchValue({
      locationOutAddressString: address.formatted_address,
      locationOutLatitude: lat,
      locationOutLongitude: lng
    });
    

    // Validator ko fir se chalaye
    this.advanceTableForm.get('locationOutAddressString')?.markAsTouched();
    this.advanceTableForm.get('locationOutAddressString')?.updateValueAndValidity();
  }

  // locationTimeSet(event) {
  //   if (this.action === 'edit') {
  //     let time = this.advanceTableForm.value.pickupTime;
  //     let minutes = 90;
  //     let millisecondsToSubtract = minutes * 60 * 1000;
  //     let newDate = new Date(time - millisecondsToSubtract);
  //     this.advanceTableForm.patchValue({ locationOutTime: newDate });
  //   }
  //   else {
  //     let time = event.getTime();
  //     let minutes = 90;
  //     let millisecondsToSubtract = minutes * 60 * 1000;
  //     let newDate = new Date(time - millisecondsToSubtract);
  //     this.advanceTableForm.patchValue({ locationOutTime: newDate });
  //   }
  // }

  saveData(){
   
  }

  ///---------selectRadioButton----------
  // selectRadioButton(event) {
  //   const selectedValue = event.value;
  //   if (selectedValue === 'Manual') {
  //     this.appRadioDisabled = true;
  //     this.gpsRadioDisabled = true;
  //   } else if (selectedValue === 'App') {
  //     this.manualRadioDisabled = true;
  //     this.gpsRadioDisabled = true;
  //   } else if (selectedValue === 'GPS') {
  //     this.manualRadioDisabled = true;
  //     this.appRadioDisabled = true;
  //   }
  // }

  fetchDataGPS()
  {
    const dialogRef = this.dialog.open(FetchDataFromGPSComponent, 
    {
      //width:'70%',
      //height:'80%',
      data: 
        {
          action: 'add',
          reservationID:this.ReservationID
        }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res!==undefined)
      {
       this.advanceTableForm.patchValue({locationOutAddressString:res.data[0].pickupAddressString});
       this.advanceTableForm.patchValue({locationOutKM:res.data[0].pickupKM});
       this.advanceTableForm.patchValue({locationOutLatitude:res.data[0].pickupLatitude});
       this.advanceTableForm.patchValue({locationOutLongitude:res.data[0].pickupLongitude});
      }
    })
  }
 
  // public loadData() {
    
  //   this.dispatchByExecutiveService.getDispatchDetailsForDriver(this.AllotmentID).subscribe
  //     (
  //       data => {
  //         this.dataSource = data;
          
  //         this.locationOutEntryMethod = this.dataSource[0]?.locationOutEntryMethod ?? 'Manual';

  //        if (this.locationOutEntryMethod === 'Manual') {
  //           this.locationOutEntry = false;
  //          this.InitLocationHub();
         
  //           this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
  //           this.advanceTableForm.patchValue({ locationOutEntryMethod: "Manual" });
  //           // this.advanceTableForm.controls["locationOutEntryMethod"].disable();
  //           this.advanceTableForm.controls["executive"].disable();
  //           this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
  //           this.advanceTableForm.patchValue({ locationOutEntryExecutiveID: this.dataSource[0]?.locationOutEntryExecutiveID });
  //           this.advanceTableForm.patchValue({ manualDutySlipNumber: this.dataSource[0]?.manualDutySlipNumber });
  //           this.advanceTableForm.patchValue({ actualCarMovedFrom: this.dataSource[0]?.actualCarMovedFrom });
  //           this.advanceTableForm.patchValue({ locationOutLocationOrHub: this.dataSource[0]?.locationOutLocationOrHub });
  //           this.advanceTableForm.patchValue({ locationOutLocationOrHubID: this.dataSource[0]?.locationOutLocationOrHubID });
  //           this.advanceTableForm.patchValue({ locationOutDate: this.dataSource[0]?.locationOutDate });
  //           this.advanceTableForm.patchValue({ locationOutTime: this.dataSource[0]?.locationOutTime });
  //           this.advanceTableForm.patchValue({ locationOutKM: this.dataSource[0]?.locationOutKM });
  //           this.advanceTableForm.patchValue({ locationOutAddressString: this.dataSource[0]?.locationOutAddressString });
  //           var value = this.dataSource[0]?.locationOutLatLong?.replace(
  //             '(',
  //             ''
  //           );
  //           value = value?.replace(')', '');
  //           var lat = value?.split(' ')[2];
  //           var long = value?.split(' ')[1];
  //           this.advanceTableForm.patchValue({ locationOutLatitude: lat });
  //           this.advanceTableForm.patchValue({ locationOutLongitude: long });
  //         }

  //         // if (this.locationOutEntryMethod === 'App') 
  //         //   {
         
  //         //   this.locationOutEntry = true;
  //         //   this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0].dutySlipID });
  //         //   this.advanceTableForm.patchValue({ locationOutEntryMethod: "App" });
  //         //   // this.advanceTableForm.controls["locationOutEntryMethod"].disable();
  //         //   this.advanceTableForm.controls["executive"].disable();
  //         //   this.advanceTableForm.patchValue({ executive: this.dataSource[0].firstName + " " + this.dataSource[0].lastName });
  //         //   this.advanceTableForm.patchValue({ locationOutEntryExecutiveID: this.dataSource[0].locationOutEntryExecutiveID });
  //         //   this.advanceTableForm.patchValue({ manualDutySlipNumberByApp: this.dataSource[0].manualDutySlipNumber });

  //         //   this.advanceTableForm.controls["manualDutySlipNumberByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationOutLocationOrHubByApp: this.dataSource[0].locationOutLocationOrHub });
  //         //   this.advanceTableForm.controls["locationOutLocationOrHubByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ actualCarMovedFromByApp: this.dataSource[0].actualCarMovedFrom });
           
  //         //   this.advanceTableForm.controls["actualCarMovedFromByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationOutDateByApp: this.dataSource[0].locationOutDate });
  //         //   this.advanceTableForm.controls["locationOutDateByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationOutTimeByApp: this.dataSource[0].locationOutTime });
  //         //   this.advanceTableForm.controls["locationOutTimeByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationOutKMByApp: this.dataSource[0].locationOutKM });
  //         //   this.advanceTableForm.controls["locationOutKMByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationOutAddressStringByApp: this.dataSource[0].locationOutAddressString });
  //         //   this.advanceTableForm.controls["locationOutAddressStringByApp"].disable();

  //         //   var value = this.dataSource[0].locationOutLatLong.replace(
  //         //     '(',
  //         //     ''
  //         //   );
  //         //   value = value.replace(')', '');
  //         //   var lat = value.split(' ')[2];
  //         //   var long = value.split(' ')[1];
  //         //   this.advanceTableForm.patchValue({ locationOutLatitudeByApp: lat });
  //         //   this.advanceTableForm.patchValue({ locationOutLongitudeByApp: long });

  //         //   this.advanceTableForm.controls["locationOutLatitudeByApp"].disable();
  //         //   this.advanceTableForm.controls["locationOutLongitudeByApp"].disable();
  //         // }

  //         if (this.locationOutEntryMethod === null) {
  //           this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
  //           this.advanceTableForm.patchValue({ locationOutEntryMethod: "Manual" });
  //           // this.advanceTableForm.controls["locationOutEntryMethod"].disable();
  //           this.uploadedByName();
  //         }
  //       },
  //       (error: HttpErrorResponse) => { this.dataSource = null; }
  //     );
  // }

  submit() {
  }
  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();

    }
    else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }

  FetchDataSearch() {
   
    const dialogRef = this.dialog.open(FormDialogFetchComponent, {
      width: '800px',
      data: {
   
      }
    
    });
    dialogRef.afterClosed().subscribe(res => {
       
      if(res!==undefined)
      {
       this.advanceTableForm.patchValue({locationOutKM:res.data.pickupKM});
       this.advanceTableForm.patchValue({locationOutAddressString:res.data.pickupAddressString});
       this.advanceTableForm.patchValue({locationOutLatitude:res.data.pickupLatitude});
       this.advanceTableForm.patchValue({locationOutLongitude:res.data.pickupLongitude});
      }

    })
  }
  
  public Post(): void {
    if (!this.advanceTableForm.valid) {
      console.error('Form Validation Errors:', this.advanceTableForm.errors);
      this.showNotification(
        'snackbar-danger',
        'Please fill all required fields correctly',
        'bottom',
        'center'
      );
      return;
    }
    
    // Ensure coordinates are set before saving
    let latitude = this.advanceTableForm.value.locationOutLatitude;
    let longitude = this.advanceTableForm.value.locationOutLongitude;

    if ((!latitude || !longitude) && this.advanceTableForm.value.locationOutAddressString) {
      const backfilled = this.trySetCoordinatesFromAddress(this.advanceTableForm.value.locationOutAddressString);
      if (backfilled) {
        latitude = this.advanceTableForm.value.locationOutLatitude;
        longitude = this.advanceTableForm.value.locationOutLongitude;
      }
    }
    
    if (!latitude || !longitude) {
      console.error('Latitude or Longitude is missing');
      this.showNotification(
        'snackbar-danger',
        'Please select a valid address with coordinates',
        'bottom',
        'center'
      );
      return;
    }
    
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
     .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Dispatch By Executive Create...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(true);
    },
      error =>
      {
        console.error('Save Error:', error);
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      }
    )
  }
  

   locationGroupValidator(OrganizationalEntitiesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntitiesList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { locationTypeInvalid: true };
    };
  }



  InitLocationHub(){
    this._generalService.GetLocationHub().subscribe(
      data=>
      {
        this.OrganizationalEntitiesList=data;
         this.advanceTableForm.controls['locationOutLocationOrHub'].setValidators([Validators.required,
          this.locationGroupValidator(this.OrganizationalEntitiesList)
        ]);
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls['locationOutLocationOrHub'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizationalsEntity(value || ''))
        ); 
      });

      
  }
  private _filterOrganizationalsEntity(value: string): any {
    const filterValue = value.toLowerCase();
    return this.OrganizationalEntitiesList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  onLocHubSelected(selectedBookerName: string) {
    const selectedBooker = this.OrganizationalEntitiesList.find(
      data => data.organizationalEntityName === selectedBookerName
    );
  
    if (selectedBooker) {
      this.getlocationHubID(selectedBooker.organizationalEntityID,selectedBooker.organizationalEntityAddressString);
    }
  }


  getlocationHubID(locationHubID: any,organizationalEntityAddressString:any) {
    
    this.locationOutLocationOrHubID=locationHubID;
    this.organizationalEntityAddressString = organizationalEntityAddressString;
    this.advanceTableForm.patchValue({locationOutLocationOrHubID:this.locationOutLocationOrHubID});
    // Auto-fill address from location hub
    this.advanceTableForm.patchValue({locationOutAddressString:this.organizationalEntityAddressString});
  }
  
  uploadedByName() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.EmployeeList = data;
        this.advanceTableForm.patchValue({ executive: this.EmployeeList[0].firstName + ' ' + this.EmployeeList[0].lastName });
        this.advanceTableForm.patchValue({locationOutEntryExecutiveID:this.EmployeeList[0].employeeID});
      }
    );
  
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
    // Debug: Show form state before validation
    
    if (!this.advanceTableForm.valid) {
      console.error('Form Validation Errors:', this.advanceTableForm.errors);
      console.error('Form Control Errors:', this.getFormErrors());
      this.showNotification(
        'snackbar-danger',
        'Please fill all required fields correctly',
        'bottom',
        'center'
      );
      return;
    }
    
    // Ensure coordinates are set before saving (with fallback)
    let latitude = this.advanceTableForm.value.locationOutLatitude;
    let longitude = this.advanceTableForm.value.locationOutLongitude;

    if ((!latitude || !longitude) && this.advanceTableForm.value.locationOutAddressString) {
      const backfilled = this.trySetCoordinatesFromAddress(this.advanceTableForm.value.locationOutAddressString);
      if (backfilled) {
        latitude = this.advanceTableForm.value.locationOutLatitude;
        longitude = this.advanceTableForm.value.locationOutLongitude;
      }
    }

    if (!latitude || !longitude) {
      const parsedFromFormLatLong = this.parseCoordinates(this.advanceTableForm.value.locationOutLatLong || '');
      if (parsedFromFormLatLong.lat !== null && parsedFromFormLatLong.long !== null) {
        latitude = parsedFromFormLatLong.lat;
        longitude = parsedFromFormLatLong.long;
      }
    }

    if ((!latitude || !longitude) && this.dataSource && this.dataSource.length > 0) {
      const parsedFromDataSource = this.parseCoordinates(this.dataSource[0]?.locationOutLatLong || '');
      if (parsedFromDataSource.lat !== null && parsedFromDataSource.long !== null) {
        latitude = parsedFromDataSource.lat;
        longitude = parsedFromDataSource.long;
      }
    }

    if ((!latitude || !longitude) && this.data?.rowRecord?.organizationalEntityGeoLocation) {
      const parsedFromOrg = this.parseCoordinates(this.data.rowRecord.organizationalEntityGeoLocation || '');
      if (parsedFromOrg.lat !== null && parsedFromOrg.long !== null) {
        latitude = parsedFromOrg.lat;
        longitude = parsedFromOrg.long;
      }
    }
    

    if (!latitude || !longitude) {
      console.warn('Latitude/Longitude not found, saving without coordinates');
      this.showNotification(
        'snackbar-warning',
        'Coordinates not found. Saving without lat/long.',
        'bottom',
        'center'
      );
    }
    
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({dutySlipByDriverID:this.dutySlipByDriverID});
    this.advanceTableForm.patchValue({ executive: this.EmployeeList[0].firstName + ' ' + this.EmployeeList[0].lastName });
    this.advanceTableForm.patchValue({locationOutEntryExecutiveID:this.EmployeeList[0].employeeID});
    if (latitude && longitude) {
      this.advanceTableForm.patchValue({locationOutLatitude: latitude});
      this.advanceTableForm.patchValue({locationOutLongitude: longitude});
    }
    this.advanceTableForm.patchValue({locationOutLatLong: (latitude && longitude) ? (latitude + ',' + longitude) : ''});
    
    
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Dispatch By Executive Update...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(response);
        this.saveDisabled = true;
    },
      error =>
      {
        console.error('Update Error:', error);
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
  public confirmAdd(): void {
    // Mark all fields as touched to show validation errors
    Object.keys(this.advanceTableForm.controls).forEach(key => {
      this.advanceTableForm.get(key)?.markAsTouched();
    });
    
    if (!this.advanceTableForm.valid) {
      console.error('Form is invalid. Cannot save.', this.getFormErrors());
      return;
    }
    
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
  
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.advanceTableForm.controls).forEach(key => {
      const control = this.advanceTableForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  InitGoogleAddress(){
    this._generalService.getGoogleAddress().subscribe(
      data=>
      {
        this.GoogleAddressList=data;
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['locationOutAddressString'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterGA(value || ''))
        ); 
      });
      
  }

  private _filterGA(value: string): any {
    const filterValue = value.toLowerCase();
    if(filterValue.length===0)
    {
      return []
    }
    return this.GoogleAddressList.filter(
      customer => 
      {
        return customer.geoSearchString.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  onAddressSelected(selectedBookerName: string) {
    const selectedValue = (selectedBookerName || '').trim().toLowerCase();
    const selectedBooker = this.GoogleAddressList.find(
      data => (data.geoSearchString || '').trim().toLowerCase() === selectedValue
    ) || this.GoogleAddressList.find(
      data => (data.geoSearchString || '').trim().toLowerCase().startsWith(selectedValue)
        || selectedValue.startsWith((data.geoSearchString || '').trim().toLowerCase())
    );
  
    if (selectedBooker) {
      this.bindPickupSpotTypeandSpot(selectedBooker);
    } else {
      console.warn('Address not found in GoogleAddressList for:', selectedBookerName);
    }
  }
  bindPickupSpotTypeandSpot(option:any) {
    if (!option) {
      console.error('No option provided');
      return;
    }
    
    this.advanceTableForm.patchValue({locationOutAddressString: option.geoSearchString});
    
    const parsed = this.parseCoordinates(option?.geoLocation || '');
    const lat = parsed.lat;
    const long = parsed.long;
    
    // Only update if we have valid coordinates
    if (lat !== null && long !== null) {
      this.advanceTableForm.patchValue({
        locationOutLatitude: lat,
        locationOutLongitude: long
      });
    } else {
      console.error('Cannot set coordinates - invalid values:', { lat, long });
      this.showNotification(
        'snackbar-warning',
        'Selected address has no valid coordinates',
        'bottom',
        'center'
      );
    }
    
    this.advanceTableForm.get('locationOutAddressString')?.updateValueAndValidity();
  }

  // bindPickupSpotTypeandSpot(option:any)
  // {
  //    this.advanceTableForm.patchValue({locationOutAddressString:option.geoSearchString});
  //    var value = option?.geoLocation?.replace(
  //     '(',
  //     ''
  //   );
  //   value = value?.replace(')', '');
  //   var lat = value?.split(' ')[2];
  //   var long = value?.split(' ')[1];
  //   this.advanceTableForm.patchValue({ locationOutLatitude: lat });
  //   this.advanceTableForm.patchValue({ locationOutLongitude: long });
  // }
  valueSwitch()
  {
    if(this.advanceTableForm.value.googleAddresses===true)
      {
        this.ifBlock=false;
        this.advanceTableForm.controls["locationOutAddressString"].setValue('');
       
      }
      if(this.advanceTableForm.value.googleAddresses===false)
      {
        this.ifBlock=true;
        this.advanceTableForm.controls["locationOutAddressString"].setValue('');
      }

  }

  private trySetCoordinatesFromAddress(address: string): boolean {
    const addressValue = (address || '').trim().toLowerCase();
    if (!addressValue || !this.GoogleAddressList || this.GoogleAddressList.length === 0) {
      return false;
    }

    const matched = this.GoogleAddressList.find(
      item => (item.geoSearchString || '').trim().toLowerCase() === addressValue
    ) || this.GoogleAddressList.find(
      item => (item.geoSearchString || '').trim().toLowerCase().startsWith(addressValue)
        || addressValue.startsWith((item.geoSearchString || '').trim().toLowerCase())
    );

    if (!matched) {
      return false;
    }

    const parsed = this.parseCoordinates(matched.geoLocation || '');
    if (parsed.lat === null || parsed.long === null) {
      return false;
    }

    this.advanceTableForm.patchValue({
      locationOutLatitude: parsed.lat,
      locationOutLongitude: parsed.long
    });
    return true;
  }

  private parseCoordinates(coordinateString: string): { lat: number | null, long: number | null } {
    if (!coordinateString || typeof coordinateString !== 'string') {
      return { lat: null, long: null };
    }

    try {
      const numberTokens = coordinateString.match(/-?\d+(?:\.\d+)?/g) || [];
      if (numberTokens.length < 2) {
        return { lat: null, long: null };
      }

      if (coordinateString.includes(',')) {
        const lat = parseFloat(numberTokens[0]);
        const long = parseFloat(numberTokens[1]);
        if (!isNaN(lat) && !isNaN(long)) {
          return { lat, long };
        }
      }

      const long = parseFloat(numberTokens[0]);
      const lat = parseFloat(numberTokens[1]);
      if (!isNaN(lat) && !isNaN(long)) {
        return { lat, long };
      }

      return { lat: null, long: null };
    } catch {
      return { lat: null, long: null };
    }
  }

  public handleAddressChange(address: any) {
    this.locationOutAddressString = address.formatted_address;
    const lat = address.geometry.location.lat();
    const lng = address.geometry.location.lng();

    this.advanceTableForm.patchValue({
      locationOutAddressString: this.locationOutAddressString,
      locationOutLatitude: lat,
      locationOutLongitude: lng
    });

    this.googlePlacesForm.patchValue({ geoPointID: -1 });
    this.googlePlacesForm.patchValue({ latitude: lat });
    this.googlePlacesForm.patchValue({ longitude: lng });
    this.googlePlacesForm.patchValue({ geoSearchString: this.locationOutAddressString });
    this.googlePlacesForm.patchValue({ geoPointName: 'Google Address' });
    this.googlePlacesForm.patchValue({ googlePlacesID: address.place_id });
    this.googlePlacesForm.patchValue({ activationStatus: true });
    this.PostGoogleAddress();
  }

  public PostGoogleAddress(): void
{
  this.googlePlacesForm.patchValue({geoLocation:this.googlePlacesForm.value.latitude
    +
     ',' +
     this.googlePlacesForm.value.longitude
 });
    this.googlePlacesForm.patchValue({locationOutLatitude:this.googlePlacesForm.value.latitude});
    this.googlePlacesForm.patchValue({locationOutLongitude:this.googlePlacesForm.value.longitude});
  this.reservationService.addGoogleAddress(this.googlePlacesForm.value)  
  .subscribe(
  response => 
  {
    
  },
  error =>
  {
   
  }
)
}


onBlurUpdateDate(value: string): void {
  //value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('locationOutDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('locationOutDate')?.setErrors({ invalidDate: true });
}
}

onTimeInput(event: any): void {
  const inputValue = event.target.value;
  const parsedTime = new Date(`1970-01-01T${inputValue}`);
  if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('locationOutTime').setValue(parsedTime);
  }
}

getCustomerAlertForDispatch(customerID:any)
  {
    let FromToDate = this.FromToDate || ''; // Ensure FromToDate is not undefined
    if (FromToDate.trim() !== '') 
    {
      FromToDate = moment(FromToDate).format('YYYY-MM-DD');
    } 
    else 
    {
      FromToDate = moment().format('YYYY-MM-DD');// If empty, set it to today's date
    }
    this.advanceTableService.getCustomerAlertForDispatch(customerID,FromToDate).subscribe(
      (data: string[]) =>
      {
        if (data && data.length > 0) 
        {
          this.CustomerAlertShow = true;
          this.CustomerAlert = data.join(', ');
        }
        else
        {
          this.CustomerAlertShow = false;
        }      
      }
    );
  }



onLocationHubTyping() {
  // Don't clear coordinates - only mark field as touched
  // The user is typing, not selecting from dropdown yet
  const control = this.advanceTableForm.get('locationOutAddressString');
  control?.markAsTouched();
  control?.updateValueAndValidity();
  
}

// googleAddressValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {

//     if (!control.parent) return null;

//     const latitude = control.parent.get('locationOutLatitude')?.value;
//     const value = control.value;

//     if (!value) return null;

//     if (!latitude) {
//       return { invalidAddress: true };
//     }

//     return null;
//   };
// }

googleAddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) return null;

    const latitude = control.parent.get('locationOutLatitude')?.value;
    const value = control.value;
    const isGoogle = control.parent.get('googleAddresses')?.value;

    if (!value || !value.trim()) {
      return { required: true };
    }

    // Only validate latitude if the address is required to have coordinates
    // Don't enforce coordinates if manual entry is disabled
    const entryMethod = control.parent.get('locationOutEntryMethod')?.value;
    if (isGoogle && !latitude && entryMethod !== 'App') {
      return { googleAddressNotSelected: true };
    }

    return null;
  };
}



}



