// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DriverRewardService } from '../../driverReward.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverReward } from '../../driverReward.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { SupplierRateCardDropDown } from 'src/app/supplierRateCard/supplierRateCardDropDown.model';
import { CustomerTypeDropDown } from 'src/app/customerType/customerTypeDropDown.model';
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
import { DriverGradeDropDown } from 'src/app/driverGrade/driverGradeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
  advanceTable: DriverReward;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean=true;
  public RateList?: SupplierRateCardDropDown[] = [];

  public DriverGradeList?: DriverGradeDropDown[] = [];
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<DriverGradeDropDown[]>;

  image: any;
  fileUploadEl: any;
  SupplierName: any;
  SUPPLIERID: any;
  public customerTypeList?: CustomerTypeDropDown[] = [];
  public customerList?: CustomerDropDown[] = [];
  CustomerID!: number;
  CustomerName!: string;
  driverGradeID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverRewardService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // this.CustomerID= data.customerID,
        // this.CustomerName =data.customerName,
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle = 'Edit Driver Grade Reward';
          this.dialogTitle = 'Driver Grade Reward';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
                    let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
                    this.onBlurUpdateDateEdit(startDate);
                    this.onBlurUpdateEndDateEdit(endDate);
          //this.searchTerm.setValue(this.advanceTable.driverGradeName);
        } else 
        {
          //this.dialogTitle = 'Create Driver Grade Reward';
          this.dialogTitle = 'Driver Grade Reward';
          this.advanceTable = new DriverReward({});
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
    this.initDriverGrade();
    
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
  initDriverGrade() {
    
    this._generalService.getDriverGrade().subscribe(
      data =>
      {
        this.DriverGradeList = data;
        this.advanceTableForm.controls['driverGradeName'].setValidators([Validators.required,
          this.DriverGradeTypeValidator(this.DriverGradeList)
        ]);
        this.advanceTableForm.controls['driverGradeName'].updateValueAndValidity();

       this.filteredOptions = this.advanceTableForm.controls['driverGradeName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      },
      error =>
      {
       
      }
    );
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverGradeList.filter(
      customer => 
      {
        return customer.driverGradeName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  getTierID(driverGradeID: any) {
    this.driverGradeID=driverGradeID;
  }

  DriverGradeTypeValidator(DriverGradeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DriverGradeList.some(group => group.driverGradeName.toLowerCase() === value);
      return match ? null : { GradeTypeInvalid: true };
    };
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
      driverRewardID: [this.advanceTable.driverRewardID],
      driverGradeID: [this.advanceTable.driverGradeID],
      rewardAmount: [this.advanceTable.rewardAmount],
      driverGradeName: [this.advanceTable.driverGradeName],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
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
  onNoClick(){
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({driverGradeID:this.driverGradeID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverRewardCreate:DriverRewardView:Success');//To Send Updates  
       this.saveDisabled=true;
    
    },
    error =>
    {
       this._generalService.sendUpdate('DriverRewardAll:DriverRewardView:Failure');//To Send Updates 
       this.saveDisabled=true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({driverGradeID:this.driverGradeID || this.advanceTable.driverGradeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('DriverRewardUpdate:DriverRewardView:Success');//To Send Updates  
       this.saveDisabled=true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverRewardAll:DriverRewardView:Failure');//To Send Updates 
     this.saveDisabled=true;
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

//   if (/[a-zA-Z]/.driverReward(inp)) {
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



