// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerConfigurationReservationService } from '../../customerConfigurationReservation.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerConfigurationReservation } from '../../customerConfigurationReservation.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerConfigurationReservationDropDown } from '../../customerConfigurationReservationDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
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
  advanceTable: CustomerConfigurationReservation;
  CustomerID:number;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];

  image: any;
  fileUploadEl: any;
  CustomerName: any;
  saveDisabled:boolean=true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  public dialog:MatDialog,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerConfigurationReservationService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Reservation Configuration For';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Reservation Configuration For';
          this.advanceTable = new CustomerConfigurationReservation({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID=this.data.CustomerID;
        this.CustomerName=this.data.CustomerName;
  }
  public ngOnInit(): void
  {
    this.InitCompany();
    this.InitBranch();
    this.advanceTableForm.controls["activationStatus"].disable();
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  InitCompany(){
    this._generalService.GetCompany().subscribe(
      data=>{
        this.OrganizationalEntityList=data;
      }
    )
  }

  InitBranch(){
    this._generalService.GetOrganizationalBranch().subscribe(
      data=>{
        this.OrganizationalEntitiesList=data;
      }
    )
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
      customerConfigurationReservationID: [this.advanceTable.customerConfigurationReservationID],
      customerID: [this.advanceTable.customerID],
      markAllPassengerVIP: [this.advanceTable.markAllPassengerVIP],
      //acceptBooking: [this.advanceTable.acceptBooking],
      bookingFromBookerOnly: [this.advanceTable.bookingFromBookerOnly],
      allowBackDateBooking: [this.advanceTable.allowBackDateBooking],
      sendFeedBackEMail: [this.advanceTable.sendFeedBackEMail],
      ccReservationEmail: [this.advanceTable.ccReservationEmail],
      passengerEmailIDMandatory: [this.advanceTable.passengerEmailIDMandatory],
      // creditCardRequiredAtReservation: [this.advanceTable.creditCardRequiredAtReservation],
      receiveReservationFrom: [this.advanceTable.receiveReservationFrom],
      allowDuplicateBooking: [this.advanceTable.allowDuplicateBooking],
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
  // public Post(): void
  // {
  //   this.advanceTableForm.patchValue({customerID:this.customerID});
  //   this.advanceTableService.add(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //   response => 
  //   {
  //       this.dialogRef.close();
  //      this._generalService.sendUpdate('CustomerConfigurationReservationCreate:CustomerConfigurationReservationView:Success');//To Send Updates  
    
  //   },
  //   error =>
  //   {
  //      this._generalService.sendUpdate('CustomerConfigurationReservationAll:CustomerConfigurationReservationView:Failure');//To Send Updates  
  //   }
  // )
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

  openSaveDialog()
  {
    const dialogRef = this.dialog.open(SaveDialogComponent, 
    {
      data:
      {
        advanceTableForm:this.advanceTableForm,
        customerID:this.CustomerID,
        dialogRef:this.dialogRef,
        saveDisabled:this.saveDisabled,
        action:this.action,
        advanceTable:this.data.advanceTable
      } 
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

//   if (/[a-zA-Z]/.customerConfigurationReservation(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}


