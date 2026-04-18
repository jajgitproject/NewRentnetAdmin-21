// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { InventoryPermitService } from '../../inventoryPermit.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { InventoryPermit } from '../../inventoryPermit.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { InventoryPermitDropDown } from '../../inventoryPermitDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import moment from 'moment';
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
  advanceTable: InventoryPermit;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';

  image: any;
  fileUploadEl: any;
  InventoryID: any;
  RegistrationNumber: any;
  saveDisabled: boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>,  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InventoryPermitService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Permit For';       
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.permitImage;
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(startDate);
          this.onBlurUpdateEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Permit For';
          this.advanceTable = new InventoryPermit({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.InventoryID=data.InventoryID;
        this.RegistrationNumber=data.RegNo;
  }
  public ngOnInit(): void
  {

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
      inventoryPermitID: [this.advanceTable.inventoryPermitID],
      inventoryID:  [this.advanceTable.inventoryID],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
      permitAmount: [this.advanceTable.permitAmount],
      permitImage: [this.advanceTable.permitImage],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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
    this.ImagePath="";
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('InventoryPermitCreate:InventoryPermitView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('InventoryPermitAll:InventoryPermitView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({inventoryID:this.advanceTable.inventoryID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('InventoryPermitUpdate:InventoryPermitView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('InventoryPermitAll:InventoryPermitView:Failure');//To Send Updates 
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
    this.advanceTableForm.patchValue({permitImage:this.ImagePath})
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

//   if (/[a-zA-Z]/.inventoryPermit(inp)) {
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



