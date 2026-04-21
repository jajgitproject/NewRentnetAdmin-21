// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerInfoService } from '../../customerInfo.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerInfo } from '../../customerInfo.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerTypeDropDown } from 'src/app/customerType/customerTypeDropDown.model';
import { CustomerCustomerGroupDropDown } from 'src/app/customer/customerCustomerGroupDropDown.model';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { VehicleVehicleCategoryDropDown } from 'src/app/vehicle/vehicleVehicleCategoryDropDown.model';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { PackageDropDown } from 'src/app/package/packageDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogAddPassengersComponent } from 'src/app/addPassengers/dialogs/form-dialog/form-dialog.component';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { FormDialogComponent } from 'src/app/viewKAM/dialogs/form-dialog/form-dialog.component';
import { FormDialogCustomerShortComponent } from 'src/app/customerShort/dialogs/form-dialog/form-dialog.component';
import { FormDialogPersonShortComponent } from 'src/app/personShort/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponentCustomerPerson } from 'src/app/customerPerson/dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCIComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerInfo;
  
  // public CustomerTypeList?: CustomerTypeDropDown[] = [];
  // public CustomerCustomerGroupList?: CustomerCustomerGroupDropDown[] = [];
  // public BookerList?: CustomerPersonDropDown[] = [];
  // public PassengerList?: CustomerPersonDropDown[] = [];
  // public CityList?: CitiesDropDown[] = [];
  // public StateList?: StatesDropDown[] = [];
  // public VehicleList?:VehicleVehicleCategoryDropDown[]=[];
  // public PackageTypeList?:PackageTypeDropDown[]=[];
  // public PackageList?:PackageDropDown[]=[];

  // filteredCustomerTypeOptions: Observable<CustomerTypeDropDown[]>;

  // filteredCustomerCustomerGroupOptions: Observable<CustomerCustomerGroupDropDown[]>;

  // filteredBookerOptions: Observable<CustomerPersonDropDown[]>;

  // filteredPassengerOptions: Observable<CustomerPersonDropDown[]>;

  // filteredCityOptions: Observable<CitiesDropDown[]>;
  
  // filteredStateOptions: Observable<StatesDropDown[]>;

  // filteredVehicleOptions: Observable<VehicleVehicleCategoryDropDown[]>;

  // filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;

  // filteredPackageOptions: Observable<PackageDropDown[]>;

  // image: any;
  // fileUploadEl: any;
  // customerTypeID: any;
  // customerID: any;
  // customerGroupID: any;
  // bookerID: any;
  // passengerID: any;
  // cityID: any;
  // vehicleID: any;
  // vehicleCategoryID: any;
  // packageTypeID: any;
  // packageID: any;
  // stateID: any;
  // customerDetailData: any;
  // customer: string;
  // contractID: any[];
  reservationID: any;
  customerID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogCIComponent>, 
  public dialog: MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerInfoService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.customerID=data.customerID
          //this.dialogTitle ='Edit Reservation Details';
          // this.dialogTitle ='Reservation Details';  
          // this.advanceTable = data.advanceTable[0];
          // this.advanceTable.primaryPassenger=data.advanceTable[0].primaryPassenger+"-"+data.advanceTable[0].gender+"-"+data.advanceTable[0].importance+"-"+data.advanceTable[0].customerDepartment+"-"+data.advanceTable[0].customerDesignation+"-"+data.advanceTable[0].customer;
          // this.advanceTable.primaryBooker=data.advanceTable[0].primaryBooker+"-"+data.advanceTable[0].gender+"-"+data.advanceTable[0].importance+"-"+data.advanceTable[0].customerDepartment+"-"+data.advanceTable[0].customerDesignation+"-"+data.advanceTable[0].customer;  
          //this.advanceTable.customer=data.advanceTable[0].customer+"-"+data.advanceTable[0].customerGroup;
        
        //this.advanceTableForm = this.createContactForm();
        // else 
        // {
        //   this.dialogTitle = 'CustomerInfo';
        //   this.advanceTable = new CustomerInfo({});
        // }
         
  }
  public ngOnInit(): void
  {
    // this.advanceTableForm.controls["customerType"].disable();
    // this.advanceTableForm.controls["customer"].disable();
    // this.InitContract();
    // this.InitCustomerType();
    // this.InitCustomerCustomerGroup();
    // this.InitBooker();
    // this.InitPassenger();
    // this.InitState();
    // this.InitPackageType();
  }

//------------ CustomerType -----------------
// InitCustomerType(){
//   this._generalService.getCustomerType().subscribe(
//     data=>
//     {
//       this.CustomerTypeList=data;
//       this.filteredCustomerTypeOptions = this.advanceTableForm.controls['customerType'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterCT(value || ''))
//       ); 
//     });
// }

// private _filterCT(value: string): any {
//   const filterValue = value.toLowerCase();
//   return this.CustomerTypeList.filter(
//     customer => 
//     {
//       return customer.customerType.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getTitles(customerTypeID: any) {
//   this.customerTypeID=customerTypeID;
//   this.advanceTableForm.patchValue({customerTypeID:this.customerTypeID});
//   this.InitCustomerCustomerGroup();
// }

 //------------ CustomerCustomerGroup -----------------
// InitCustomerCustomerGroup(){
//   this._generalService.getCustomerCustomerGroup(this.customerTypeID || this.advanceTable.customerTypeID).subscribe(
//     data=>
//     {
//       this.CustomerCustomerGroupList=data;
//       this.filteredCustomerCustomerGroupOptions =this.advanceTableForm.controls['customer'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterCCG(value || ''))
//       ); 
//     });
// }

// private _filterCCG(value: string): any {
//   const filterValue = value.toLowerCase();
//   if(filterValue.length===0)
//   {
//     return [];
//   }
//   return this.CustomerCustomerGroupList.filter(
//     customer => 
//     {
//       return customer.customerName.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getCustomerCustomerGroupID(customerID: any,customerGroupID:any, customer: any) {
//   this.customerID=customerID;
//   this.customerGroupID=customerGroupID;
//   this.customerDetailData = customer;
//   this.advanceTableForm.patchValue({customerID:this.customerID});
//   this.advanceTableForm.patchValue({customerGroupID:this.customerGroupID});
//   this.InitBooker();
//   this.InitPassenger()
// }

//------------ Booker -----------------
// InitBooker(){
//   this._generalService.GetCPForBooker(this.customerGroupID || this.advanceTable.customerGroupID).subscribe(
//     data=>
//     {
//       this.BookerList=data;
//       this.filteredBookerOptions = this.advanceTableForm.controls['primaryBooker'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterBooker(value || ''))
//       ); 
//     });
// }

// private _filterBooker(value: string): any {
//   const filterValue = value.toLowerCase();
//   if(filterValue.length === 0) {
//     return [];
//   }
//   return this.BookerList.filter(
//     customer => 
//     {
//       return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getBookerID(bookerID: any) {
//   this.bookerID=bookerID;
//   this.advanceTableForm.patchValue({primaryBookerID:this.bookerID});
// }

//------------ Passenger -----------------
// InitPassenger(){
//   this._generalService.GetCPForPassenger(this.customerGroupID || this.advanceTable.customerGroupID).subscribe(
//     data=>
//     {
//       this.PassengerList=data;
//       this.filteredPassengerOptions = this.advanceTableForm.controls['primaryPassenger'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterPassenger(value || ''))
//       ); 
//     });
// }

// private _filterPassenger(value: string): any {
//   const filterValue = value.toLowerCase();
//   if(filterValue.length === 0) {
//     return [];
//   }
//   return this.PassengerList.filter(
//     customer => 
//     {
//       return customer.customerPersonName.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getPassengerID(passengerID: any) {
//   this.passengerID=passengerID;
//   this.advanceTableForm.patchValue({primaryPassengerID:this.passengerID});
// }

//-------------State----------------------

// InitState(){
//   this._generalService.getState().subscribe(
//     data=>
//     {
//       this.StateList=data;
//       this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterState(value || ''))
//       ); 
//     });
// }

// private _filterState(value: string): any {
//   const filterValue = value.toLowerCase();
//   return this.StateList.filter(
//     customer => 
//     {
//       return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getStateID(stateID: any) {
//   this.stateID=stateID;
//   this.advanceTableForm.controls["pickupCity"].setValue('');
//   this.InitCity()
// }

//------------Pickup City -----------------
// InitCity(){
//   this._generalService.GetCities(this.stateID).subscribe(
//     data=>
//     {
//       this.CityList=data;
//       this.filteredCityOptions = this.advanceTableForm.controls['pickupCity'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterCity(value || ''))
//       ); 
//     });
// }

// private _filterCity(value: string): any {
//   const filterValue = value.toLowerCase();
//   return this.CityList.filter(
//     customer => 
//     {
//       return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getCityID(cityID: any) {
//   this.cityID=cityID;
//   this.advanceTableForm.patchValue({pickupCityID:this.cityID});
// }

//------------ Vehicle -----------------
// InitVehicle(){
//   this._generalService.GetVehicleBasedOnContractID(this.contractID,this.packageID||this.advanceTable.packageID).subscribe(
//     data=>
//     {
//       this.VehicleList=data;
//       this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterVehicle(value || ''))
//       ); 
//     });
// }

// private _filterVehicle(value: string): any {
//   const filterValue = value.toLowerCase();
//   return this.VehicleList.filter(
//     customer => 
//     {
//       return customer.vehicle.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getVehicleID(vehicleID: any,vehicleCategoryID:any) {
//   this.vehicleID=vehicleID;
//   this.vehicleCategoryID=vehicleCategoryID;
//   this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
//   this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID});
// }

//------------ PackageType -----------------
// InitPackageType(){
//   this._generalService.GetPackageType().subscribe(
//     data=>
//     {
//       this.PackageTypeList=data;
//       this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterPackageType(value || ''))
//       ); 
//     });
// }

// private _filterPackageType(value: string): any {
//   const filterValue = value.toLowerCase();
//   return this.PackageTypeList.filter(
//     customer => 
//     {
//       return customer.packageType.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getPackageTypeID(packageTypeID: any) {
//   this.packageTypeID=packageTypeID;
//   this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
//   this.advanceTableForm.controls["package"].setValue('');
//   this.InitPackage();
// }

//------------ Package -----------------
// InitPackage(){
//   debugger;
//   this._generalService.GetPackagesForReservation(this.packageTypeID||this.advanceTable.packageTypeID,this.advanceTableForm.value.packageType||this.advanceTable.packageType,this.contractID).subscribe(
//     data=>
//     {
//       this.PackageList=data;
//       this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterPackage(value || ''))
//       ); 
//     });
// }

// private _filterPackage(value: string): any {
//   const filterValue = value.toLowerCase();
//   return this.PackageList.filter(
//     customer => 
//     {
//       return customer.package.toLowerCase().indexOf(filterValue)===0;
//     }
//   );
// }

// getPackageID(packageID: any) {
//   this.packageID=packageID;
//   this.advanceTableForm.patchValue({packageID:this.packageID});
// }

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
//   createContactForm(): FormGroup 
//   {
//     return this.fb.group(
//     {
//       reservationID: [this.advanceTable.reservationID],
//       customerTypeID: [this.advanceTable.customerTypeID],
//       customerType: [this.advanceTable.customerType],
//       customerID: [this.advanceTable.customerID],
//       customer: [this.advanceTable.customer],
//       customerGroupID: [this.advanceTable.customerGroupID],
//       customerGroup: [this.advanceTable.customerGroup],
//       primaryBookerID: [this.advanceTable.primaryBookerID],
//       primaryBooker: [this.advanceTable.primaryBooker],
//       primaryPassengerID: [this.advanceTable.primaryPassengerID],
//       primaryPassenger: [this.advanceTable.primaryPassenger],
//       vehicleID: [this.advanceTable.vehicleID],
//       vehicle: [this.advanceTable.vehicle],
//       vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
//       packageTypeID: [this.advanceTable.packageTypeID],
//       packageType: [this.advanceTable.packageType],
//       packageID: [this.advanceTable.packageID],
//       package: [this.advanceTable.package],
//       stateID: [this.advanceTable.stateID],
//       state: [this.advanceTable.state],
//       pickupCityID: [this.advanceTable.pickupCityID],
//       pickupCity: [this.advanceTable.pickupCity]
//     });
//   }

//   public noWhitespaceValidator(control: FormControl) {
//     const isWhitespace = (control.value || '').trim().length === 0;
//     const isValid = !isWhitespace;
//     return isValid ? null : { 'whitespace': true };
// }

  submit() 
  {
    // emppty stuff
  }
  reset(){
    this.advanceTableForm.reset();
  }

  // ViewKAM()
  // {
  //   const dialogRef = this.dialog.open(FormDialogComponent, 
  //     {
  //       width:'60%',
  //       data: 
  //         {
  //           advanceTable: this.advanceTableForm.value,
  //           // action: 'add'
            
  //         }
  //     });
  // }

  // customerShort()
  // {
  //   const dialogRef = this.dialog.open(FormDialogCustomerShortComponent, 
  //     {
  //       data: 
  //         {
  //           advanceTable: this.customerDetailData,
  //           action: 'add',
  //           customerID: this.customerID,
  //           customerGroupID: this.customerGroupID,
            
  //         }
  //     });
  // }

  // onNoClick(): void 
  // {
  //   this.dialogRef.close();
  // }

  // personShort()
  // {
  //   this.customer=this.advanceTable.customer.split('-')[0];
  //   this.customerDetailData={customerID: this.advanceTable.customerID, customerName: this.customer, customerGroupID: this.advanceTable.customerGroupID, customerGroup: this.advanceTable.customerGroup};
  //   const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
  //     {
  //       data: 
  //         {
  //           advanceTable: this.customerDetailData,
  //           action: 'add',
  //           forCP:'CP',
  //           CustomerGroupID:this.customerDetailData.customerGroupID,
  //           CustomerGroupName:this.customerDetailData.customerGroup
  //         }
  //     });
  //     dialogRef.afterClosed().subscribe(res => {
  //       // received data from dialog-component
  //       //console.log(res.data);
  //       this.InitBooker();
  //       this.InitPassenger();
  //     })
  // }

  // onCustomerGroupInputChange(event: any) {
  //   if(event.target.value.length === 0) {
  //     this.advanceTableForm.controls['primaryBooker'].setValue('');
  //     this.advanceTableForm.controls['primaryPassenger'].setValue('');
  //   } 
  // }

  // onCustomerInputChange(event: any) {
  //   if(event.target.value.length === 0) {
  //     this.advanceTableForm.controls['customer'].setValue('');
      
  //   } 
  // }

  // public Put(): void
  // {
  //   this.advanceTableService.update(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //   response => 
  //   {
  //       this.dialogRef.close();
  //      this._generalService.sendUpdate('CustomerInfoUpdate:CustomerInfoView:Success');//To Send Updates  
       
  //   },
  //   error =>
  //   {
  //    this._generalService.sendUpdate('CustomerInfoAll:CustomerInfoView:Failure');//To Send Updates  
  //   }
  // )
  // }
  // public confirmAdd(): void 
  // {
  //         this.Put();
  // }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  // addPassengers()
  // {
  //   const dialogRef = this.dialog.open(FormDialogAddPassengersComponent, 
  //     {
  //       data: 
  //         {
  //           // advanceTable: this.advanceTable,
  //           // action: 'add'
  //         }
  //     });
  // }

  // InitContract()
  // {
  //   this._generalService.GetContractIDBasedOnDate(this.advanceTable.customerID,this.advanceTable.pickupDate).subscribe(
  //     data=>
  //     {
  //       this.contractID=data;
  //       this.InitPackage();
  //       this.InitVehicle();
  //     }
  //   );
  // }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

/////////////////for Image Upload ends////////////////////////////

// Only Numbers with Decimals
// keyPressNumbersDecimal(event) {
//   var charCode = (event.which) ? event.which : event.keyCode;
//   if (charCode != 46 && charCode > 31
//     && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

// Only AlphaNumeric
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.customerInfo(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


