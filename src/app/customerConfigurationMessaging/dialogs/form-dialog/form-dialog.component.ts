// @ts-nocheck
import { MAT_DIALOG_DATA,MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerConfigurationMessagingService } from '../../customerConfigurationMessaging.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerConfigurationMessaging } from '../../customerConfigurationMessaging.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerConfigurationMessagingDropDown } from '../../customerConfigurationMessagingDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { SaveDialogComponent } from '../saveDialog/saveDialog.component';
//import { CustomerConfigurationMessagingTypeDropDown } from 'src/app/general/customerConfigurationMessagingDropDown.model';
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
  advanceTable: CustomerConfigurationMessaging;
  fName = '';
  contents: any[];
  mydata = [];
  name = ''; 
  image: any;
  fileUploadEl: any;
  customerName: any;
  CustomerID:any;
 saveDisabled:boolean = true;
  constructor(
    public SaveDialog: MatDialog,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerConfigurationMessagingService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Messaging Configuration  For';       
          this.advanceTable = data.advanceTable;
         
        } else 
        {
          this.dialogTitle = 'Messaging Configuration For';
          this.advanceTable = new CustomerConfigurationMessaging({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
  }
  public ngOnInit(): void
  {
    this.advanceTableForm.controls["activationStatus"].disable();
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
      customerConfigurationMessagingID: [this.advanceTable.customerConfigurationMessagingID],
      customerID: [this.advanceTable.customerID],
      reservationSMSToBooker: [this.advanceTable.reservationSMSToBooker],
      allotmentSMSToBooker: [this.advanceTable.allotmentSMSToBooker],
      dispatchSMSToBooker: [this.advanceTable.dispatchSMSToBooker],
      reachedSMSToBooker: [this.advanceTable.reachedSMSToBooker],
      tripStartSMSToBooker: [this.advanceTable.tripStartSMSToBooker],
      tripEndSMSToBooker: [this.advanceTable.tripEndSMSToBooker],
      reservationEmailToBooker: [this.advanceTable.reservationEmailToBooker],
      allotmentEmailToBooker: [this.advanceTable.allotmentEmailToBooker],
      dispatchEmailToBooker: [this.advanceTable.dispatchEmailToBooker],
      reachedEmailToBooker: [this.advanceTable.reachedEmailToBooker],
      tripStartEmailToBooker:[this.advanceTable.tripStartEmailToBooker],
      tripEndEmailToBooker: [this.advanceTable.tripEndEmailToBooker],
      reservationSMSToPassenger: [this.advanceTable.reservationSMSToPassenger],
      allotmentSMSToPassenger: [this.advanceTable.allotmentSMSToPassenger],
      dispatchSMSToPassenger: [this.advanceTable.dispatchSMSToPassenger],
      reachedSMSToPassenger: [this.advanceTable.reachedSMSToPassenger],
      tripStartSMSToPassenger: [this.advanceTable.tripStartSMSToPassenger],
      tripEndSMSToPassenger: [this.advanceTable.tripEndSMSToPassenger],
      reservationEmailToPassenger: [this.advanceTable.reservationEmailToPassenger],
      allotmentEmailToPassenger: [this.advanceTable.allotmentEmailToPassenger],
      dispatchEmailToPassenger: [this.advanceTable.dispatchEmailToPassenger],
      reachedEmailToPassenger: [this.advanceTable.reachedEmailToPassenger],
      tripStartEmailToPassenger: [this.advanceTable.tripStartEmailToPassenger],
      tripEndEmailToPassenger: [this.advanceTable.tripEndEmailToPassenger],
      passengerSMSAlert: [this.advanceTable.passengerSMSAlert],
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
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  
  openSaveDialog(){
    this.SaveDialog.open(SaveDialogComponent, 
    {
      data: 
        {
          actions:this.data.action,
          advanceTableForm:this.advanceTableForm,
          dialogRef:this.dialogRef,
          customerID:this.CustomerID
        }
    });

  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {     
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationMessagingCreate:CustomerConfigurationMessagingView:Success');//To Send Updates
       this.saveDisabled = true;  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CustomerConfigurationMessagingAll:CustomerConfigurationMessagingView:Failure');//To Send Updates
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
       this._generalService.sendUpdate('CustomerConfigurationMessagingUpdate:CustomerConfigurationMessagingView:Success');//To Send Updates
       this.saveDisabled = true;  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerConfigurationMessagingAll:CustomerConfigurationMessagingView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled = false;
       if(this.action==="edit")
       {
          this.Put();
       }
       else
       {
          this.Post();
       }
  }
  // OnCustomerConfigurationMessagingChangeGetcurrencies()
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

}


