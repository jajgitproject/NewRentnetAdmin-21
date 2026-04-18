// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { InventoryStatusHistoryService } from '../../inventoryStatusHistory.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { InventoryStatusHistory } from '../../inventoryStatusHistory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import moment from 'moment';
import { ThemeService } from 'ng2-charts';
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
  advanceTable: InventoryStatusHistory;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  public RateList?: SupplierRateCardDropDown[] = [];
  image: any;
  fileUploadEl: any;
  SupplierName: any;
  SUPPLIERID: any;
  RegistrationNumber!: string;
  InventoryID!: number;
  VechileID!: number;
  vechicleName!:string;
  vehicle: any;
  saveDisabled: boolean = true;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InventoryStatusHistoryService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    this.InventoryID = data.inventoryID;
    this.RegistrationNumber = data.registrationNumber;
    this.vechicleName = data.vehicle;
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Inventory Status History';  
      this.advanceTable = data.advanceTable;   
      //this.ImagePath=this.advanceTable.currencySign;  
      this.ImagePath=this.advanceTable.supportingDocImage;
    } else 
    {
      this.dialogTitle = 'Inventory Status History';
      this.advanceTable = new InventoryStatusHistory({});
    }
    this.advanceTable.vehicle = this.data.vechicleName;
    this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.initRate();
    if(this.vehicle)
    {
      this.advanceTableForm.patchValue({vehicle:this.vehicle});
      this.advanceTableForm.controls["vehicle"].disable();
    }
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

  initRate(){
    this._generalService.GetRateList().subscribe(
      data=>
      {
        this.RateList=data;
      });
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      inventoryID:[this.advanceTable.inventoryID],
      statusDate: [this.advanceTable.statusDate],
      inventoryStatus: [this.advanceTable.inventoryStatus],
      vehicle:[this.advanceTable.vehicle],
      statusChangedByID: [this.advanceTable.statusChangedByID],
      statusReason: [this.advanceTable.statusReason],
      supportingDocImage: [this.advanceTable.supportingDocImage],
     //activationStatus: [this.advanceTable.activationStatus]
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
  onNoClick()
  {
    this.ImagePath="";
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({ inventoryID:this.data.inventoryID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('InventoryStatusHistoryCreate:InventoryStatusHistoryView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('InventoryStatusHistoryAll:InventoryStatusHistoryView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({ inventoryID:this.advanceTable.inventoryID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('InventoryStatusHistoryUpdate:InventoryStatusHistoryView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('InventoryStatusHistoryAll:InventoryStatusHistoryView:Failure');//To Send Updates  
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
  
  public uploadFinishedDoc = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({supportingDocImage:this.ImagePath})
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

//   if (/[a-zA-Z]/.inventoryStatusHistory(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}



