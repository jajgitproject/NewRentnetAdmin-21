// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Address } from '@compat/google-places-shim-objects/address';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogFetchComponent } from 'src/app/dispatchFetchData/dialogs/form-dialog/form-dialog.component';
import { FetchDataFromGPSComponent } from '../fetch-data-from-gps/fetch-data-from-gps.component';
import { MatRadioButton } from '@angular/material/radio';
import { GarageIn } from '../../garageIn.model';
import { GarageInDropDown } from '../../garageInDropDown.model';
import { GarageInService } from '../../garageIn.service';
import { FetchGarageInAppDataDialogComponent } from '../fetch-garageIn-app-data/fetch-garageIn-app-data.component';
import { GoogleAddressDropDown } from 'src/app/reservation/googleAddressDropDown.model';
import { ReservationService } from 'src/app/reservation/reservation.service';
import moment from 'moment';
import { ReachedByExecutiveService } from 'src/app/reachedByExecutive/reachedByExecutive.service';
import { DateTimeKMModel } from 'src/app/reachedByExecutive/reachedByExecutive.model';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogGIComponent {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: GarageIn;
  //address: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  addressString: string;
  public EmployeeList?: EmployeeDropDown[] = [];
  public dispatchList?: GarageInDropDown[] = [];
  dataSource: GarageIn[] | null;
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  DriverName: any;
  RegistrationNumber: any;
  AllotmentID: any;
  ReservationID: any;
  LocationInEntryExecutiveID: any;
  locationInLocationOrHubID: any;
  dutySlipID: any;
  saveDisabled:boolean=true;
  //DutySlipByDriverID: any;
  dutySlipByDriverID: any;
  locationInEntryMethod: string;
  selectedValue: string;
  locationInEntry: boolean;
  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];
    dataSourceForValidation: DateTimeKMModel[] | [];
  ifBlock=true;
  indeterminate = false;
  labelPosition: 'before' | 'before' = 'before';
  locationInAddressString: any;
  tab: any;
  dropoffDate: Date;
  dropoffTime: Date;
  dropoffKM: any;
  actualDate: Date;
  actualTime: Date;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;
  transferedLocationID: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogGIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: GarageInService,
    public garageInService: GarageInService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public reservationService: ReservationService,
     public reachedByExecutiveService: ReachedByExecutiveService,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;

    this.advanceTable = data.advanceTable;

    this.advanceTable = new GarageIn({});
    //this.advanceTable.activationStatus=true;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;

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
    this.actualDate = new Date(data.rowRecord.pickup.pickupDate);
    this.actualTime = new Date(data.rowRecord.pickup.pickupTime);
    this.ReservationID = data.reservationID;
    this.AllotmentID = data.allotmentID;
    this.RegistrationNumber = data.registrationNumber;
    this.DriverName = data.driverName;
    this.dutySlipID=data.dutySlipID;
    this.dutySlipByDriverID=data.dutySlipByDriverID;
    this.tab = data.tab;
    this.transferedLocationID = data.transferedLocationID;
  }
  
  createContactForm(): FormGroup {
    return this.fb.group(
      {
        locationInEntryExecutiveID: [''],
        dutySlipID: [''],
        dutySlipByDriverID: [''],
        locationInEntryMethod: [''],
        manualDutySlipNumber: [''],
        manualDutySlipNumberByApp: [''],
        locationInKM:[''],
        actualCarMovedFrom: [''], 
        actualCarMovedFromByApp: [''],    
        locationInDate: [''],
        locationInTime: [''],
        locationInAddressString: ['',[Validators.required, this.googleAddressValidator()]],
        locationInLatitude: [''],
        locationInLongitude: [''],
        executive: [''],
        locationInLatLong:[''],
        //locationInLocationOrHubID:[''],
        locationInLocationOrHub: [''],
        locationInLocationOrHubByApp: [''],
        
        locationInKMByApp: [''],
        locationInLatitudeByApp: [''],
        locationInLongitudeByApp: [''],
        locationInAddressStringByApp:[''],
        locationInLatLongByApp:[''],
        locationInDateByApp:[new Date()],
        locationInTimeByApp:[new Date()],
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
 
  selectRadioButton(event: any) {
    const selectedValue = event.value;
    this.advanceTableForm.patchValue({ locationInEntryMethod: selectedValue });
    if (selectedValue === 'Manual') {
      this.advanceTableForm.controls["locationInDate"].enable();
      this.advanceTableForm.controls["locationInTime"].enable();
      this.advanceTableForm.controls["locationInKM"].enable();
      this.advanceTableForm.controls["locationInAddressString"].enable();
      this.advanceTableForm.controls["locationInLatitude"].enable();
      this.advanceTableForm.controls["locationInLongitude"].enable();
    
    } else if (selectedValue === 'App') {
      // this.advanceTableForm.patchValue({
      //   locationInEntryMethod: selectedValue,
      // });
    
      this.advanceTableForm.controls["locationInDate"].disable();
      this.advanceTableForm.controls["locationInTime"].disable();
      this.advanceTableForm.controls["locationInKM"].disable();
      this.advanceTableForm.controls["locationInAddressString"].disable();
      this.advanceTableForm.controls["locationInLatitude"].disable();
      this.advanceTableForm.controls["locationInLongitude"].disable();
    }
  }

  getDataManual()
  {   
    this.garageInService.getDispatchDetailsForDriver(this.AllotmentID).subscribe
    (
      data => {
      
        this.dataSource = data;

        this.locationInEntryMethod = 'Manual';
          this.locationInEntry = false;
          
          this.InitLocationHub();
          this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
          this.advanceTableForm.patchValue({ locationInEntryMethod: "Manual" });
          // this.advanceTableForm.controls["locationInEntryMethod"].disable();
          this.advanceTableForm.controls["executive"].disable();
          this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
          this.advanceTableForm.patchValue({ locationInEntryExecutiveID: this.dataSource[0]?.locationInEntryExecutiveID });
          // this.advanceTableForm.patchValue({ manualDutySlipNumber: this.dataSource[0]?.manualDutySlipNumber });
          // this.advanceTableForm.patchValue({ actualCarMovedFrom: this.dataSource[0]?.actualCarMovedFrom });
          // this.advanceTableForm.patchValue({ locationInLocationOrHub: this.dataSource[0]?.locationInLocationOrHub });
          //this.advanceTableForm.patchValue({ locationInLocationOrHubID: this.dataSource[0]?.locationInLocationOrHubID });
          this.advanceTableForm.patchValue({ locationInDate: this.dataSource[0]?.locationInDate });
          this.advanceTableForm.patchValue({ locationInTime: this.dataSource[0]?.locationInTime });
          this.advanceTableForm.patchValue({ locationInKM: this.dataSource[0]?.locationInKM });
          this.advanceTableForm.patchValue({ locationInAddressString: this.dataSource[0]?.locationInAddressString || this.data.rowRecord.organizationalEntityAddressString });
          var value = this.dataSource[0]?.locationInLatLong?.replace('(','') || this.data.rowRecord.organizationalEntityGeoLocation?.replace( '(','');
          value = value?.replace(')', '');
          var lat = value?.split(' ')[2];
          var long = value?.split(' ')[1];
          this.advanceTableForm.patchValue({ locationInLatitude: lat });
          this.advanceTableForm.patchValue({ locationInLongitude: long });
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );

  }
  getDataApp(){
 
    this.garageInService.getDispatchDetailsForApp(this.AllotmentID).subscribe
    (
      data => {
      
        this.dataSource = data;
        this.locationInEntryMethod = 'App';
          this.locationInEntry = true;
          
          this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
          this.advanceTableForm.patchValue({ locationInEntryMethod: "App" });
          // this.advanceTableForm.controls["locationInEntryMethod"].disable();
          this.advanceTableForm.controls["executive"].disable();
          this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
          this.advanceTableForm.patchValue({ locationInEntryExecutiveID: this.dataSource[0]?.locationInEntryExecutiveID });
          this.advanceTableForm.patchValue({ manualDutySlipNumberByApp: this.dataSource[0]?.manualDutySlipNumber });

          this.advanceTableForm.controls["manualDutySlipNumberByApp"].disable();
          this.advanceTableForm.patchValue({ locationInLocationOrHubByApp: this.dataSource[0]?.locationInLocationOrHub });
          this.advanceTableForm.controls["locationInLocationOrHubByApp"].disable();
          this.advanceTableForm.patchValue({ actualCarMovedFromByApp: this.dataSource[0]?.actualCarMovedFrom });
         
          this.advanceTableForm.controls["actualCarMovedFromByApp"].disable();
          this.advanceTableForm.patchValue({ locationInDateByApp: this.dataSource[0]?.locationInDate });
          this.advanceTableForm.controls["locationInDateByApp"].disable();
          //this.advanceTableForm.controls["locationInDateByApp"].disable();
          //this.advanceTableForm.patchValue({ locationInTimeByApp: this.dataSource[0]?.locationInTime });
          this.advanceTableForm.controls["locationInTimeByApp"].disable();
          this.advanceTableForm.patchValue({ locationInKMByApp: this.dataSource[0]?.locationInKM });
          this.advanceTableForm.controls["locationInKMByApp"].disable();
          this.advanceTableForm.patchValue({ locationInAddressStringByApp: this.dataSource[0]?.locationInAddressString });
          this.advanceTableForm.controls["locationInAddressStringByApp"].disable();

          var value = this.dataSource[0]?.locationInLatLong?.replace(
            '(',
            ''
          );
          value = value?.replace(')', '');
          var lat = value?.split(' ')[2];
          var long = value?.split(' ')[1];
          this.advanceTableForm.patchValue({ locationInLatitudeByApp: lat });
          this.advanceTableForm.patchValue({ locationInLongitudeByApp: long });

          this.advanceTableForm.controls["locationInLatitudeByApp"].disable();
          this.advanceTableForm.controls["locationInLongitudeByApp"].disable();
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null; }
    );

  }
  ngOnInit() 
  {
    if(this.tab==="Manual")
    {
      this.getDataManual();
    }
    else if(this.tab==="APP")
    {
      this.getDataApp();
    }
    else if(this.tab==="GPS")
    {
      //this.getDataApp();
    }
   this.loadDataFordatetime();
   this.InitGoogleAddress();
  //  if (!this.advanceTableForm.get('locationInEntryMethod').value) {
  //   this.advanceTableForm.patchValue({ locationInEntryMethod: "Manual" });
  // }
    //this.getDataApp();

    this.advanceTableForm.controls["pickUpTime"]?.setValue(this.data.rowRecord?.locationInTime);
    this.advanceTableForm.controls['dropOffEntryMethod']?.setValue(this.data?.rowRecord?.dropOff);
    this.getDataManual();
    this.uploadedByName();
    this.InitLocationHub(); 
  }


  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  AddressChange(address: Address) {
    this.addressString = address.formatted_address
    this.advanceTableForm.patchValue({ locationInAddressString: this.addressString});
    this.advanceTableForm.patchValue({ locationInLatitude: address.geometry.location.lat() });
    this.advanceTableForm.patchValue({ locationInLongitude: address.geometry.location.lng() });
  }

  locationTimeSet(event) {
    if (this.action === 'edit') {
      let time = this.advanceTableForm.value.pickupTime;
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationInTime: newDate });
    }
    else {
      let time = event.getTime();
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationInTime: newDate });
    }
  }

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
        
       this.advanceTableForm.patchValue({locationInAddressString:res.data[0].pickupAddressString});
       this.advanceTableForm.patchValue({locationInKM:res.data[0].pickupKM});
       this.advanceTableForm.patchValue({locationInLatitude:res.data[0].pickupLatitude});
       this.advanceTableForm.patchValue({locationInLongitude:res.data[0].pickupLongitude});
      }
    })
  }
 
  // public loadData() {
    
  //   this.dispatchByExecutiveService.getDispatchDetailsForDriver(this.AllotmentID).subscribe
  //     (
  //       data => {
  //         this.dataSource = data;
          
  //         this.locationInEntryMethod = this.dataSource[0]?.locationInEntryMethod ?? 'Manual';

  //        if (this.locationInEntryMethod === 'Manual') {
  //           this.locationInEntry = false;
  //          this.InitLocationHub();
         
  //           this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
  //           this.advanceTableForm.patchValue({ locationInEntryMethod: "Manual" });
  //           // this.advanceTableForm.controls["locationInEntryMethod"].disable();
  //           this.advanceTableForm.controls["executive"].disable();
  //           this.advanceTableForm.patchValue({ executive: this.dataSource[0]?.firstName + " " + this.dataSource[0]?.lastName });
  //           this.advanceTableForm.patchValue({ locationInEntryExecutiveID: this.dataSource[0]?.locationInEntryExecutiveID });
  //           this.advanceTableForm.patchValue({ manualDutySlipNumber: this.dataSource[0]?.manualDutySlipNumber });
  //           this.advanceTableForm.patchValue({ actualCarMovedFrom: this.dataSource[0]?.actualCarMovedFrom });
  //           this.advanceTableForm.patchValue({ locationInLocationOrHub: this.dataSource[0]?.locationInLocationOrHub });
  //           this.advanceTableForm.patchValue({ locationInLocationOrHubID: this.dataSource[0]?.locationInLocationOrHubID });
  //           this.advanceTableForm.patchValue({ locationInDate: this.dataSource[0]?.locationInDate });
  //           this.advanceTableForm.patchValue({ locationInTime: this.dataSource[0]?.locationInTime });
  //           this.advanceTableForm.patchValue({ locationInKM: this.dataSource[0]?.locationInKM });
  //           this.advanceTableForm.patchValue({ locationInAddressString: this.dataSource[0]?.locationInAddressString });
  //           var value = this.dataSource[0]?.locationInLatLong?.replace(
  //             '(',
  //             ''
  //           );
  //           value = value?.replace(')', '');
  //           var lat = value?.split(' ')[2];
  //           var long = value?.split(' ')[1];
  //           this.advanceTableForm.patchValue({ locationInLatitude: lat });
  //           this.advanceTableForm.patchValue({ locationInLongitude: long });
  //         }

  //         // if (this.locationInEntryMethod === 'App') 
  //         //   {
         
  //         //   this.locationInEntry = true;
  //         //   this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0].dutySlipID });
  //         //   this.advanceTableForm.patchValue({ locationInEntryMethod: "App" });
  //         //   // this.advanceTableForm.controls["locationInEntryMethod"].disable();
  //         //   this.advanceTableForm.controls["executive"].disable();
  //         //   this.advanceTableForm.patchValue({ executive: this.dataSource[0].firstName + " " + this.dataSource[0].lastName });
  //         //   this.advanceTableForm.patchValue({ locationInEntryExecutiveID: this.dataSource[0].locationInEntryExecutiveID });
  //         //   this.advanceTableForm.patchValue({ manualDutySlipNumberByApp: this.dataSource[0].manualDutySlipNumber });

  //         //   this.advanceTableForm.controls["manualDutySlipNumberByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationInLocationOrHubByApp: this.dataSource[0].locationInLocationOrHub });
  //         //   this.advanceTableForm.controls["locationInLocationOrHubByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ actualCarMovedFromByApp: this.dataSource[0].actualCarMovedFrom });
           
  //         //   this.advanceTableForm.controls["actualCarMovedFromByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationInDateByApp: this.dataSource[0].locationInDate });
  //         //   this.advanceTableForm.controls["locationInDateByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationInTimeByApp: this.dataSource[0].locationInTime });
  //         //   this.advanceTableForm.controls["locationInTimeByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationInKMByApp: this.dataSource[0].locationInKM });
  //         //   this.advanceTableForm.controls["locationInKMByApp"].disable();
  //         //   this.advanceTableForm.patchValue({ locationInAddressStringByApp: this.dataSource[0].locationInAddressString });
  //         //   this.advanceTableForm.controls["locationInAddressStringByApp"].disable();

  //         //   var value = this.dataSource[0].locationInLatLong.replace(
  //         //     '(',
  //         //     ''
  //         //   );
  //         //   value = value.replace(')', '');
  //         //   var lat = value.split(' ')[2];
  //         //   var long = value.split(' ')[1];
  //         //   this.advanceTableForm.patchValue({ locationInLatitudeByApp: lat });
  //         //   this.advanceTableForm.patchValue({ locationInLongitudeByApp: long });

  //         //   this.advanceTableForm.controls["locationInLatitudeByApp"].disable();
  //         //   this.advanceTableForm.controls["locationInLongitudeByApp"].disable();
  //         // }

  //         if (this.locationInEntryMethod === null) {
  //           this.advanceTableForm.patchValue({ dutySlipID: this.dataSource[0]?.dutySlipID });
  //           this.advanceTableForm.patchValue({ locationInEntryMethod: "Manual" });
  //           // this.advanceTableForm.controls["locationInEntryMethod"].disable();
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
   
    const dialogRef = this.dialog.open(FetchGarageInAppDataDialogComponent, {
      width: '800px',
      data: {
   
      }
    
    });
    dialogRef.afterClosed().subscribe(res => {
       
      if(res!==undefined)
      {
       
       this.advanceTableForm.patchValue({locationInKM:res.data.pickupKM});
       this.advanceTableForm.patchValue({locationInAddressString:res.data.pickupAddressString});
       this.advanceTableForm.patchValue({locationInLatitude:res.data.pickupLatitude});
       this.advanceTableForm.patchValue({locationInLongitude:res.data.pickupLongitude});
      }

    })
   
  }
  
  public Post(): void {
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Garage In Create...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close();
    },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      }
    )
  }

  InitLocationHub(){
    this._generalService.GetLocationHub().subscribe(
      data=>
      {
        this.OrganizationalEntitiesList=data;
        this.filteredOrganizationalEntityOptions = this.advanceTableForm.controls['locationInLocationOrHub'].valueChanges.pipe(
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

  getlocationHubID(locationHubID: any) {
    
    this.locationInLocationOrHubID=locationHubID;
    this.advanceTableForm.patchValue({locationInLocationOrHubID:this.locationInLocationOrHubID});
  }
  
  uploadedByName() {
  
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
     
        this.EmployeeList = data;
      
        this.advanceTableForm.patchValue({ executive: this.EmployeeList[0].firstName + ' ' + this.EmployeeList[0].lastName });
        this.advanceTableForm.patchValue({locationInEntryExecutiveID:this.EmployeeList[0].employeeID});
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
    this.saveDisabled = false;
     if (!this.isReportingValid()) 
    {
      return; // Don't proceed if invalid
    }
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({dutySlipByDriverID:this.dutySlipByDriverID});
    this.advanceTableForm.patchValue({ executive: this.EmployeeList[0].firstName + ' ' + this.EmployeeList[0].lastName });
    this.advanceTableForm.patchValue({locationInEntryExecutiveID:this.EmployeeList[0].employeeID});
    
    // Ensure latitude and longitude are always set (even if empty)
    const lat = this.advanceTableForm.value.locationInLatitude || '';
    const long = this.advanceTableForm.value.locationInLongitude || '';
    
    this.advanceTableForm.patchValue({locationInLatitude: lat});
    this.advanceTableForm.patchValue({locationInLongitude: long});
    
    // Only create latLong if both coordinates are numeric values
    if (lat && long && !isNaN(lat) && !isNaN(long)) {
      this.advanceTableForm.patchValue({locationInLatLong: lat + ',' + long});
    } else {
      // Don't send locationInLatLong if coordinates are not valid
      this.advanceTableForm.patchValue({locationInLatLong: null});
    }
    
    const formData = this.advanceTableForm.getRawValue();
    
    // Remove locationInLatLong from submission if it's null or empty
    if (!formData.locationInLatLong) {
      delete formData.locationInLatLong;
    }
    
    this.advanceTableService.update(formData)
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Garage In Update...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
        this.dialogRef.close(response);
    },
      error =>
      {
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
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  InitGoogleAddress(){
    this._generalService.getGoogleAddress().subscribe(
      data=>
      {
        this.GoogleAddressList=data;
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['locationInAddressString'].valueChanges.pipe(
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
    }
  }

  bindPickupSpotTypeandSpot(option:any)
  {
     this.advanceTableForm.patchValue({locationInAddressString:option.geoSearchString});
    const parsed = this.parseCoordinates(option?.geoLocation || '');
    const lat = parsed.lat;
    const long = parsed.long;
    this.advanceTableForm.patchValue({ locationInLatitude: lat });
    this.advanceTableForm.patchValue({ locationInLongitude: long });
  }
  valueSwitch()
  {
    if(this.advanceTableForm.value.googleAddresses===true)
      {
        this.ifBlock=false;
        this.advanceTableForm.controls["locationInAddressString"].setValue('');
       
      }
      if(this.advanceTableForm.value.googleAddresses===false)
      {
        this.ifBlock=true;
        this.advanceTableForm.controls["locationInAddressString"].setValue('');
      }

  }

  // AddressChange(address: Address) {
  //   this.addressString = address.formatted_address
  //   this.advanceTableForm.patchValue({ locationInAddressString: this.addressString});
  //   this.advanceTableForm.patchValue({ locationInLatitude: address.geometry.location.lat() });
  //   this.advanceTableForm.patchValue({ locationInLongitude: address.geometry.location.lng() });
  // }

public handleAddressChange(address: any) {

  this.advanceTableForm.patchValue({
    locationInAddressString: address.formatted_address,
    locationInLatitude: address.geometry.location.lat(),
    locationInLongitude: address.geometry.location.lng()
  });

  const control = this.advanceTableForm.get('locationInAddressString');

  control?.markAsTouched();
  control?.updateValueAndValidity();
}

  public PostGoogleAddress(): void
{
  this.googlePlacesForm.patchValue({geoLocation:this.googlePlacesForm.value.latitude
    +
     ',' +
     this.googlePlacesForm.value.longitude
 });
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
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('locationInDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('locationInDate')?.setErrors({ invalidDate: true });
  }
}

onTimeInput(event: any): void {
  const inputValue = event.target.value;
  const parsedTime = new Date(`1970-01-01T${inputValue}`);
  if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('locationInTime').setValue(parsedTime);
  }
}
  public loadDataFordatetime() {
    this.reachedByExecutiveService.getDataOfDateTimeKM(this.dutySlipID).subscribe
      (
        data => {
          this.dataSourceForValidation = data;
          this.dropoffDate = new Date(data.dropOffDate);  // e.g. "2025-06-02T00:00:00"
          this.dropoffTime = new Date(data.dropOffTime);  // e.g. "2025-06-02T15:00:00"
          this.dropoffKM = data.dropOffKM;

        },
        (error: HttpErrorResponse) => { this.dataSourceForValidation = null; }
      );
  }

  private isReportingValid(): boolean {    
        const date = new Date(this.advanceTableForm.value.locationInDate);
        const time = new Date(this.advanceTableForm.value.locationInTime);
        const km = +this.advanceTableForm.value.locationInKM;

        const dropoffDateTime = new Date(this.dropoffDate);
        dropoffDateTime.setHours(this.dropoffTime?.getHours());
        dropoffDateTime.setMinutes(this.dropoffTime.getMinutes());

        const lockInDateTime = new Date(date);
        lockInDateTime.setHours(time.getHours());
        lockInDateTime.setMinutes(time.getMinutes());

        const isDateTimeValid = lockInDateTime >= dropoffDateTime;
        const isKmValid = km >= this.dropoffKM;

        const formatDateDDMMYYYY = (date: Date) => {
          const d = date.getDate().toString().padStart(2, '0');
          const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const y = date.getFullYear();
          return `${d}-${m}-${y}`;
        };

        if (!isDateTimeValid || !isKmValid) {
          Swal.fire({
            title: 'Invalid DropOff Details',
            icon: 'warning',
            html: `
              <b>Garage In Date, Time and KM must be greater than Dropoff values.</b><br><br>
              <b>Drop off Date:</b> ${formatDateDDMMYYYY(this.dropoffDate)}<br>
              <b>Drop off Time:</b> ${this.dropoffTime.toLocaleTimeString()}<br>
              <b>Drop off KM:</b> ${this.dropoffKM}
              `
            }).then((result) => {
              if (result.isConfirmed) {
                this.saveDisabled = true;
              }
          });
          return false;
        }
      return true;
    }
  onTypingLocation() {
  this.advanceTableForm.patchValue({
    locationInLatitude: null,
    locationInLongitude: null
  });

  const control = this.advanceTableForm.get('locationInAddressString');
  control?.markAsTouched();
  control?.updateValueAndValidity(); // 🔥 VERY IMPORTANT
}




googleAddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) return null;

    const latitude = control.parent.get('locationInLatitude')?.value;
    const value = control.value;

    if (!value) return null;

    if (!latitude) {
      return { invalidAddress: true };
    }

    return null;
  };
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
  } catch {
    // no-op: invalid coordinate input
  }

  return { lat: null, long: null };
}

}



