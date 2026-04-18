// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierRateCardSupplierMappingService } from '../../supplierRateCardSupplierMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { SupplierRateCardSupplierMapping } from '../../supplierRateCardSupplierMapping.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierContractForDropDownModel, SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
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
  advanceTable: SupplierRateCardSupplierMapping;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;
  public RateList?: SupplierContractForDropDownModel[] = [];
  searchRate:FormControl = new FormControl();
  filteredRateOptions: Observable<SupplierContractForDropDownModel[]>;

  image: any;
  fileUploadEl: any;
  SupplierName: any;
  SUPPLIERID: any;
  supplierRateCardID: any;
  supplierContractID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierRateCardSupplierMappingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Supplier Contract Supplier Mapping';       
          this.advanceTable = data.advanceTable;
          this.searchRate.setValue(this.advanceTable.supplierContractName);
        } else 
        {
          this.dialogTitle = 'Supplier Contract Supplier Mapping';
          this.advanceTable = new SupplierRateCardSupplierMapping({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
        this.SupplierName=data.SUPPLIERNAME
         this.SUPPLIERID=data.SUPPLIERID
        //console.log(this.SupplierName)
        // this.SUPPLIERID=data.SUPPLIERID
        //console.log(this.SUPPLIERID)
  }
  public ngOnInit(): void
  {
    this.initRate();
    
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

  // initRate(){
  //   this._generalService.GetRateList().subscribe(
  //     data=>
  //     {
  //       this.RateList=data;
  //       console.log(this.RateList)
  //     });
  // }

  //--------- Supplier Rate Card Validator --------
  supplierRateCardNameValidator(RateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = RateList.some(group => group.supplierContractName.toLowerCase() === value);
      return match ? null : { supplierContractNameInvalid: true };
    };
  }
  
  initRate() {
    this._generalService.GetSupplierContract().subscribe(
      data => {
        this.RateList = data;
        this.advanceTableForm.controls['supplierContractName'].setValidators([Validators.required,
          this.supplierRateCardNameValidator(this.RateList)]);
        this.advanceTableForm.controls['supplierContractName'].updateValueAndValidity();
        this.filteredRateOptions = this.advanceTableForm.controls['supplierContractName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterRate(value || ''))
        );
      },
      error => {}
    );
  }
  private _filterRate(value: string): any {
  const filterValue = value.toLowerCase();

  // Apply filter only when 3 or more characters are typed
  if (filterValue.length < 3) {
    return [];
  }

  return this.RateList.filter(rate =>
    rate.supplierContractName.toLowerCase().indexOf(filterValue) === 0
  );
}

//  private _filterRate(value: string): any {
//     const filterValue = value.toLowerCase();
//     return this.RateList.filter(
//       customer => 
//       {
//         return customer.supplierContractName.toLowerCase().indexOf(filterValue)===0;
//       }
//     );
//   }
  onRateSelected(selectedRate: string) {
    const selectedValue = this.RateList.find(
      data => data.supplierContractName === selectedRate
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.supplierContractID);
    }
  }
  getTitles(supplierContractID: any) {
    this.supplierContractID=supplierContractID;
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      supplierContractMappingID: [this.advanceTable.supplierContractMappingID],
      supplierID: [this.advanceTable.supplierID],
      supplierName: [this.advanceTable.supplierName],
      supplierContractID: [this.advanceTable.supplierContractID],
      supplierContractName:[this.advanceTable.supplierContractName],
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
  onNoClick():void{
    this.dialogRef.close();
    
  }
  public Post(): void {
    this.isLoading = true;  // Start loading

    this.advanceTableForm.patchValue({ supplierID: this.data.SUPPLIERID });
    this.advanceTableForm.patchValue({ supplierContractID: this.supplierContractID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractSupplierMappingCreate:SupplierContractSupplierMappingView:Success');
          this.isLoading = false;  // Stop loading
        },
        error => {
          this._generalService.sendUpdate('SupplierContractSupplierMappingAll:SupplierContractSupplierMappingView:Failure');
          this.isLoading = false;  // Stop loading
        }
      );
  }

  public Put(): void {
    this.isLoading = true;  // Start loading

    this.advanceTableForm.patchValue({ supplierContractID: this.supplierContractID || this.advanceTable.supplierContractID });
    this.advanceTableForm.patchValue({ supplierID: this.advanceTable.supplierID });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractSupplierMappingUpdate:SupplierContractSupplierMappingView:Success');
          this.isLoading = false;  // Stop loading
        },
        error => {
          this._generalService.sendUpdate('SupplierContractSupplierMappingAll:SupplierContractSupplierMappingView:Failure');
          this.isLoading = false;  // Stop loading
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

//   if (/[a-zA-Z]/.supplierRateCardSupplierMapping(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


