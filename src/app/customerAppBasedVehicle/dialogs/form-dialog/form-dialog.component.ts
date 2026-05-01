// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { CustomerCategoryDropDown } from 'src/app/customerCategory/customerCategoryDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomerAppBasedVehicle } from '../../customerAppBasedVehicle.model';
import { CustomerAppBasedVehicleService } from '../../customerAppBasedVehicle.service';
import { VehicleCategoryDropDown } from 'src/app/general/vehicleCategoryDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerAppBasedVehicle;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
 filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
   public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  CustomerID!: number;
  CustomerName!: string;
  customerCategoryID: any;
  vehicleID: number;
  vehicleCategoryID: any;
  saveDisabled:boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerAppBasedVehicleService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.CustomerID= data.customerID,
        this.CustomerName =data.customerName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Vehicles To Be Booked Through App';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Vehicles To Be Booked Through App';
          this.advanceTable = new CustomerAppBasedVehicle({});
          this.advanceTable.activationStatus=true;
          
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.initVehicleCategories();
    
  }
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

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
 //==========================VehicleCategories==========================

 initVehicleCategories(){
  this._generalService.GetVehicleCategories().subscribe(
    data=>
    {
      this.VehicleCategoryList=data;
      this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
        this.customerVehicleCategoryValidator(this.VehicleCategoryList)
      ]);
      this.filteredVehicleCategoryOptions = this.advanceTableForm.controls['vehicleCategory'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterVehicleCategories(value || ''))
      ); 
    });
}


private _filterVehicleCategories(value: string): any {
  const filterValue = value.toLowerCase();
  // if(filterValue.length === 0) {
  //   return [];
  // }
  return this.VehicleCategoryList.filter(
    customer => 
    {
      return customer.vehicleCategory.toLowerCase().includes(filterValue);
    });
}
OnVehicleCategorySelect(selectedVehicleCategory: string)
{
  const VehicleCategoryName = this.VehicleCategoryList.find(
    data => data.vehicleCategory === selectedVehicleCategory
  );
  if (selectedVehicleCategory) 
  {
    this.getTitles(VehicleCategoryName.vehicleCategoryID);
  }
}  
getTitles(vehicleCategoryID: any)
{
  this.vehicleCategoryID=vehicleCategoryID;
  this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID}); 
  this.initVehicle();
  this.advanceTableForm.controls['vehicle'].setValue('');
}


onvechileInputChanges(event:any){
  if(event.keyCode===8){
    this.advanceTableForm.controls['vehicle'].setValue('');
   }

}
  customerVehicleCategoryValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryInvalid: true };
    };
  }
//==================================Vehicle =======================

customerVehicleValidator(VehicleList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
    return match ? null : { vehicleInvalid: true };
  };
}
initVehicle() {
  this._generalService.GetVehicles(this.vehicleCategoryID).subscribe(
    data => {
      this.VehicleList = data;
      this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterVehicle(value || ''))
      );
    }
  );
}

private _filterVehicle(value: string): any {
  const filterValue = value.toLowerCase();
  // if(filterValue.length === 0) {
  //   return [];
  // }
  return this.VehicleList.filter(
    customer => 
    {
      return customer.vehicle.toLowerCase().includes(filterValue);
    });
}
OnVehicleSelect(selectedVehicle: string)
{
  const VehicleName = this.VehicleList.find(
    data => data.vehicle === selectedVehicle
  );
  if (selectedVehicle) 
  {
    this.getvehicleID(VehicleName.vehicleID);
  }
} 
getvehicleID(vehicleID: any)
{
  this.vehicleID=vehicleID;
  this.advanceTableForm.patchValue({vehicleID:this.vehicleID}); 
}
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerAppVehicleMappingID: [this.advanceTable.customerAppVehicleMappingID],
      customerID: [this.advanceTable.customerID],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleID: [this.advanceTable.vehicleID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      vehicle: [this.advanceTable.vehicle],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    
    this.advanceTableForm.patchValue({customerID:this.data.customerID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAppBasedVehicleCreate:CustomerAppBasedVehicleView:Success');//To Send Updates
       this.saveDisabled = true;  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerAppBasedVehicleAll:CustomerAppBasedVehicleView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({ customerID:this.advanceTable.customerID });
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID || this.advanceTable.vehicleID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAppBasedVehicleUpdate:CustomerAppBasedVehicleView:Success');//To Send Updates 
       this.saveDisabled = true; 
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAppBasedVehicleAll:CustomerAppBasedVehicleView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

 
}

