// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { PackageService } from '../../package.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Package } from '../../package.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { PackageDropDown } from '../../packageDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { PackageTypeDropDown } from 'src/app/general/packageTypeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: Package;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public PackageList?: PackageTypeDropDown[] = [];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  searchPackageType: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  packageTypeID: any;
  isLoading: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: PackageService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Package';       
          this.dialogTitle ='Package';
          this.advanceTable = data.advanceTable;
          this.searchPackageType.setValue(this.advanceTable.packageType);
         
        } else 
        {
          //this.dialogTitle = 'Create Package';
          this.dialogTitle = 'Package';
          this.advanceTable = new Package({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
   this.InitPackageTypes();
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
    //debugger;
    this.packageTypeID=packageTypeID;
    this.advanceTableForm.patchValue({packageTypeID:this.packageTypeID});
  }

  // onPackageTypeSelected(selectedOption: any): void {
  //   // this.advanceTableForm.patchValue({
  //   //   packageType: selectedOption.packageType,
  //   //   packageTypeID: selectedOption.packageTypeID
  //   // });
  //   // this.advanceTableForm.setErrors(null);
  //   // console.log('Selected Option:', {
  //   //   packageType: selectedOption.packageType,
  //   //   packageTypeID: selectedOption.packageTypeID
  //   // });
  // }

 packageTypeValidator(PackageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageList.some(group => group.packageType.toLowerCase() === value);
      return match ? null : { packageTypeInvalid: true };
    };
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
      packageID: [this.advanceTable.packageID],
      packageTypeID: [this.advanceTable.packageTypeID],
      packageType:[this.advanceTable.packageType],
      package: [this.advanceTable.package],
      oldRentNetPackage : [this.advanceTable.oldRentNetPackage],
      activationStatus: [this.advanceTable.activationStatus],
      
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
  public Post(): void {
    this.isLoading = true;  // Set loading state to true

    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
      .subscribe(
        response => {
          this.isLoading = false;  // Set loading state to false
          this.dialogRef.close();
          this._generalService.sendUpdate('PackageCreate:PackageView:Success');  // Send updates
        },
        error => {
          this.isLoading = false;  // Set loading state to false
          this._generalService.sendUpdate('PackageAll:PackageView:Failure');  // Send updates in case of error
        }
      );
  }

  public Put(): void {
    this.isLoading = true;  // Set loading state to true

    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
      .subscribe(
        response => {
          this.isLoading = false;  // Set loading state to false
          this.dialogRef.close();
          this._generalService.sendUpdate('PackageUpdate:PackageView:Success');  // Send updates
        },
        error => {
          this.isLoading = false;  // Set loading state to false
          this._generalService.sendUpdate('PackageAll:PackageView:Failure');  // Send updates in case of error
        }
      );
  }
  public confirmAdd(): void 
  {
    //debugger;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
  // OnPackageChangeGetcurrencies()
  // {
  //   this._generalService.GetCurrencies(this.advanceTableForm.get("nativeCurrencyID").value).subscribe(
  //     data =>
  //      {
  //       this.CurrencyList = data;
  //      },
  //      error =>
  //      {
  //      }
  //   );
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
keyPressNumbersDecimal(event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
    && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
    return false;
  }
  return true;
}

// Only AlphaNumeric

}


