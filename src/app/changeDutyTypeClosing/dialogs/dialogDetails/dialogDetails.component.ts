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
import { ChangeDutyTypeClosingService } from '../../changeDutyTypeClosing.service';
import { ChangeDutyTypeClosingModel } from '../../changeDutyTypeClosing.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { PackageDropDown } from '../package/packageDropDown.model';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-dialogDetails',
  templateUrl: './dialogDetails.component.html',
  styleUrls: ['./dialogDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ChangeDutyTypeClosingModel;
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
 public PackageTypeList?:PackageTypeDropDown[]=[];
  public PackageList?:PackageDropDown[]=[];
    filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;  
    filteredPackageOptions: Observable<PackageDropDown[]>;
  
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ChangeDutyTypeClosingService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.PickupDate = data.pickupDate;
        this.customerID = data.customerID;
        this.pickupCityID = data.pickupCityID;
        this.vehicleCategoryID = data.vehicleCategoryID;
        this.vehicleID = data.vehicleID;
        console.log("Data received in dialog: ", data);
        this.onPickupDateChange();
        if (this.action === 'edit') 
        {              
          this.dialogTitle ='Change Duty Type';
          this.advanceTable = data.advanceTable;

        } else 
        {
          
          this.dialogTitle = 'Change Duty Type';
          this.advanceTable = new ChangeDutyTypeClosingModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        this.status= data.verifyDutyStatusAndCacellationStatus || data?.status?.status || data?.status;
        // if(this.status !== 'Changes allow'){
        //   this.buttonDisabled=true;
        // }
             if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}

  }

  ngOnInit()
  {
    
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      packageTypeID: [this.advanceTable?.packageTypeID || null],
      packageType: [this.advanceTable?. packageType || '',[this.noWhitespaceValidator]],
      reservationID:[this.advanceTable?.reservationID || null],
      packageID: [this.advanceTable?.packageID || null],
      package: [this.package || '']
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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
     this._generalService.sendUpdate('ChangeDutyTypeClosingAll:ChangeDutyTypeClosingView:Failure');//To Send Updates  
    })
  }

 public confirmAdd(): void 
{ 
  if(this.checkCityOrVehicleAvilable == true){
  this.Put();   
  }
  else{
    Swal.fire({
      title: 'City or Vehicle not available',
      text: 'The selected city or vehicle is not available for the chosen package and contract. Please select a different combination.',  
      icon: 'error',
      confirmButtonText: 'OK'
    });   
  }
    
}

   onPickupDateChange() {
    // var date = event.split('/');
    // var endDate = date[2] + '-' + date[1] + '-' + date[0];
 
      this._generalService.GetContractIDBasedOnDate(this.customerID, this.PickupDate).subscribe(
        data => {
          if (data) 
          {
            this.contractID = data;
            console.log("Contract ID based on pickup date: ", this.contractID);
            
            this.InitPackageType();
            this.InitPackage();
            if(this.advanceTable && this.advanceTable.packageType)
            {
              this.advanceTable.packageType = this.advanceTable.packageType + " " + "Rate";
            }
            // In new-reservation mode `this.advanceTable` may still be null
            // before any contract/package selections exist; guard every access.
            const fallbackPackageType = this.packageType || (this.advanceTable && this.advanceTable.packageType) || '';          
             //this.InitVehicle();
          
          } 
          else
          {
            
          }
        });
    
  }
  
  resetOtherFields(): void {
    this.advanceTableForm.patchValue({
      packageID: '',
      package: ''
    });
  }

  onPackageChanges(event: any): void {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['packageID'].setValue('');
    }
  }

  onPackageTypeChanges(event:any)
  {
    this.resetOtherFields();
    if(event.keyCode===8)
    {
      this.advanceTableForm.controls['packageID'].setValue('');
      this.advanceTableForm.controls['package'].setValue('');
    }
  }
   //------------Package Type -----------------
    InitPackageType(){
  
      if (!this.contractID) { return; }
      this._generalService.getPackageTypeByContractID(this.contractID).subscribe(
        data=>
        {
          this.PackageTypeList=data;
           this.advanceTableForm.controls['packageType'].setValidators([Validators.required,this.DTValidator(this.PackageTypeList)]);
          this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterPackageType(value || ''))
          ); 
        });
    }
  

  
  DTValidator(PackageTypeList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PackageTypeList.some(data =>
          (data.packageType.toLowerCase()) === value
        );
        return match ? null : { packageTypeInvalid: true };
      };
    }
  
    private _filterPackageType(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PackageTypeList?.filter(
        customer => 
        {
          return customer.packageType.toLowerCase().includes(filterValue);
        }
      );
    }
    
    onDTSelected(selectedDTName: string) {
      this.resetOtherFields();
      const selectedDT = this.PackageTypeList.find(
        data => data.packageType === selectedDTName
      );
    
      if (selectedDT) {
        this.getPackageTypeID(selectedDT.packageTypeID,selectedDT.packageType);
      }
    }
    
    getPackageTypeID(packageTypeID: any,packageType:any) {
     
      this.packageTypeID=packageTypeID;
      this.packageType=packageType;
      this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
      this.InitPackage();
      
    }
   //------------ Package -----------------
    InitPackage()
    {   
      this._generalService.GetPackagesForReservation(this.packageTypeID || this.advanceTableForm.value.packageTypeID,this.advanceTableForm.value.packageType,this.contractID).subscribe(
        data=>
        {
          this.PackageList=data;
          this.advanceTableForm.controls['package'].setValidators([Validators.required,this.PValidator(this.PackageList)]);
          this.filteredPackageOptions = this.advanceTableForm.controls['package'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterPackage(value || ''))
          ); 
        });
    }

  
  
    PValidator(PackageList: any[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const value = control.value?.toLowerCase();
          const match = PackageList.some(data =>(data.package.toLowerCase()) === value);
          return match ? null : { packageInvalid: true };
        };
      }
    private _filterPackage(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PackageList?.filter(
        customer => 
        {
          return customer.package.toLowerCase().includes(filterValue);
        }
      );
    }
  
    onPackageSelected(selectedPackageName: string) {
      const selectedPackage = this.PackageList.find(
        data => data.package === selectedPackageName
      );
    
      if (selectedPackage) {
        this.getPackageID(selectedPackage.packageID);
      }
    }
    
    getPackageID(packageID: any) {
      this.packageID=packageID;
      this.advanceTableForm.patchValue({packageID:this.packageID});
     
      const fallbackPackageType = this.packageType || (this.advanceTable && this.advanceTable.packageType) || '';
      this.InitVehicle();

  
    }
    
     //------------ Vehicle -----------------
      InitVehicle()
      {
       
            this.advanceTableService.GetVehiclePackageAndCityAvailable(this.contractID,this.packageType,this.packageID,this.vehicleID,this.pickupCityID).subscribe(
            data=>
            {
              this.checkCityOrVehicleAvilable=data;
              console.log("Vehicle availability data: ", this.checkCityOrVehicleAvilable);
             
            });
       
    
      
    }
  
}


