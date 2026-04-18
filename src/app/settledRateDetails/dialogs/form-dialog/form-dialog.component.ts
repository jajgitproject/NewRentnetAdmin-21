// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { SettledRateDetailsService } from '../../settledRateDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { BookingDataModel, CDCDataModel, SettledRateDetails } from '../../settledRateDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CityTierDropDown } from 'src/app/cityTier/cityTierDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogSRDComponent implements OnInit
{
    //@Input() reservationID;
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SettledRateDetails;
  advanceTableBooking: BookingDataModel | null;
  advanceTableCDC: CDCDataModel | null;
  

  public CityList?: CitiesDropDown[] = [];
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public PackageTypeList?: PackageTypeDropDown[] = [];
  public PackageList?: PackageDropDown[] = [];

  filteredCityOptions: Observable<CityTierDropDown[]>;
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  filteredPackageOptions: Observable<PackageDropDown[]>;
  cityID: any;
  vehicleCategoryID: any;
  packageTypeID: any;
  packageID: any;
  reservationID: any;
  contractID: any[];
  PackageType: string;

  constructor(
  public dialogRef: MatDialogRef<FormDialogSRDComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SettledRateDetailsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Settled Rate';       
          this.advanceTable = data.advanceTable;
          this.PackageType = data.advanceTable.packageType;
        } else 
        {
          this.dialogTitle = 'Settled Rate';
          this.advanceTable = new SettledRateDetails({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        
        // Extract status safely
        console.log('Received data:', data);
        console.log('Received data.status:', data.status);
        
        // Constructor या ngOnInit में
if (typeof data.status === 'string') {
    this.status = data.status;
} else if (data.status && typeof data.status === 'object' && data.status.status) {
    this.status = data.status.status;
} else {
    this.status = '';
}

console.log('Final status:', this.status);

// Save button control
this.buttonDisabled = this.status !== 'Changes allow'; // true अगर status "Changes allow" नहीं
  }

  ngOnInit(): void 
  {
    this.InitCity();
    this.InitVehicleCategory();
    this.InitPackageType();
    if(this.action === 'edit')
    {
      this.advanceTableForm.patchValue({baseFare: this.advanceTable.baseFare});
      this.advanceTableForm.patchValue({packageKM: this.advanceTable.packageKM});
      this.advanceTableForm.patchValue({packageHour: this.advanceTable.packageHour});
      this.advanceTableForm.patchValue({extraKMRate: this.advanceTable.extraKMRate});
      this.advanceTableForm.patchValue({extraHourRate: this.advanceTable.extraHourRate});
      this.advanceTableForm.patchValue({nightCharges: this.advanceTable.nightCharges});
      this.advanceTableForm.patchValue({nightChargeStartTime: this.advanceTable.nightChargeStartTime});
      this.advanceTableForm.patchValue({nightChargeEndTime: this.advanceTable.nightChargeEndTime});
      this.advanceTableForm.patchValue({driverAllowance: this.advanceTable.driverAllowance});
      this.advanceTableForm.patchValue({billingFrom: this.advanceTable.billingFrom});
      this.advanceTableForm.patchValue({billingTo: this.advanceTable.billingTo});
      this.advanceTableForm.patchValue({parkingCharges: this.advanceTable.parkingCharges});
      this.advanceTableForm.patchValue({tollCharges: this.advanceTable.tollCharges});
      this.advanceTableForm.patchValue({interstateCharges: this.advanceTable.interstateCharges});
      this.advanceTableForm.patchValue({airportFee: this.advanceTable.airportFee});
      this.advanceTableForm.patchValue({nextDayCharging: this.advanceTable.nextDayCharging});
    }
    else
    {
      this.GetBookingDataForSR();
    }
  }

  GetBookingDataForSR()
  {
    this.advanceTableService.getBookingDataForSR(this.reservationID).subscribe(
      data => {
        this.advanceTableBooking = data;
        this.PackageType = this.advanceTableBooking.packageType;
        this.advanceTableForm.patchValue({cityID: this.advanceTableBooking.cityID});
        this.advanceTableForm.patchValue({city: this.advanceTableBooking.city});
        this.advanceTableForm.patchValue({vehicleCategoryID: this.advanceTableBooking.vehicleCategoryID});
        this.advanceTableForm.patchValue({vehicleCategory: this.advanceTableBooking.vehicleCategory});
        this.advanceTableForm.patchValue({packageTypeID: this.advanceTableBooking.packageTypeID});
        this.advanceTableForm.patchValue({packageType: this.advanceTableBooking.packageType});
        this.advanceTableForm.patchValue({packageID: this.advanceTableBooking.packageID});
        this.advanceTableForm.patchValue({package: this.advanceTableBooking.package});
        this.getContractID(this.advanceTableBooking.customerID,
          this.advanceTableBooking.pickupDate.toString(),
          this.advanceTableBooking.packageType,
          this.advanceTableBooking.cityID,
          this.advanceTableBooking.packageID
        );

      }
    );
  }

  getContractID(customerID : number,pickupDate : string,packageType : string, cityID: any,packageID:any)
  {
    this._generalService.GetContractIDBasedOnDate(customerID, pickupDate).subscribe(
      data => {
          this.contractID = data;
          this.getCDCData(this.contractID , packageType, cityID,packageID)
      });
  }

  getCDCData(contractID: any,packageType : string, cityID : any,packageID:any)
  {
    this.advanceTableService.getCDCData(contractID,packageType,cityID,packageID).subscribe(
      data => {
        this.advanceTableCDC = data;
        console.log(data)
        this.advanceTableForm.patchValue({baseFare: this.advanceTableCDC.baseFare});
        this.advanceTableForm.patchValue({packageKM: this.advanceTableCDC.packageKM});
        this.advanceTableForm.patchValue({packageHour: this.advanceTableCDC.packageHour});
        this.advanceTableForm.patchValue({extraKMRate: this.advanceTableCDC.extraKMRate});
        this.advanceTableForm.patchValue({extraHourRate: this.advanceTableCDC.extraHourRate});
        this.advanceTableForm.patchValue({nightCharges: this.advanceTableCDC.nightCharges});
        this.advanceTableForm.patchValue({nightChargeStartTime: this.advanceTableCDC.nightChargeStartTime});
        this.advanceTableForm.patchValue({nightChargeEndTime: this.advanceTableCDC.nightChargeEndTime});
        this.advanceTableForm.patchValue({driverAllowance: this.advanceTableCDC.driverAllowance});
        this.advanceTableForm.patchValue({billingFrom: this.advanceTableCDC.billingFrom});
        this.advanceTableForm.patchValue({billingTo: this.advanceTableCDC.billingTo});
        this.advanceTableForm.patchValue({parkingCharges: this.advanceTableCDC.parkingCharges});
        this.advanceTableForm.patchValue({tollCharges: this.advanceTableCDC.tollCharges});
        this.advanceTableForm.patchValue({interstateCharges: this.advanceTableCDC.interstateCharges});
        this.advanceTableForm.patchValue({airportFee: this.advanceTableCDC.airportFee});
        this.advanceTableForm.patchValue({billingFrom: this.advanceTableCDC.billFromTo});
        this.advanceTableForm.patchValue({billingTo: this.advanceTableCDC.billFromTo});
      }
    );
  }

  //-----------City Tier---------------

  InitCity(){
    this._generalService.GetCitys().subscribe(
      data=>
      {
        this.CityList=data;
        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCT(value || ''))
        ); 
      });
  }

  private _filterCT(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CityList.filter(
      customer => 
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      }
    );
  }

  onCitySelected(selectedCity: string) {
    const selectedCT = this.CityList.find(
      data => data.geoPointName === selectedCity
    );
  
    if (selectedCT) {
      this.getCityID(selectedCT.geoPointID);
    }
  }
  
  getCityID(cityID: any) {
    this.cityID=cityID;
    this.advanceTableForm.patchValue({cityID:this.cityID});
  }

  //-----------Vehicle Category---------------

  InitVehicleCategory(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.filteredVehicleCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVC(value || ''))
        ); 
      });
  }

  private _filterVC(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleCategoryList.filter(
      customer => 
      {
        return customer.vehicleCategory.toLowerCase().includes(filterValue);
      }
    );
  }

  onVCSelected(selectedVehCat: string) {
    const selectedVC = this.VehicleCategoryList.find(
      data => data.vehicleCategory === selectedVehCat
    );
  
    if (selectedVC) {
      this.getVehicleCategoryID(selectedVC.vehicleCategoryID);
    }
  }
  
  getVehicleCategoryID(vehicleCategoryID: any) {
    this.vehicleCategoryID=vehicleCategoryID;
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
  }

  //------------ PackageType -----------------
  InitPackageType(){
    this._generalService.GetPackageType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().includes(filterValue);
      }
    );
  }

  onPTSelected(selectedPackageType: string) {
    const selectedPT = this.PackageTypeList.find(
      data => data.packageType === selectedPackageType
    );
  
    if (selectedPT) {
      this.getPackageTypeID(selectedPT.packageTypeID);
    }
  }
  
  getPackageTypeID(packageTypeID: any) {
    this.packageTypeID=packageTypeID;
    this.advanceTableForm.controls['package'].setValue('');
    this.InitPackage();
  }

  onPackageInputChange(event: any) {
    if(event.target.value.length === 0) {
      this.advanceTableForm.controls['package'].setValue('');
      
    } 
  }

  //------------ Package -----------------
  InitPackage(){
    this._generalService.getPackageForSettleRate(this.packageTypeID).subscribe(
      data=>
      {
        this.PackageList=data;
        this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        ); 
      });
  }

  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageList.filter(
      customer => 
      {
        return customer.package.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onPackageSelected(selectedPackage: string) {
    const selectedPac = this.PackageList.find(
      data => data.package === selectedPackage
    );
  
    if (selectedPac) {
      this.getPackageID(selectedPac.packageID);
    }
  }

  getPackageID(packageID: any) {
    this.packageID=packageID;
    this.advanceTableForm.patchValue({packageID:this.packageID});
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationSettledRateID: [this.advanceTable.reservationSettledRateID],
      reservationID: [this.advanceTable.reservationID],
      cityID: [this.advanceTable.cityID],
      city: [this.advanceTable.city],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      packageID: [this.advanceTable.packageID],
      package: [this.advanceTable.package],
      packageTypeID: [this.advanceTable.packageTypeID],
      packageType: [this.advanceTable.packageType],
      baseFare: [this.advanceTable.baseFare],
      packageKM: [this.advanceTable.packageKM],
      packageHour: [this.advanceTable.packageHour],
      extraKMRate: [this.advanceTable.extraKMRate],
      extraHourRate: [this.advanceTable.extraHourRate],
      nightCharges: [this.advanceTable.nightCharges],
      nightChargeStartTime: [this.advanceTable.nightChargeStartTime],
      nightChargeEndTime: [this.advanceTable.nightChargeEndTime],
      driverAllowance: [this.advanceTable.driverAllowance],
      billingFrom: [this.advanceTable.billingFrom],
      billingTo: [this.advanceTable.billingTo],
      parkingCharges: [this.advanceTable.parkingCharges],
      tollCharges: [this.advanceTable.tollCharges],
      interstateCharges: [this.advanceTable.interstateCharges],
      airportFee: [this.advanceTable.airportFee],
      activationStatus: [this.advanceTable.activationStatus] ,
      nextDayCharging: [this.advanceTable.nextDayCharging || null]     
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Settled Rate Created Successfully...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
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
        this.saveDisabled=true;
      }
    )
    }

  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Settled Rate Created Successfully...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
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
        this.saveDisabled=true;
      }
    )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled=false;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
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

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nightChargeStartTime').setValue(parsedTime);
    }
}

onEndTimeInput(event: any): void {
  const inputValue = event.target.value;
  const parsedTime = new Date(`1970-01-01T${inputValue}`);
  if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('nightChargeEndTime').setValue(parsedTime);
  }
}
}


