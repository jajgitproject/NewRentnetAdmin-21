// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PickUpByExecutiveService } from '../../pickUpByExecutive.service';
import { PickUpByExecutive } from '../../pickUpByExecutive.model';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { FetchPickupAppDataDialogComponent } from '../fetch-pickup-app-data/fetch-pickup-app-data.component';
import { FetchDataFromGPSComponent } from '../fetch-data-from-gps/fetch-data-from-gps.component';
import { HttpErrorResponse } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { GoogleAddressDropDown } from 'src/app/reservation/googleAddressDropDown.model';
import { Observable } from 'rxjs';
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

export class FormDialogComponentPUBE 
{
  showError: string;
  action: string;
  dialogTitle: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  advanceTableForm: FormGroup;
  advanceTable: PickUpByExecutive;
  dataSource: PickUpByExecutive[] | [];
  employeeDataSource:EmployeeDropDown[]|[]
  geoStringAddress: string;
  geoLat: number;
  geoLng: number;
  pickupAddress: string;
  allotmentID: any;
  driverName: any;
  regno: any;
  reservationID: any;
  dutySlipID: any;
  dutySlipByDriverID: any;
  pickupEntryMethod:string;
  manualRadioDisabled: boolean = true;
  appRadioDisabled: boolean = true;
  gpsRadioDisabled: boolean = true;
  pickupEntry= false;
  filteredGoogleAddressOptions: Observable<GoogleAddressDropDown[]>;
  public GoogleAddressList?: GoogleAddressDropDown[] = [];
  ifBlock=true;
  indeterminate = false;
  labelPosition: 'before' | 'before' = 'before';
  customerPersonID:number;
  customerPersonName:string;
  saveDisabled:boolean=true;
  tab: any;

  dataSourceForValidation:DateTimeKMModel[]|[];
    locationOutDate: Date;
    locationOutTime: Date;
    locationOutKm: number;
    exactDate: any;
    pickupTime: any;
  reportingToGuestDate: Date;
  reportingToGuestTime: Date;
  reportingToGuestKM: any;
  pickUpDate: Date;
  pickUpTime: Date;
  pickUpKM: number;
  actualTime: any;
  actualDate: Date;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentPUBE>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PickUpByExecutiveService,
  public reservationService: ReservationService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService,
public reachedByExecutiveService: ReachedByExecutiveService)
  {
        // Set the defaults
        // this.action = data.action;
        // if (this.action === 'edit') 
        // {
        //   this.dialogTitle ='Pick Up By Executive';       
        //   this.advanceTable = data.advanceTable;
        // } else 
        // {
        //   this.dialogTitle = 'Pick Up By Executive';
        //   this.advanceTable = new PickUpByExecutive({});
        //   //this.advanceTable.activationStatus=true;
        // }
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        this.allotmentID=data.allotmentID;
        this.driverName=data.driverName;
        this.regno=data.regno;
        this.reservationID=data.reservationID;
        this.dutySlipID=data.dutySlipID;
        this.dutySlipByDriverID=data.dutySlipByDriverID;
        this.customerPersonID = data.customerPersonID,
        this.customerPersonName = data.customerPersonName,
        this.tab = data.tab;
        this.actualDate = new Date(data.rowRecord.pickup.pickupDate);
        this.actualTime = new Date(data.rowRecord.pickup.pickupTime);
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
  .replace(/[^a-z\s]/g, '');

this.isSaveAllowed = status === 'changes allow';
  
        // this.advanceTableForm.controls['pickUpTime'].setValue(data?.rowRecord?.pickupEntryMethod);
        if (data?.rowRecord?.pickupEntryMethod === 'Manual') {
          this.appRadioDisabled = true;
          this.gpsRadioDisabled = true;
          
        } else if (data?.rowRecord?.pickupEntryMethod  === 'App') {
          this.manualRadioDisabled = true;
          this.gpsRadioDisabled = true;
        } else if (data?.rowRecord?.pickupEntryMethod  === 'GPS') {
          this.manualRadioDisabled = true;
          this.appRadioDisabled = true;
         
        }
  }

  ngOnInit()
  {
    if(this.tab==="Manual")
      {
        this.saveManualData();
      }
      else if(this.tab==="APP")
      {
        this.saveAppData();
      }
      else if(this.tab==="GPS")
      {
        //this.getDataApp();
      }
    this.getDutySlipData();
    this.InitGoogleAddress();
    // this.advanceTableForm.markAllAsTouched();
    console.log(this.advanceTableForm.valid);
    // if (!this.advanceTableForm.get('pickupEntryMethod').value) {
    //   this.advanceTableForm.patchValue({ pickupEntryMethod: "Manual" });
    //}
    this.advanceTableForm.controls["pickUpTime"].setValue(this.data.rowRecord?.pickup?.pickupTime);
    this.loadData();
  }

  getDutySlipData()
  {
    this.advanceTableService.getDutySlip(this.allotmentID)?.subscribe(
      (data:PickUpByExecutive[])=>
      {
        this.dataSource=data;
        
        this.pickupEntryMethod = this.dataSource[0].pickupEntryMethod ?? 'Manual';
        // this.advanceTableForm.controls['pickupEntryMethod'].setValue(this.pickupEntryMethod);
        if(this.dataSource[0].pickupEntryMethod==='Manual' )
        {
          this.pickupEntry = false;
          this.ifBlock=true;
          this.advanceTableForm.patchValue({dutySlipID:this.dataSource[0].dutySlipID});
          this.advanceTableForm.patchValue({executive:this.dataSource[0].firstName+" "+this.dataSource[0]?.lastName});
          this.advanceTableForm.patchValue({pickupEntryExecutiveID:this.dataSource[0].pickupEntryExecutiveID});
          this.advanceTableForm.patchValue({pickUpDate:this.dataSource[0].pickUpDate});
          this.advanceTableForm.patchValue({pickUpTime:this.dataSource[0].pickUpTime});
          this.advanceTableForm.patchValue({pickUpKM:this.dataSource[0].pickUpKM === 0 ? '' : this.dataSource[0].pickUpKM});
          this.advanceTableForm.patchValue({pickUpAddressString:this.dataSource[0].pickUpAddressString});
          var value = this.dataSource[0].pickUpLatLong?.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];
          this.advanceTableForm.patchValue({pickUpLatitude:lat});
          this.advanceTableForm.patchValue({pickUpLongitude:long});
        }

       else if(this.dataSource[0].pickupEntryMethod==='App')
        {
          this.pickupEntry = true;
          this.advanceTableForm.patchValue({dutySlipID:this.dataSource[0].dutySlipID});
          this.advanceTableForm.patchValue({executive:this.dataSource[0].firstName+" "+this.dataSource[0].lastName});
          this.advanceTableForm.patchValue({pickupEntryExecutiveID:this.dataSource[0].pickupEntryExecutiveID});
          this.advanceTableForm.patchValue({pickUpDateByApp:this.dataSource[0].pickUpDate});
          this.advanceTableForm.controls["pickUpDateByApp"].disable();
          this.advanceTableForm.patchValue({pickUpTimeByApp:this.dataSource[0].pickUpTime});
          this.advanceTableForm.controls["pickUpTimeByApp"].disable();
          this.advanceTableForm.patchValue({pickUpKMByApp:this.dataSource[0].pickUpKM === 0 ? '' : this.dataSource[0].pickUpKM});
          this.advanceTableForm.controls["pickUpKMByApp"].disable();
          this.advanceTableForm.patchValue({pickUpAddressStringByApp:this.dataSource[0].pickUpAddressString});
          this.advanceTableForm.controls["pickUpAddressStringByApp"].disable();
          var value = this.dataSource[0].pickUpLatLong.replace(
            '(',
            ''
          );
          value = value.replace(')', '');
          var lat = value.split(' ')[2];
          var long = value.split(' ')[1];
          this.advanceTableForm.patchValue({pickUpLatitudeByApp:lat});
          this.advanceTableForm.controls["pickUpLatitudeByApp"].disable();
          this.advanceTableForm.patchValue({pickUpLongitudeByApp:long});
          this.advanceTableForm.controls["pickUpLongitudeByApp"].disable();
        }

        if(this.dataSource[0].pickupEntryMethod===null)
        {
          this.advanceTableForm.patchValue({dutySlipID:this.dataSource[0].dutySlipID});
          this.getEmployee();
        }
        
      }
    );
  }

  getEmployee()
  {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>
      {
        this.employeeDataSource=data;
        console.log(this.employeeDataSource)
        //this.advanceTableForm.controls["executive"].disable();
        this.advanceTableForm.patchValue({executive:this.employeeDataSource[0].firstName+" "+this.employeeDataSource[0].lastName});
        this.advanceTableForm.patchValue({pickupEntryExecutiveID:this.employeeDataSource[0].employeeID});
      }
    );
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipByDriverID: [''],
      dutySlipID: [''],
      pickupEntryExecutiveID: [''],
      pickupEntryMethod: [''],
      executive: [''],
      pickUpDate: [new Date()],
     pickUpTime:[new Date()],
      pickUpKM: [''],
     pickUpAddressString: [
  '',
  [
    Validators.required,
    this.googlePickupValidator()
  ]
],
      pickUpLatitude: [''],
      pickUpLongitude: [''],
      pickUpLatLong:[''],
      // App
      pickUpDateByApp: [new Date()],
      pickUpTimeByApp: [new Date()],
      pickUpKMByApp: [''],
      pickUpAddressStringByApp: [''],
      pickUpLatitudeByApp: [''],
      pickUpLongitudeByApp:[''],
      googleAddresses:[''],
      //pickUpLatitudeByApp: [''],
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

onPickupTyping() {

  this.advanceTableForm.patchValue({
    pickUpLatitude: null,
    pickUpLongitude: null
  });

  const control = this.advanceTableForm.get('pickUpAddressString');
  control?.markAsTouched();
  control?.updateValueAndValidity();
}




googlePickupValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) return null;

    const latitude = control.parent.get('pickUpLatitude')?.value;

    if (!control.value) return null; // required handle karega

    if (!latitude) {
      return { invalidAddress: true };
    }

    return null;
  };
}



  saveManualData(){
    {
      this.advanceTableService.getPickUpDriverExectiveDetails(this.allotmentID).subscribe(
        (data:PickUpByExecutive[])=>
          {
            this.dataSource=data;
          this.pickupEntryMethod = 'Manual';
          this.pickupEntry = false;
          this.ifBlock=true;
          
            this.advanceTableForm.patchValue({dutySlipID:this.dataSource[0]?.dutySlipID});
            this.advanceTableForm.patchValue({pickupEntryMethod:"Manual"});
            //this.advanceTableForm.controls["pickupEntryMethod"].disable();
            //this.advanceTableForm.controls["executive"].disable();
            this.advanceTableForm.patchValue({executive:this.dataSource[0]?.firstName+" "+this.dataSource[0]?.lastName});
            this.advanceTableForm.patchValue({pickupEntryExecutiveID:this.dataSource[0]?.pickupEntryExecutiveID});
            // this.advanceTableForm.patchValue({pickUpDate:this.dataSource[0]?.pickUpDate});
            // this.advanceTableForm.patchValue({pickUpTime:this.dataSource[0]?.pickUpTime});
            //this.advanceTableForm.controls["pickUpTime"].disable();
            this.advanceTableForm.patchValue({pickUpKM:this.dataSource[0]?.pickUpKM === 0 ? '' : this.dataSource[0]?.pickUpKM});
            //this.advanceTableForm.controls["pickUpKM"].disable();
            this.advanceTableForm.patchValue({pickUpAddressString:this.dataSource[0]?.pickUpAddressString});
           // this.advanceTableForm.controls["pickUpAddressString"].disable();
            var value = this.dataSource[0]?.pickUpLatLong.replace(
              '(',
              ''
            );
            value = value?.replace(')', '');
            var lat = value?.split(' ')[2];
            var long = value?.split(' ')[1];
            this.advanceTableForm.patchValue({pickUpLatitude:lat});
            //this.advanceTableForm.controls["pickUpLatitude"].disable();
            this.advanceTableForm.patchValue({pickUpLongitude:long});
            //this.advanceTableForm.controls["pickUpLongitude"].disable();
            console.log(this.advanceTableForm.valid);
          },

          (error: HttpErrorResponse) => { this.dataSource = null; }
        );
  }

  }

  saveAppData(){
    this.advanceTableService.getPickupAppExectiveDetails(this.allotmentID).subscribe(
      (data:PickUpByExecutive[])=>
        {
          this.dataSource=data;
        this.pickupEntryMethod = 'App';
        this.pickupEntry = true;
        
          this.advanceTableForm.patchValue({dutySlipID:this.dataSource[0]?.dutySlipID});
          this.advanceTableForm.patchValue({pickupEntryMethod:"App"});
          //this.advanceTableForm.controls["pickupEntryMethod"].disable();
          //this.advanceTableForm.controls["executive"].disable();
          this.advanceTableForm.patchValue({executive:this.dataSource[0]?.firstName+" "+this.dataSource[0]?.lastName});
          this.advanceTableForm.patchValue({pickupEntryExecutiveID:this.dataSource[0]?.pickupEntryExecutiveID});
          this.advanceTableForm.patchValue({pickUpDateByApp:this.dataSource[0]?.pickUpDate});
          this.advanceTableForm.controls["pickUpDateByApp"].disable();
          this.advanceTableForm.patchValue({pickUpTimeByApp:this.dataSource[0]?.pickUpTime});
          this.advanceTableForm.controls["pickUpTimeByApp"].disable();
          this.advanceTableForm.patchValue({pickUpKMByApp:this.dataSource[0]?.pickUpKM === 0 ? '' : this.dataSource[0]?.pickUpKM});
          this.advanceTableForm.controls["pickUpKMByApp"].disable();
          this.advanceTableForm.patchValue({pickUpAddressStringByApp:this.dataSource[0]?.pickUpAddressString});
          this.advanceTableForm.controls["pickUpAddressStringByApp"].disable();
          var value = this.dataSource?.[0]?.pickUpLatLong?.replace(
            '(',
            ''
          );
          value = value?.replace(')', '');
          var lat = value?.split(' ')[2];
          var long = value?.split(' ')[1];
          this.advanceTableForm.patchValue({pickUpLatitudeByApp:lat});
          this.advanceTableForm.patchValue({pickUpLongitudeByApp:long});
          this.advanceTableForm.controls["pickUpLatitudeByApp"].disable();
          this.advanceTableForm.controls["pickUpLongitudeByApp"].disable();
        },

        (error: HttpErrorResponse) => { this.dataSource = null; }
      );

  }

  selectRadioButton(event: any): void {
    const selectedValue = event.value;
    this.advanceTableForm.patchValue({ pickupEntryMethod: selectedValue });
  
    // Enable or disable controls based on selected radio button
    if (selectedValue === 'Manual') {
      this.advanceTableForm.controls["pickUpDate"].enable();
      this.advanceTableForm.controls["pickUpTime"].enable();
      this.advanceTableForm.controls["pickUpKM"].enable();
      this.advanceTableForm.controls["pickUpAddressString"].enable();
      this.advanceTableForm.controls["pickUpLatitude"].enable();
      this.advanceTableForm.controls["pickUpLongitude"].enable();
    } else if (selectedValue === 'App') {
      this.advanceTableForm.patchValue({ 
        pickupEntryMethod: selectedValue,
      });
      this.advanceTableForm.controls["pickUpDate"].disable();
      this.advanceTableForm.controls["pickUpTime"].disable();
      this.advanceTableForm.controls["pickUpKM"].disable();
      this.advanceTableForm.controls["pickUpAddressString"].disable();
      this.advanceTableForm.controls["pickUpLatitude"].disable();
      this.advanceTableForm.controls["pickUpLongitude"].disable();    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

AddressChange(address: Address) {

  this.pickupAddress = address.formatted_address;

  this.advanceTableForm.patchValue({
    pickUpLatitude: address.geometry.location.lat(),
    pickUpLongitude: address.geometry.location.lng(),
    pickUpAddressString: this.pickupAddress
  });

  const control = this.advanceTableForm.get('pickUpAddressString');

  control?.markAsTouched();        // 🔥 Important
  control?.updateValueAndValidity();
}


 public handleAddressChange(address: any) {    
    this.pickupAddress = address.formatted_address;
    this.advanceTableForm.patchValue({ pickUpAddressString: this.pickupAddress });
    var value = address?.geoLocation?.replace(
      '(',
      ''
    );
    value = value?.replace(')', '');
    var lat = value?.split(' ')[2];
    var long = value?.split(' ')[1];
    this.advanceTableForm.patchValue({ pickUpLatitude: lat });
    this.advanceTableForm.patchValue({ pickUpLongitude: long });

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
     
    this.googlePlacesForm.patchValue({geoPointID:-1});
    this.googlePlacesForm.patchValue({latitude:address.geometry.location.lat()});
    this.googlePlacesForm.patchValue({longitude:address.geometry.location.lng()}); 
    this.googlePlacesForm.patchValue({geoSearchString:this.pickupAddress});
    this.googlePlacesForm.patchValue({geoPointName:'Google Address'});
    this.googlePlacesForm.patchValue({googlePlacesID:address.place_id});
    this.googlePlacesForm.patchValue({activationStatus:true});
    this.PostGoogleAddress();
    
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

  submit() 
  {
    console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
      this.advanceTableForm.reset();
  }
  // public Post(): void
  // {
  //   debugger;
  //   this.advanceTableService.add(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //   response => 
  //   {
     
  //       this.dialogRef.close();
  //      this._generalService.sendUpdate('Create:View:Success');//To Send Updates  
    
  // },
  //   error =>
  //   {
  //      this._generalService.sendUpdate('All:View:Failure');//To Send Updates  
  //   }
  // )
  // }
  public Put(): void
  {
    this.saveDisabled = false;
    if (!this.isReportingValid()) 
    {
      return; // Don't proceed if invalid
      this.saveDisabled = true;
    }
    this.advanceTableForm.patchValue({pickUpLatLong:this.advanceTableForm.value.pickUpLatitude
      +
       ',' +
       this.advanceTableForm.value.pickUpLongitude
   });
   this.advanceTableForm.patchValue({dutySlipByDriverID:this.dutySlipByDriverID});
   
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close(response);
        console.log(response)
        this.showNotification(
          'snackbar-success',
          'Pickup By Executive Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
       
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  fetchDataFromApp()
  {
    const dialogRef = this.dialog.open(FetchPickupAppDataDialogComponent, 
    {
      width:'70%',
      height:'80%',
      data: 
        {
          action: 'add'
        }
    });
    dialogRef.afterClosed().subscribe(res => {
       
      if(res!==undefined)
      {
        console.log(res)
       this.advanceTableForm.patchValue({pickUpKM:res.data.pickupKM});
       this.advanceTableForm.patchValue({pickUpAddressString:res.data.pickupAddressString});
       this.advanceTableForm.patchValue({pickUpLatitude:res.data.pickupLatitude});
       this.advanceTableForm.patchValue({pickUpLongitude:res.data.pickupLongitude});
      }

    })
  }

  fetchDataFromGPS()
  {
    
    const dialogRef = this.dialog.open(FetchDataFromGPSComponent, 
    {
      data: 
        {
          action: 'add',
          reservationID:this.reservationID
          
    }
    });
    dialogRef.afterClosed().subscribe(res => {
       
      if(res!==undefined)
      {
        console.log(res)
       this.advanceTableForm.patchValue({pickUpKM:res.data[0].pickupKM});
       this.advanceTableForm.patchValue({pickUpAddressString:res.data[0].pickupAddressString});
       this.advanceTableForm.patchValue({pickUpLatitude:res.data[0].pickupLatitude});
       this.advanceTableForm.patchValue({pickUpLongitude:res.data[0].pickupLongitude});
      }

    })
  }

  InitGoogleAddress(){
    this._generalService.getGoogleAddress().subscribe(
      data=>
      {
        this.GoogleAddressList=data;
        this.filteredGoogleAddressOptions = this.advanceTableForm.controls['pickUpAddressString'].valueChanges.pipe(
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
    const selectedBooker = this.GoogleAddressList.find(
      data => data.geoSearchString === selectedBookerName
    );
  
    if (selectedBooker) {
      this.bindPickupSpotTypeandSpot(selectedBooker);
    }
  }

  bindPickupSpotTypeandSpot(option:any)
  {
    console.log(option)
     this.advanceTableForm.patchValue({pickUpAddressString:option.geoSearchString});
     var value = option?.geoLocation?.replace(
      '(',
      ''
    );
    value = value?.replace(')', '');
    var lat = value?.split(' ')[2];
    var long = value?.split(' ')[1];
    this.advanceTableForm.patchValue({ pickUpLatitude: lat });
    this.advanceTableForm.patchValue({ pickUpLongitude: long });
  }
  valueSwitch()
  {
    if(this.advanceTableForm.value.googleAddresses===true)
      {
        this.ifBlock=false;
        this.advanceTableForm.controls["pickUpAddressString"].setValue('');
       
      }
      if(this.advanceTableForm.value.googleAddresses===false)
      {
        this.ifBlock=true;
        this.advanceTableForm.controls["pickUpAddressString"].setValue('');
      }

  }

    onBlurUpdateDate(value: string): void {
      value= this._generalService.resetDateiflessthan12(value);
    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('pickUpDate')?.setValue(formattedDate);    
    } else {
      this.advanceTableForm.get('pickUpDate')?.setErrors({ invalidDate: true });
    }
  }

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('pickUpTime').setValue(parsedTime);
    }
  }

  public loadData() 
    {
      this.reachedByExecutiveService.getDataOfDateTimeKM(this.dutySlipID).subscribe
      (
        data =>   
        {
          this.dataSourceForValidation = data;
          this.reportingToGuestDate = new Date(data.reportingToGuestDate);
          this.reportingToGuestTime = new Date(data.reportingToGuestTime);
          this.reportingToGuestKM = data.reportingToGuestKM;
        },
        (error: HttpErrorResponse) => { this.dataSourceForValidation = null;}
      );
    }
  
        private isReportingValid(): boolean {    
          const date = new Date(this.advanceTableForm.value.pickUpDate);
          const time = new Date(this.advanceTableForm.value.pickUpTime);
          const km = +this.advanceTableForm.value.pickUpKM;
        
          const reportingToGuestDateTime = new Date(this.reportingToGuestDate);
          reportingToGuestDateTime.setHours(this.reportingToGuestTime.getHours());
          reportingToGuestDateTime.setMinutes(this.reportingToGuestTime.getMinutes());
        
          const pickUpDateTime = new Date(date);
          pickUpDateTime.setHours(time.getHours());
          pickUpDateTime.setMinutes(time.getMinutes());
        
          const isDateTimeValid = pickUpDateTime >= reportingToGuestDateTime;
          const isKmValid = km >= this.reportingToGuestKM;
        
          const formatDateDDMMYYYY = (date: Date) => {
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const y = date.getFullYear();
            return `${d}-${m}-${y}`;
          };
        
        
          if (!isDateTimeValid || !isKmValid) {
            Swal.fire({
              title: 'Invalid Pickup Details',
              icon: 'warning',
              html: `
                <b>Pickup Date, Time and KM must be greater than Reporting values.</b><br><br>
                <b>Reporting Date:</b> ${formatDateDDMMYYYY(this.reportingToGuestDate)}<br>
                <b>Reporting Time:</b> ${this.reportingToGuestTime.toLocaleTimeString()}<br>
                <b>Reporting KM:</b> ${this.reportingToGuestKM}
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



