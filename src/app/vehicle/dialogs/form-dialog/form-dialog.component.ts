// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VehicleService } from '../../vehicle.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Vehicle } from '../../vehicle.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralService } from '../../../general/general.service';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleManufacturerDropDown } from 'src/app/vehicleManufacturer/vehicleManufacturerDropDown.model';
import { AcrisCodeDropDown } from 'src/app/acrisCode/acrisCodeDropDown.model';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  advanceTable: Vehicle;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  public VehicleManufacturerList?: VehicleManufacturerDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleCategoryDropDown[]>;
  searchVehicle: FormControl = new FormControl();
  public acrissList?: AcrisCodeDropDown[] = [];
  filteredsearchAccrissCodeOptions: Observable<AcrisCodeDropDown[]>;
  searchAccrissCode: FormControl = new FormControl();
  filteredVehicleManufacturerOptions: Observable<VehicleManufacturerDropDown[]>;
  searchVehicleManufacturer: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  vehicleCategoryID: any;
  manufacturerID: any;
  vehicleManufacturerID: any;
  acrisCodeID: any;
  acrisCodeDetailsID: any;
  acrisCode: any;
  isLoading: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VehicleService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Vehicle';       
          this.dialogTitle ='Vehicle';
          
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.vehicleImage;
          // this.searchVehicle.setValue(this.advanceTable.vehicleCategory);
          // this.searchVehicleManufacturer.setValue(this.advanceTable.vehicleManufacturer);
          // this.searchAccrissCode.setValue(this.advanceTable.vehicleAcrissCode);
        } else 
        {
          //this.dialogTitle = 'Create Vehicle';
          this.dialogTitle = 'Vehicle';
          this.advanceTable = new Vehicle({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.initVehicleCategories();
    this.initVehicleManufacturer();
    this.initAcriss();
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vehicleID: [this.advanceTable.vehicleID],
      vehicle: [this.advanceTable.vehicle],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
      vehicleImage: [this.advanceTable.vehicleImage],
      vehicleAltTag: [this.advanceTable.vehicleAltTag],
      vehicleSittingCapacity: [this.advanceTable.vehicleSittingCapacity],
      vehicleBaggageCapacity: [this.advanceTable.vehicleBaggageCapacity],
      vehicleManufacturerID: [this.advanceTable.vehicleManufacturerID],
      vehicleManufacturer: [this.advanceTable.vehicleManufacturer],
      vehicleAcrissCode: [this.advanceTable.vehicleAcrissCode],
      oldRentNetCar_Type: [this.advanceTable.oldRentNetCar_Type],
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
  reset(){
    this.advanceTableForm.reset();
    this.ImagePath="";
  }
  onNoClick():void
  {
    this.dialogRef.close();
  }
  public Post(): void {
    this.isLoading = true;  // Show loading stat

    // Patch necessary form values
    this.advanceTableForm.patchValue({
      vehicleCategoryID: this.vehicleCategoryID,
      vehicleAcrissCode: this.acrisCode,
      vehicleManufacturerID: this.vehicleManufacturerID
    });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('VehicleCreate:VehicleView:Success');
          this.isLoading = false;  // Hide loading state
        },
        error => {
          this._generalService.sendUpdate('VehicleAll:VehicleView:Failure');
          this.isLoading = false;  // Hide loading state
        }
      );
  }

  // Method for updating an existing vehicle (PUT)
  public Put(): void {
    this.isLoading = true;  // Show loading state
    // Patch necessary form values
    this.advanceTableForm.patchValue({
      vehicleCategoryID: this.vehicleCategoryID || this.advanceTable.vehicleCategoryID,
      vehicleAcrissCode: this.acrisCode || this.advanceTable.vehicleAcrissCode,
      vehicleManufacturerID: this.vehicleManufacturerID || this.advanceTable.vehicleManufacturerID
    });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('VehicleUpdate:VehicleView:Success');
          this.isLoading = false;  // Hide loading state
        },
        error => {
          this._generalService.sendUpdate('VehicleAll:VehicleView:Failure');
          this.isLoading = false;  // Hide loading state
        }
      );
  }

  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
  
  initVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;
        this.advanceTableForm.controls['vehicleCategory'].setValidators([Validators.required,
          this.vehicleCategoryTypeValidator(this.VehicleCategoryList)
        ]);
        this.advanceTableForm.controls['vehicleCategory'].updateValueAndValidity();
        this.filteredVehicleOptions = this.advanceTableForm.controls["vehicleCategory"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().includes(filterValue)
  );
}

  
  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleCategory.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }
  onVehicleCategorySelected(selectedVehicleCategory: string) {
    const selectedValue = this.VehicleCategoryList.find(
      data => data.vehicleCategory === selectedVehicleCategory
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.vehicleCategoryID);
    }
  }
  
  getTitles(vehicleCategoryID: any) {
   
    this.vehicleCategoryID=vehicleCategoryID;
  }

  vehicleCategoryTypeValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryTypeInvalid: true };
    };
  }

  initVehicleManufacturer(){
    this._generalService.GetVehicleManufacturer().subscribe(
      data=>
      {
        this.VehicleManufacturerList=data;
        this.advanceTableForm.controls['vehicleManufacturer'].setValidators([Validators.required,
          this.vehicleManufacturerTypeValidator(this.VehicleManufacturerList)
        ]);
        this.advanceTableForm.controls['vehicleManufacturer'].updateValueAndValidity();

        this.filteredVehicleManufacturerOptions = this.advanceTableForm.controls["vehicleManufacturer"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleManufacturer(value || ''))
        ); 
      });
  }
  
  private _filterVehicleManufacturer(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleManufacturerList.filter(customer =>
    customer.vehicleManufacturer.toLowerCase().includes(filterValue)
  );
}

  // private _filterVehicleManufacturer(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleManufacturerList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleManufacturer.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }
  onVehicleManufacturerSelected(selectedVehicleManufacturer: string) {
    const selectedValue = this.VehicleManufacturerList.find(
      data => data.vehicleManufacturer === selectedVehicleManufacturer
    );
  
    if (selectedValue) {
      this.getvehicleManufacturerID(selectedValue.vehicleManufacturerID);
    }
  }
  
  getvehicleManufacturerID(vehicleManufacturerID: any) {
   
    this.vehicleManufacturerID=vehicleManufacturerID;
  }

  vehicleManufacturerTypeValidator(VehicleManufacturerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleManufacturerList.some(group => group.vehicleManufacturer?.toLowerCase() === value);
      return match ? null : { vehicleManufacturerTypeInvalid: true };
    };
  }
  
  initAcriss(){
    this._generalService.GetAccrisCode().subscribe(
      data=>
      {
        this.acrissList=data;
        this.advanceTableForm.controls['vehicleAcrissCode'].setValidators([
          this.acrisCodeTypeValidator(this.acrissList)
        ]);
        this.advanceTableForm.controls['vehicleAcrissCode'].updateValueAndValidity();

        this.filteredsearchAccrissCodeOptions = this.advanceTableForm.controls["vehicleAcrissCode"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterAcriss(value || ''))
        ); 
      });
  }
  
  private _filterAcriss(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.acrissList?.filter(customer =>
    customer.acrisCode.toLowerCase().includes(filterValue)
  );
}

  // private _filterAcriss(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.acrissList?.filter(
  //     customer => 
  //     {
  //       return customer.acrisCode.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }
  onAcrisSelected(selectedAcris: string) {
    const selectedValue = this.acrissList.find(
      data => data.acrisCode === selectedAcris
    );
  
    if (selectedValue) {
      this.getacris(selectedValue.acrisCode);
    }
  }
  
  getacris(acrisCode: any) {
    this.acrisCode = acrisCode;
    //this.advanceTableForm.controls['vehicleAcrissCode'].setValue(this.acrisCodeDetailsID);
  }

  acrisCodeTypeValidator(acrissList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = acrissList.some(group => group.acrisCode.toLowerCase() === value);
      return match ? null : { acrisCodeTypeInvalid: true };
    };
  }

  // InitVehicleCategory(){
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data=>{
  //       this.VehicleCategoryList=data;
  //     }
  //   );
  // }

  // InitVehicleManufacturer(){
  //   this._generalService.GetVehicleManufacturer().subscribe(
  //     data=>{
  //       this.VehicleManufacturerList=data;
  //     }
  //   );
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({vehicleImage:this.ImagePath})
  }

}


