// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerContractCarCategoriesCarMappingService } from '../../customerContractCarCategoriesCarMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerContractCarCategoriesCarMapping } from '../../customerContractCarCategoriesCarMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
  advanceTable: CustomerContractCarCategoriesCarMapping;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public CityList?: CitiesDropDown[] = [];
  public VehicleList?: VehicleDropDown[] = [];
  filteredOptions: Observable<VehicleDropDown[]>;
  image: any;
  fileUploadEl: any;
  SupplierName: any;
  CustomerContractCarCategoryID!:number;
  CustomerContractCarCategory:string;
  customerContractName:string;
  vehicleID: any;
  saveDisabled:boolean = true;
  CustomerContractID: number;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerContractCarCategoriesCarMappingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
this.CustomerContractID= data.customerContractID;
    this.CustomerContractCarCategoryID= data.customerContractCarCategoryID;
        this.CustomerContractCarCategory =data.customerContractCarCategory;
        this.customerContractName =data.customerContractName;

        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Car Mapping';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Car Mapping';
          this.advanceTable = new CustomerContractCarCategoriesCarMapping({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.customerContractID = this.CustomerContractID;
        }
        this.advanceTableForm = this.createContactForm();
        // this.SupplierName=data.SUPPLIERNAME
  }
  public ngOnInit(): void
  {
    this.InitCities();
    this.initVehicle();
    
    // Debug form validity
    this.advanceTableForm.statusChanges.subscribe(status => {
      if (status === 'INVALID') {
        Object.keys(this.advanceTableForm.controls).forEach(key => {
          const control = this.advanceTableForm.get(key);
          if (control && control.invalid) {
          }
        });
      }
    });
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

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      });
  }

  // initVehicle(){
  //   this._generalService.GetVehicle().subscribe
  //   (
  //     data =>   
  //     {
  //       this.VehicleList = data;
        
  //     }
  //   );
    
  // }
  initVehicle() {
    this._generalService.GetVehicle().subscribe(
      data =>
      {
         ;
        this.VehicleList = data;
        this.advanceTableForm.controls['vehicle'].setValidators([Validators.required]);
        this.advanceTableForm.controls['vehicle'].updateValueAndValidity(); 
        this.filteredOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
         startWith(""),
         map(value => this._filter(value || ''))
       );
      },
      error =>
      {
       
      }
    );
   }
   private _filter(value: string): any {
     const filterValue = value.toLowerCase();
     if (!value || value.length < 3) {
      return [];   
    }
     return this.VehicleList.filter(
       customer => 
       {
         return customer.vehicle.toLowerCase().includes(filterValue);
       });
   };
  OnVehicleSelect(selectedVehicle: string)
  {
    const VehicleName = this.VehicleList.find(
      data => data.vehicle === selectedVehicle
    );
    if (selectedVehicle) 
    {
      this.getVehicle(VehicleName.vehicleID);
    }
  }
  getVehicle(vehicleID: any)
  {    
    this.vehicleID=vehicleID;
    this.vehicleOnSelect();
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerContractCarCategoriesCarMappingID: [this.advanceTable.customerContractCarCategoriesCarMappingID],
      customerContractCarCategoryID: [this.data.customerContractCarCategoryID],
      customerContractID: [this.CustomerContractID],
      vehicleID: [this.advanceTable.vehicleID],
      customerVehicleName: [this.advanceTable.customerVehicleName, [Validators.required]],
      customerVehicleCodeForIntegration: [this.advanceTable.customerVehicleCodeForIntegration],
      activationStatus: [this.advanceTable.activationStatus],
      vehicle:[this.advanceTable.vehicle, [Validators.required]],
    });
  }

  public objectComparisonFunction = function(option, value) : boolean {
    return option.vehicleID === value;
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
    this.advanceTableForm.patchValue({customerContractCarCategoryID:this.data.customerContractCarCategoryID});
    this.advanceTableForm.patchValue({ customerContractID:this.CustomerContractID || this.data.customerContractID });
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
    
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        }
        else
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerContractCarCategoriesCarMappingCreate:CustomerContractCarCategoriesCarMappingView:Success');//To Send Updates  
          this.saveDisabled = true;
        }
      },
      error =>
      {
        this._generalService.sendUpdate('CustomerContractCarCategoriesCarMappingAll:CustomerContractCarCategoriesCarMappingView:Failure');//To Send Updates  
        this.saveDisabled = true;
      }
    );
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerContractCarCategoryID:this.advanceTable.customerContractCarCategoryID});
    this.advanceTableForm.patchValue({customerContractID: this.CustomerContractID || this.data.customerContractID || this.advanceTable.customerContractID});
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID || this.advanceTable.vehicleID});
    
    
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate")) 
        {
          this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
          this.saveDisabled = true;
        }
        else
        {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerContractCarCategoriesCarMappingUpdate:CustomerContractCarCategoriesCarMappingView:Success');//To Send Updates
          this.saveDisabled = true;
        }
      },
      error =>
      {
       this._generalService.sendUpdate('CustomerContractCarCategoriesCarMappingAll:CustomerContractCarCategoriesCarMappingView:Failure');//To Send Updates 
       this.saveDisabled = true; 
      }
    );
  }
  public confirmAdd(): void {

    // Ensure customerContractID is set before saving
    if (!this.CustomerContractID && !this.data.customerContractID) {
      console.error('CustomerContractID is missing');
      alert('Customer Contract ID is missing. Please contact support.');
      return;
    }

    this.saveDisabled = false;
    if(this.action=="edit") {
      this.Put();
    } else {
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

//   if (/[a-zA-Z]/.customerContractCarCategoriesCarMapping(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

  vehicleOnSelect() {
    this.advanceTableForm.controls['customerVehicleName'].setValue(this.advanceTableForm.value.vehicle);
  }

  vehicleValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
      return match ? null : { invalidVehicleSelection: true };
    };
  }

  canSave(): boolean {
    // Check if required fields are filled
    const vehicle = this.advanceTableForm.get('vehicle')?.value;
    const customerVehicleName = this.advanceTableForm.get('customerVehicleName')?.value;
    

    return !!(vehicle && customerVehicleName);
  }
}


