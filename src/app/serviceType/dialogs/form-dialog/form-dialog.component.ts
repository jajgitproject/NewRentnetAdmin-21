// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { ServiceTypeService } from '../../serviceType.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ServiceType } from '../../serviceType.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { ServiceTypeDropDown } from '../../serviceTypeDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
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
  advanceTable: ServiceType;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;
  public ServiceTypeList?: ServiceTypeDropDown[] = [];
  image: any;
  fileUploadEl: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: ServiceTypeService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Service Type';       
          this.dialogTitle ='Service Type';
          this.advanceTable = data.advanceTable;
         
        } else 
        {
          //this.dialogTitle = 'Create Service Type';
          this.dialogTitle = 'Service Type';
          this.advanceTable = new ServiceType({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    // this._generalService.GetCurrencies(0).subscribe
    // (
    //   data =>   
    //   {
    //     //this.CurrencyList = data;
    //     //console.log(this.CurrencyList)
       
    //   }
    // );
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
      serviceTypeID: [this.advanceTable.serviceTypeID],
      serviceType: [this.advanceTable.serviceType],
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
    
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
   
  }
  public Post(): void {
    this.isLoading = true; // Show spinner, disable buttons
  
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Hide spinner on success
        this.dialogRef.close();
        this._generalService.sendUpdate('ServiceTypeCreate:ServiceTypeView:Success');
      },
      error => {
        this.isLoading = false; // Hide spinner on failure
        this._generalService.sendUpdate('ServiceTypeAll:ServiceTypeView:Failure');
      }
    );
  }
  
  public Put(): void {
    this.isLoading = true; // Show spinner, disable buttons
  
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Hide spinner on success
        this.dialogRef.close();
        this._generalService.sendUpdate('ServiceTypeUpdate:ServiceTypeView:Success');
      },
      error => {
        this.isLoading = false; // Hide spinner on failure
        this._generalService.sendUpdate('ServiceTypeAll:ServiceTypeView:Failure');
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
  // OnServiceTypeChangeGetcurrencies()
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
// keyPressAlphaNumeric(event) {

//   var inp = String.fromCharCode(event.keyCode);

//   if (/[a-zA-Z]/.test(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


