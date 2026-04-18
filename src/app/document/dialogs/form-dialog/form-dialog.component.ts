// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DocumentService } from '../../document.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Document } from '../../document.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DocumentDropDown } from '../../documentDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentDocument 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Document;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean = true;

  public DocumentList?: DocumentDropDown[] = [];

  image: any;
  fileUploadEl: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentDocument>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DocumentService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Document';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
            this.onBlurUpdateDateEdit(startDate);
            this.onBlurUpdateEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Document';
          this.advanceTable = new Document({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void {
    
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
      documentID: [this.advanceTable.documentID],
      documentName: [this.advanceTable.documentName],
      availableToGuest: [this.advanceTable.availableToGuest],
      mandatoryForSDGuestSoftRegistration: [this.advanceTable.mandatoryForSDGuestSoftRegistration],
      mandatoryForSDGuestRegistrationCompletion: [this.advanceTable.mandatoryForSDGuestRegistrationCompletion],
      availableToVendor: [this.advanceTable.availableToVendor],
      mandatoryForVendorSoftRegistration: [this.advanceTable.mandatoryForVendorSoftRegistration],
      mandatoryForVendorRegistrationCompletion: [this.advanceTable.mandatoryForVendorRegistrationCompletion],
      availableToDriver:[this.advanceTable.availableToDriver],
      mandatoryForDriverSoftRegistration: [this.advanceTable.mandatoryForDriverSoftRegistration],
      mandatoryForDriverRegistrationCompletion: [this.advanceTable.mandatoryForDriverRegistrationCompletion],
      documentType: [this.advanceTable.documentType],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
      activationStatus: [this.advanceTable.activationStatus],
      availableToInventory:[this.advanceTable.availableToInventory],
      mandatoryForInventorySoftRegistration:[this.advanceTable.mandatoryForInventorySoftRegistration],
      mandatoryForInventoryRegistrationCompletion:[this.advanceTable.mandatoryForInventoryRegistrationCompletion]
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
  onNoClick(){
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
        if(this.action==='fromVD')
          {
            this.saveDisabled = true;
            this.showNotification(
              'snackbar-success',
              'Document Created...!!!',
              'bottom',
              'center'
            );
          }
       this._generalService.sendUpdate('DocumentCreate:DocumentView:Success');//To Send Updates  
       this.saveDisabled = true;

    
    },
    error =>
    {
      if(this.action==='fromVD')
        {
          this.saveDisabled = true;
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          );
        }
       this._generalService.sendUpdate('DocumentAll:DocumentView:Failure');//To Send Updates 
       this.saveDisabled = true;
 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DocumentUpdate:DocumentView:Success');//To Send Updates 
       this.saveDisabled = true;
 
       
    },
    error =>
    {
     this._generalService.sendUpdate('DocumentAll:DocumentView:Failure');//To Send Updates  
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

//   if (/[a-zA-Z]/.Document(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

//start date
onBlurUpdateDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
  }
}

onBlurUpdateDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if(this.action==='edit')
    {
      this.advanceTable.startDate=formattedDate
    }
    else{
      this.advanceTableForm.get('startDate')?.setValue(formattedDate);
    }
    
  } else {
    this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
  }
}

//end date
onBlurUpdateEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.endDate=formattedDate
  }
  else{
    this.advanceTableForm.get('endDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}
}

}



