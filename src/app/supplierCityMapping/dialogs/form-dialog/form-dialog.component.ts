// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierCityMappingService } from '../../supplierCityMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import { SupplierCityMapping } from '../../supplierCityMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: SupplierCityMapping;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false; 
  public CityList?: CitiesDropDown[] = [];
  searchCity:FormControl = new FormControl();
  filteredCityOptions: Observable<CitiesDropDown[]>;

  image: any;
  fileUploadEl: any;
  SupplierName: any;
  cityID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierCityMappingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Supplier City Mapping';       
          this.advanceTable = data.advanceTable;
          this.searchCity.setValue(this.advanceTable.city);
        } else 
        {
          this.dialogTitle = 'Supplier City Mapping';
          this.advanceTable = new SupplierCityMapping({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.SupplierName=data.SUPPLIERNAME
  }
  public ngOnInit(): void
  {
    this.InitCities();
    
  }
  cityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityInvalid: true };
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

  // InitCities(){
  //   this._generalService.GetCitiessAll().subscribe(
  //     data=>
  //     {
  //       this.CityList=data;
  //     });
  // }
  InitCities() {
    this._generalService.GetCitiessAll().subscribe(
      data => {
        ;
        this.CityList = data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
          this.cityValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity(); 
        this.filteredCityOptions = this.advanceTableForm.controls['city']?.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );
      
      },
      error => {

      }
    );
  }
  private _filterCity(value: string): any {
  const filterValue = value.toLowerCase();

  // Only show list when 3 or more characters typed
  if (filterValue.length < 3) {
    return [];
  }

  return this.CityList.filter(customer =>
    customer.geoPointName.toLowerCase().includes(filterValue)
  );
}

//  private _filterCity(value: string): any {
//     const filterValue = value.toLowerCase();
//     return this.CityList.filter(
//       customer => 
//       {
//         return customer.geoPointName.toLowerCase().includes(filterValue);
//       }
//     );
//   }

  onCitySelected(selectedCityName: string) {
    const selectedCity = this.CityList.find(
      city => city.geoPointName === selectedCityName
    );
  
    if (selectedCity) {
      this.getCityID(selectedCity.geoPointID);
    }
  }

  getCityID(cityID: any) {
    this.cityID=cityID;
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierCityMappingID: [this.advanceTable.supplierCityMappingID],
      supplierID: [this.advanceTable.supplierID],
      cityID: [this.advanceTable.cityID],
      city: [this.advanceTable.city],
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
  onNoClick(): void{
    this.dialogRef.close();
  }
  public Post(): void {
    this.isLoading = true;  // Set loading to true before the API call

    this.advanceTableForm.patchValue({ supplierID: this.data.SUPPLIERID });
    this.advanceTableForm.patchValue({ cityID: this.cityID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierCityMappingCreate:SupplierCityMappingView:Success');
          this.isLoading = false;  // Set loading to false after successful response
        },
        error => {
          this._generalService.sendUpdate('SupplierCityMappingAll:SupplierCityMappingView:Failure');
          this.isLoading = false;  // Set loading to false after error response
        }
      );
  }

  // Put method with loading state
  public Put(): void {
    this.isLoading = true;  // Set loading to true before the API call

    this.advanceTableForm.patchValue({ supplierID: this.advanceTable.supplierID });
    this.advanceTableForm.patchValue({ cityID: this.cityID || this.advanceTable.cityID });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierCityMappingUpdate:SupplierCityMappingView:Success');
          this.isLoading = false;  // Set loading to false after successful response
        },
        error => {
          this._generalService.sendUpdate('SupplierCityMappingAll:SupplierCityMappingView:Failure');
          this.isLoading = false;  // Set loading to false after error response
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

//   if (/[a-zA-Z]/.supplierCityMapping(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


