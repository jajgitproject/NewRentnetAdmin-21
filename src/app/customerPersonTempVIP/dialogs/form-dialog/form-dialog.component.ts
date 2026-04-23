// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonTempVIPService } from '../../customerPersonTempVIP.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerPersonTempVIP } from '../../customerPersonTempVIP.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { CustomerTypeDropDown } from 'src/app/customerType/customerTypeDropDown.model';
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
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
  advanceTable: CustomerPersonTempVIP;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean = true;
 
  public RateList?: SupplierRateCardDropDown[] = [];

  image: any;
  fileUploadEl: any;
  SupplierName: any;
  SUPPLIERID: any;
  public customerTypeList?: CustomerTypeDropDown[] = [];
  public customerList?: CustomerDropDown[] = [];
  CustomerPersonID!: number;
  CustomerPersonName!: string;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerPersonTempVIPService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        this.CustomerPersonID= data.customerPersonID,
        this.CustomerPersonName =data.customerPersonName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Temporary VIP Status for';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.vipStatusStartDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.vipStatusEndDate).format('DD/MM/yyyy');
          let bookingDate=moment(this.advanceTable.forNumberofBookingsStartsFrom).format('DD/MM/yyyy');
          this.onBlurVIPStartDateEdit(startDate);
          this.onBlurVIPEndDateEdit(endDate);
          this.onBlurNoBookingStartDateEdit(bookingDate);
        } else 
        {
          this.dialogTitle = 'Temporary VIP Status for';
          this.advanceTable = new CustomerPersonTempVIP({});
          this.advanceTable.activationStatus=true;
          //this.advanceTable.supplierName=data.SUPPLIERNAME;
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.initCustomerType();
    this.initCustomerfor();
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

  initCustomerType(){
    this._generalService.getCustomerType().subscribe(
      data=>{
        this.customerTypeList=data;
      }
    )
  }

  initCustomerfor(){
    this._generalService.getCustomer().subscribe(
      data=>{
        this.customerList=data;
      }
    )
    
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
      customerPersonTempVIPID: [this.advanceTable.customerPersonTempVIPID],
      customerPersonID: [this.advanceTable.customerPersonID],
      incidenceID: [this.advanceTable.incidenceID],
      forNumberofBookings: [this.advanceTable.forNumberofBookings],
      vipStatusStartDate: [this.advanceTable.vipStatusStartDate,[Validators.required, this._generalService.dateValidator()]],
      vipStatusEndDate: [this.advanceTable.vipStatusEndDate,[Validators.required, this._generalService.dateValidator()]],
      forNumberofBookingsStartsFrom: [this.advanceTable.forNumberofBookingsStartsFrom,[Validators.required, this._generalService.dateValidator()]],
      remark: [this.advanceTable.remark],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  //start date
  onBlurVIPStartDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('vipStatusStartDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('vipStatusStartDate')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurVIPStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.vipStatusStartDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('vipStatusStartDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('vipStatusStartDate')?.setErrors({ invalidDate: true });
    }
  }
               
  //end date
  onBlurVIPEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('vipStatusEndDate')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('vipStatusEndDate')?.setErrors({ invalidDate: true });
    }
  }
              
  onBlurVIPEndDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.vipStatusEndDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('vipStatusEndDate')?.setValue(formattedDate);
      }    
    } else {
        this.advanceTableForm.get('vipStatusEndDate')?.setErrors({ invalidDate: true });
      }
  }

  //booking date
  onBlurNoBookingStartDate(value: string): void {
   value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('forNumberofBookingsStartsFrom')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('forNumberofBookingsStartsFrom')?.setErrors({ invalidDate: true });
    }
  }
              
  onBlurNoBookingStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.forNumberofBookingsStartsFrom=formattedDate
      }
      else
      {
        this.advanceTableForm.get('forNumberofBookingsStartsFrom')?.setValue(formattedDate);
      }    
    } else {
        this.advanceTableForm.get('forNumberofBookingsStartsFrom')?.setErrors({ invalidDate: true });
      }
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
  public Post(): void
  {
    this.advanceTableForm.patchValue({ customerPersonID:this.data.customerPersonID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonTempVIPCreate:CustomerPersonTempVIPView:Success');//To Send Updates  
       this.saveDisabled = true;
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerPersonTempVIPAll:CustomerPersonTempVIPView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonTempVIPUpdate:CustomerPersonTempVIPView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonTempVIPAll:CustomerPersonTempVIPView:Failure');//To Send Updates 
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

//   if (/[a-zA-Z]/.customerPersonTempVIP(inp)) {
//     return true;
//   } else {
//     event.preventDefault();
//     return false;
//   }
// }

}



