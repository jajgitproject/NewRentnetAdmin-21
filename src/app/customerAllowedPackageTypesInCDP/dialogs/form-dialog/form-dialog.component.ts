// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerAllowedPackageTypesInCDPService } from '../../customerAllowedPackageTypesInCDP.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerAllowedPackageTypesInCDP } from '../../customerAllowedPackageTypesInCDP.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerAllowedPackageTypesInCDPDropDown } from '../../customerAllowedPackageTypesInCDPDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentCustomerAllowedPackageTypesInCDP 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerAllowedPackageTypesInCDP;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  CustomerGroupID!: number;
  CustomerGroup!: string;
  saveDisabled:boolean=true;
  public CustomerAllowedPackageTypesInCDPList?: CustomerAllowedPackageTypesInCDPDropDown[] = [];

public PackageList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  searchPackageType: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  someAction: any;
  vehicleID: any;
  packageTypeID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentCustomerAllowedPackageTypesInCDP>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerAllowedPackageTypesInCDPService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        this.CustomerGroupID= data.customerGroupID;
        this.CustomerGroup =data.customerGroup;
        this.someAction=data.ForCD;
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Allow Package Type ';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Allow Package Type';
          this.advanceTable = new CustomerAllowedPackageTypesInCDP({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitPackageTypes();
    
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
      
      allowedPackageTypesInCDPID: [this.advanceTable.allowedPackageTypesInCDPID],
      customerGroupID: [this.advanceTable.customerGroupID],
       packageTypeID: [this.advanceTable.packageTypeID],
      packageType:[this.advanceTable.packageType],
      activationStatus: [this.advanceTable?.activationStatus ?? true]
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
  onNoClick()
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ customerGroupID:this.data.customerGroupID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAllowedPackageTypesInCDPCreate:CustomerAllowedPackageTypesInCDPView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAllowedPackageTypesInCDPAll:CustomerAllowedPackageTypesInCDPView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
}
  public Put(): void
  {
    this.advanceTableForm.patchValue({ customerGroupID:this.advanceTable.customerGroupID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerAllowedPackageTypesInCDPUpdate:CustomerAllowedPackageTypesInCDPView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAllowedPackageTypesInCDPAll:CustomerAllowedPackageTypesInCDPView:Failure');//To Send Updates  
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


  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
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

//   if (/[a-zA-Z]/.customerAllowedPackageTypesInCDP(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }
  //----------- Customer Validation --------------
  vehicleValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(employee => employee.vehicle.toLowerCase() === value);
      return match ? null : { vehicleInvalid: true };
    };
  }

   packageTypeValidator(PackageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageList.some(group => group.packageType.toLowerCase() === value);
      return match ? null : { packageTypeInvalid: true };
    };
  }
InitPackageTypes(){
    this._generalService.GetPackgeType().subscribe(
      data=>
      {
        this.PackageList=data;
        this.advanceTableForm.controls['packageType'].setValidators([Validators.required,
          this.packageTypeValidator(this.PackageList)
        ]);
        this.advanceTableForm.controls['packageType'].updateValueAndValidity();

        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.PackageList.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().includes(filterValue);
      }
    );
  }
  onPackageTypeSelected(selectedPackageType: string) {
    const selectedPackage = this.PackageList.find(
      data => data.packageType === selectedPackageType
    );
  
    if (selectedPackageType) {
      this.getTitles(selectedPackage.packageTypeID);
    }
  }
  
  getTitles(packageTypeID: any) {
    
    this.packageTypeID=packageTypeID;
    this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
  }

 



}


