// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/general/general.service';
import { ModeOfPaymentDropDown } from 'src/app/supplierContract/modeOfPaymentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from 'ng2-charts';
import { ChangePickupTimeService } from '../../changePickupTime.service';
import { ChangePickupTimeModel } from '../../changePickupTime.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import { Address } from '@compat/google-places-shim-objects/address';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-dialogDetails',
  templateUrl: './dialogDetails.component.html',
  styleUrls: ['./dialogDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class editPickupTimeFormDialogComponent 
{
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ChangePickupTimeModel;
  paymentModeID: any;
  reservationID: any;
  previousModeOfPaymentID: number;
  previousModeOfPayment: string;
  PickupDate: any;
  contractID: any;
  customerID: any;
  pickupCityID:number;
  vehicleCategoryID:number;
  vehicleID:number
  packageTypeID:number;
  packageID:number;
  checkCityOrVehicleAvilable:any;
  packageType:any;
  geoStringAddress: string = '';
  geoLat: number | null = null;
  geoLng: number | null = null;
 public PackageTypeList?:PackageTypeDropDown[]=[];
  public PackageList?:PackageDropDown[]=[];
    filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;  
    filteredPackageOptions: Observable<PackageDropDown[]>;
  
  
  options = {
    componentRestrictions: { country: 'IN' }
  };

  constructor(
  public dialogRef: MatDialogRef<editPickupTimeFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ChangePickupTimeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.advanceTable = data.advanceTable ? data.advanceTable : new ChangePickupTimeModel({});
        this.advanceTableForm = this.createContactForm();

        this.dialogTitle = 'Change Address';
        this.reservationID = data.reservationID;

        if (data?.reservationID != null) {
          this.advanceTableForm.patchValue({ reservationID: data.reservationID });
        }

        if (data?.advanceTable) {
          this.advanceTableForm.patchValue({
            reservationStopAddress: data.advanceTable.reservationStopAddress,
            reservationStopAddressDetails: data.advanceTable.reservationStopAddressDetails,
            reservationStopLatitude: data.advanceTable.reservationStopLatitude || null,
            reservationStopLongitude: data.advanceTable.reservationStopLongitude || null,
            reservationStopAddressLatLong: data.advanceTable.reservationStopAddressLatLong || null,
            pickupAddress: data.advanceTable.pickupAddress || data.advanceTable.reservationStopAddress || null,
            pickupAddressDetails: data.advanceTable.pickupAddressDetails || data.advanceTable.reservationStopAddressDetails || null,
            pickupAddressLatLong: data.advanceTable.pickupAddressLatLong || data.advanceTable.reservationStopAddressLatLong || null
          });
        }

        this.status = data.verifyDutyStatusAndCacellationStatus || data?.status?.status || data?.status;
        if (this.status === 'Changes allow') {
          this.buttonDisabled = false;
        } else {
          this.buttonDisabled = true;
        }
  }

  ngOnInit()
  {
    
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationStopAddress: [this.advanceTable?.reservationStopAddress || null, [Validators.required, this.noWhitespaceValidator]],
      reservationStopAddressDetails: [this.advanceTable?.reservationStopAddressDetails || null, [Validators.required, this.noWhitespaceValidator]],
      reservationStopLatitude: [this.advanceTable?.reservationStopLatitude || null],
      reservationStopLongitude: [this.advanceTable?.reservationStopLongitude || null],
      reservationStopAddressLatLong: [this.advanceTable?.reservationStopAddressLatLong || null],
      pickupAddress: [this.advanceTable?.pickupAddress || this.advanceTable?.reservationStopAddress || null],
      pickupAddressDetails: [this.advanceTable?.pickupAddressDetails || this.advanceTable?.reservationStopAddressDetails || null],
      pickupAddressLatLong: [this.advanceTable?.pickupAddressLatLong || this.advanceTable?.reservationStopAddressLatLong || null],
      reservationID: [this.advanceTable?.reservationID || null]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}



  submit() {
    this.Put();
  }
  
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void
  {
    
    console.log(this.advanceTableForm.value);
    this.advanceTableForm.patchValue({reservationID:this.reservationID});

    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
        {
          this.dialogRef.close();
          this.showNotification(
            'snackbar-success',
            'Duty Type Updated...!!!',
            'bottom',
            'center'
          );  
        },
    error =>
    {
     this._generalService.sendUpdate('ChangePickupTimeAll:ChangePickupTimeView:Failure');//To Send Updates  
    })
  }


    
   
    AddressChange(address: Address) {
      this.geoStringAddress = address.formatted_address;
      this.geoLat = address.geometry.location.lat();
      this.geoLng = address.geometry.location.lng();
      const latLongValue = `${this.geoLat},${this.geoLng}`;
      this.advanceTableForm.patchValue({
        reservationStopAddress: address.formatted_address,
        reservationStopLatitude: this.geoLat,
        reservationStopLongitude: this.geoLng,
        reservationStopAddressLatLong: latLongValue,
       
      });
      this.advanceTableForm.get('reservationStopAddress')?.updateValueAndValidity();
    }

  //   onPickupTyping() {
  //   this.advanceTableForm.patchValue({
  //     latitude: null,
  //     longitude: null
  //   });
  
  //   this.advanceTableForm.get('pickupAddress')?.updateValueAndValidity();
  // }
  
}




