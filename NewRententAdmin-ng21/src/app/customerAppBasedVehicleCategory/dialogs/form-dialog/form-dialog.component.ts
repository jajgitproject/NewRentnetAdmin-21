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
import { CustomerAppBasedVehicleCategoryService } from '../../customerAppBasedVehicleCategory.service';
import { CustomerAppBasedVehicleCategory } from '../../customerAppBasedVehicleCategory.model';
import { VehicleCategoryDropDown } from 'src/app/general/vehicleCategoryDropDown.model';

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
  advanceTable:  CustomerAppBasedVehicleCategory;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
   public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
   filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  searchCategoryBy: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  CustomerID!: number;
  CustomerName!: string;
  customerCategoryID: any;
  vehicleCategoryID: number;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService:  CustomerAppBasedVehicleCategoryService,
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
          this.dialogTitle ='Vehicle Category To Be Booked Through App';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Vehicle Category To Be Booked Through App';
          this.advanceTable = new  CustomerAppBasedVehicleCategory({});
          this.advanceTable.activationStatus=true;
          //this.advanceTable.supplierName=data.SUPPLIERNAME;
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
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerAppVehicleCategoryMappingID: [this.advanceTable.customerAppVehicleCategoryMappingID],
      customerID: [this.advanceTable.customerID],
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleCategory: [this.advanceTable.vehicleCategory],
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
       this._generalService.sendUpdate('CustomerAppBasedVehicleCategoryCreate:CustomerAppBasedVehicleCategoryView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerAppBasedVehicleCategoryAll:CustomerAppBasedVehicleCategoryView:Failure');//To Send Updates  
       this.saveDisabled = true;
      }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({ customerID:this.advanceTable.customerID });
    this.advanceTableForm.patchValue({vehicleCategoryID:this.vehicleCategoryID || this.advanceTable.vehicleCategoryID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAppBasedVehicleCategoryUpdate:CustomerAppBasedVehicleCategoryView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAppBasedVehicleCategoryAll:CustomerAppBasedVehicleCategoryView:Failure');//To Send Updates  
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

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;
  //   console.log(`files: `, files);

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     console.log('onloaded', contents);
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

//   if (/[a-zA-Z]/.customerCategoryMapping(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}

