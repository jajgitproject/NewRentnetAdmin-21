// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierActivationStatusHistoryService } from '../../supplierActivationStatusHistory.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SupplierActivationStatusHistory } from '../../supplierActivationStatusHistory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { SupplierActivationStatusHistoryDropDown } from '../../supplierActivationStatusHistoryDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
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
  advanceTable: SupplierActivationStatusHistory;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  isLoading: boolean = false;
  public SupplierActivationStatusHistoryList?: SupplierActivationStatusHistoryDropDown[] = [];

  image: any;
  fileUploadEl: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierActivationStatusHistoryService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Supplier Status';       
          this.dialogTitle ='Supplier Status';
          this.advanceTable = data.advanceTable;
        } else 
        {
          //this.dialogTitle = 'Change Supplier Status';
          this.dialogTitle = 'Supplier Status';
          this.advanceTable = new SupplierActivationStatusHistory({});
          this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
        //console.log(data.SUPPLIERID);
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
      supplierID: [this.advanceTable.supplierID],
      supplierName: [this.advanceTable.supplierName],
      supplierStatus: [this.advanceTable.supplierStatus],
      supplierStatusReason: [this.advanceTable.supplierStatusReason],
      supplierStatusByEmployeeID: [this.advanceTable.supplierStatusByEmployeeID],
      supplierStatusDate:[this.advanceTable.supplierStatusDate]
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
    this.isLoading = true; // Start loading
  
    this.advanceTableForm.patchValue({ supplierID: this.data.SUPPLIERID });
  
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Stop loading
        this.dialogRef.close();
        this._generalService.sendUpdate(
          'SupplierActivationStatusHistoryCreate:SupplierActivationStatusHistoryView:Success'
        );
      },
      error => {
        this.isLoading = false; // Stop loading
        this._generalService.sendUpdate(
          'SupplierActivationStatusHistoryAll:SupplierActivationStatusHistoryView:Failure'
        );
      }
    );
  }
  
  public Put(): void {
    this.isLoading = true; // Start loading
  
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      response => {
        this.isLoading = false; // Stop loading
        this.dialogRef.close();
        this._generalService.sendUpdate(
          'SupplierActivationStatusHistoryUpdate:SupplierActivationStatusHistoryView:Success'
        );
      },
      error => {
        this.isLoading = false; // Stop loading
        this._generalService.sendUpdate(
          'SupplierActivationStatusHistoryAll:SupplierActivationStatusHistoryView:Failure'
        );
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

//   if (/[a-zA-Z]/.supplierActivationStatusHistory(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


