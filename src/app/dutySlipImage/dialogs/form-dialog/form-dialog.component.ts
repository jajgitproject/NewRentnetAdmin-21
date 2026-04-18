// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { VehicleInterStateTaxDropDown } from '../../vehicleInterStateTaxDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DutyAllotmentDetails } from 'src/app/dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
import { DutySlipImage } from '../../dutySlipImage.model';
import { DutySlipImageService } from '../../dutySlipImage.service';
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
  advanceTable: DutySlipImage;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean=true;

  image: any;
  fileUploadEl: any;
  InventoryID: any;
  RegistrationNumber: any;
  dutySlipID:any;
  reservationID:any;

  AllotmentID: any;
  DriverID: any;
  DriverName: any;


  interStateTaxStateID: any;

  dutySlipImageData:any;
  //dutySlipData:DutySlipDetials[]=[];
  driverID: any;
  allotmentID: any;
  driverName: any;
  inventoryID: any;
  registrationNumber: any;
  dutyQualityCheckList:any;
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySlipImageService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        this.dutySlipID=data.dutySlipID;
        this.reservationID=data.reservationID;
        this.AllotmentID=data.allotmentID;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty Slip Image';     
          this.InitDutySlipImage();  
           
        } else 
        {
          this.dialogTitle = 'Duty Slip Image';
          this.advanceTable = new DutySlipImage({});         
          
        }
        this.advanceTableForm = this.createContactForm();      
        this.RegistrationNumber=data.registrationNumber;
       
        if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        {
          this.isSaveAllowed = true;
        } 
        else
        {
          this.isSaveAllowed = false;
        }
  }
  public ngOnInit(): void
  { 
  //this.InitDutySlipImage();
  }



  InitDutySlipImage()
  {
    this.advanceTableService.getAllotmentIDForDutySlipImage(this.AllotmentID).subscribe(
      data=>{
        this.dutySlipImageData=data;        
        this.ImagePath=this.dutySlipImageData[0].dutySlipImage;       
        
      }
    );
  }
  
  formControl = new FormControl('', 
  [
    Validators.required,

  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('dutySlipImage')
      ? 'Not a valid dutySlipImage'
      : '';
  }
  
 

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      
      dutySlipID:  [''],
      allotmentID:  [''],
      dutySlipImage: ['',Validators.required],
      
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

  // reset(): void 
  // {
  //   this.advanceTableForm.reset();
  // }

  onNoClick()
  {
    this.dialogRef.close()
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    //this.advanceTableForm.patchValue({interStateTaxStateID:this.interStateTaxStateID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        
        this.showNotification(
          'snackbar-success',
          'Duty Slip Image Uploaded...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close(response);
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
    }
  )
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    this.advanceTableForm.patchValue({dutySlipImage:this.ImagePath});
 
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        
       //this._generalService.sendUpdate('DutySlipImageUpdate:DutySlipImageView:Success');//To Send Updates  
       this.showNotification(
        'snackbar-success',
        'Duty Slip Image Updated...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=false;
      this.dialogRef.close(response);
    },
    error =>
    {
     
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=false;
     // this._generalService.sendUpdate('DutySlipImageAll:DutySlipImageView:Failure');//To Send Updates  
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled=false;
       if(this.action=="edit")
       {
          this.Put();
       }
       else
       {
          this.Put();
       }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  
  public uploadFinishedSelfie = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({dutySlipImage:this.ImagePath})
  }

  

}


