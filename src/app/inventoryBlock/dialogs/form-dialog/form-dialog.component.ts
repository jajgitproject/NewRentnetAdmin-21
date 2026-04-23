// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { InventoryBlockService } from '../../inventoryBlock.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { InventoryBlock } from '../../inventoryBlock.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { InventoryBlockDropDown } from '../../inventoryBlockDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
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
  advanceTable: InventoryBlock;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public CurrencyList?: CurrencyDropDown[] = [];
  image: any;
  fileUploadEl: any;
  InventoryID: any;
  RegistrationNumber: any;
  saveDisabled: boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InventoryBlockService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Inventory Block For';       
          this.dialogTitle ='Inventory Block For';
          this.advanceTable = data.advanceTable;
          let inventoryBlockStartDate=moment(this.advanceTable.inventoryBlockStartDate).format('DD/MM/yyyy');
          let inventoryBlockEndDate=moment(this.advanceTable.inventoryBlockEndDate).format('DD/MM/yyyy');
          this.onBlurUpdateDateEdit(inventoryBlockStartDate);
          this.onBlurUpdateEndDateEdit(inventoryBlockEndDate);
          //this.ImagePath=this.advanceTable.flagIcon;
        } else 
        {
         //this.dialogTitle = 'Create Inventory Block For';
         this.dialogTitle = 'Inventory Block For';
          this.advanceTable = new InventoryBlock({});
          this.advanceTable.activationStatus= true;
        }
        this.advanceTableForm = this.createContactForm();
        this.InventoryID=data.InventoryID;
        this.RegistrationNumber=data.RegNo;
  }
  public ngOnInit(): void
  {
    this._generalService.GetCurrencies().subscribe
    (
      data =>   
      {
        this.CurrencyList = data;
      }
    );
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
      inventoryBlockID: [this.advanceTable.inventoryBlockID],
      inventoryID: [this.advanceTable.inventoryID],
      inventoryBlockStartDate : [this.advanceTable.inventoryBlockStartDate],
      inventoryBlockEndDate : [this.advanceTable.inventoryBlockEndDate],
      inventoryBlockReason:[this.advanceTable.inventoryBlockReason],
      activationStatus: [this.advanceTable.activationStatus],
      reasonReference: [this.advanceTable.reasonReference],
 
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
  public Post(): void
  {
    this.advanceTableForm.value.applicableFrom=moment(this.advanceTableForm.value.applicableFrom).format('DD-MM-YYYY');
    this.advanceTableForm.value.applicableTo=moment(this.advanceTableForm.value.applicableTo).format('DD-MMM-YYYY');
    this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.dialogRef.close();
       this._generalService.sendUpdate('InventoryBlockCreate:InventoryBlockView:Success');//To Send Updates  
       this.saveDisabled = true;
  },
    error =>
    {
       this._generalService.sendUpdate('InventoryBlockAll:InventoryBlockView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.value.applicableFrom=moment(this.advanceTableForm.value.applicableFrom).format('DD-MM-YYYY hh:mm:ss');
    this.advanceTableForm.value.applicableTo=moment(this.advanceTableForm.value.applicableTo).format('DD-MM-YYYY hh:mm:ss');
    this.advanceTableForm.patchValue({inventoryID:this.InventoryID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.dialogRef.close();
       this._generalService.sendUpdate('InventoryBlockUpdate:InventoryBlockView:Success');//To Send Updates  
       this.saveDisabled = true; 
    },
    error =>
    {
     this._generalService.sendUpdate('InventoryBlockAll:InventoryBlockView:Failure');//To Send Updates 
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
  // OnInventoryBlockChangeGetcurrencies()
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
keyPressAlphaNumeric(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

//start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('inventoryBlockStartDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('inventoryBlockStartDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.inventoryBlockStartDate=formattedDate
  }
  else{
    this.advanceTableForm.get('inventoryBlockStartDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('inventoryBlockStartDate')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('inventoryBlockEndDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm.get('inventoryBlockEndDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.inventoryBlockEndDate=formattedDate
}
else{
  this.advanceTableForm.get('inventoryBlockEndDate')?.setValue(formattedDate);
}

} else {
this.advanceTableForm.get('inventoryBlockEndDate')?.setErrors({ invalidDate: true });
}
}

}



