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
  public PaymentModeList?:ModeOfPaymentDropDown[]=[];
  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;
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
            'Mode Of Payment Updated...!!!',
            'bottom',
            'center'
          );  
        },
    error =>
    {
     this._generalService.sendUpdate('ModeOfPaymentAll:ModeOfPaymentView:Failure');//To Send Updates  
    })
  }

 public confirmAdd(): void 
{
  const cityExists = this.CityList?.some(c => c.pickupCityID === this.pickupCityID);
  
  const vehicleExists = this.VehicleList?.some(v => v.vehicleID === this.vehicleID);

  if (cityExists && vehicleExists) {
    this.Put(); // ✅ allowed
  } 
  else {
    alert("Selected Package/PackageType ke according Pickup City ya Vehicle valid nahi hai.");
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
            this.InitCity(fallbackPackageType);
          
            this.InitVehicle(fallbackPackageType);
          
          } 
          else
          {
            
          }
        });
    
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
      this.InitCity(fallbackPackageType);
      this.InitVehicle(this.packageType);

  
    }
     //------------Pickup City -----------------
      InitCity(PackageType:string)
      {
        if(PackageType === "Local Rate")
          {
            this._generalService.GetPickupAndDropOffCities(this.contractID,this.packageID).subscribe(
              data=>
              {
                this.CityList=data;
              
              });
          }
        else if(PackageType === "Local Lumpsum Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForLocalLumpsum(this.contractID,this.packageID ).subscribe(
            data=>
            {
              this.CityList=data;
              
            });
        }
    
        else if(PackageType === "Local On Demand Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForLocalOnDemand(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.CityList=data;
           
          });
        }
    
        else if(PackageType === "Local Transfer Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForLocalTransfer(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.CityList=data;
           
          });
        }
    
        else if(PackageType === "Long Term Rental Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForLongTermRental(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.CityList=data;
            
          });
        }
    
        else if(PackageType === "Outstation Lumpsum Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForOutStationLumpsum(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.CityList=data;
            
           
          });
        }
    
        else if(PackageType === "Outstation OneWay Trip Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForOutStationOneWayTrip(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.CityList=data;
           
          });
        }
    
        else if(PackageType === "Outstation Round Trip Rate")
        {
          this._generalService.GetPickupAndDropOffCitiesForOutStationRoundTrip(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.CityList=data;
           
          });
        }
    }
     //------------ Vehicle -----------------
      InitVehicle(PackageType)
      {
        if(PackageType === 'Local Rate')
          {
            this._generalService.GetVehicleBasedOnContractID(this.contractID,this.packageID ).subscribe(
            data=>
            {
              this.VehicleList=data;
             
            });
          }
    
        else if(PackageType === 'Local Lumpsum Rate')
        {
          this._generalService.GetVehicleBasedOnContractIDForLocalLumpsum(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.VehicleList=data;
           
          });
        }
    
        else if(PackageType === 'Local On Demand Rate')
        {
          this._generalService.GetVehicleBasedOnContractIDForLocalOnDemand(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.VehicleList=data;
           
          });
        }
    
        else if(PackageType === 'Local Transfer Rate')
        {
          this._generalService.GetVehicleBasedOnContractIDForLocalTransfer(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.VehicleList=data;
            
          });
        }
    
        else if(PackageType === 'Long Term Rental Rate')
        {
          this._generalService.GetVehicleBasedOnContractIDForLongTermRental(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.VehicleList=data;
           
          });
        }
    
        else if(PackageType === 'Outstation Lumpsum Rate')
        {
          this._generalService.GetVehicleBasedOnContractIDForOutStationLumpsum(this.contractID,this.packageID ).subscribe(
          data=>
          {
            this.VehicleList=data;
            
          });
        }
    
      else if(PackageType === 'Outstation OneWay Trip Rate')
      {
        this._generalService.GetVehicleBasedOnContractIDForOutStationOneWayTrip(this.contractID,this.packageID ).subscribe(
        data=>
        {
          this.VehicleList=data;
         
        });
      }
    
      else if(PackageType === 'Outstation Round Trip Rate')
      {
        this._generalService.GetVehicleBasedOnContractIDForOutStationRoundTrip(this.contractID,this.packageID ).subscribe(
        data=>
        {
          this.VehicleList=data;
         
        });
      }
    }
  
}


