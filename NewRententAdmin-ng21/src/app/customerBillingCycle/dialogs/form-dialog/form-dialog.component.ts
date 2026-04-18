// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CustomerBillingCycle } from '../../customerBillingCycle.model';
import { CustomerBillingCycleService } from '../../customerBillingCycle.service';
import { BillingCycleNameDropDown } from 'src/app/billingCycleName/billingCycleNameDropDown.model';
import { BillingTypeDropDown } from 'src/app/billingType/billingTypeDropDown.model';

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
  advanceTable: CustomerBillingCycle;
  CustomerID:number;
  billingTypeNameOnCityID: number;
  billingCycleNameOnbillingTypeNameID:number;
  isLandmarkHidden = true;
  saveDisabled:boolean = true;
  public BillingCycleNameList?: BillingCycleNameDropDown[] = [];
  public BillingTypeList?: BillingTypeDropDown[] = [];
  filteredBillingCycleNameOptions: Observable<BillingCycleNameDropDown[]>;
  searchBillingCycleNameTerm: FormControl = new FormControl();
  filteredBillingTypeOptions: Observable<BillingTypeDropDown[]>;
  searchBillingTypeTerm: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  CustomerName: any;
  billingTypeID: number;
  billingCycleNameID: number;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerBillingCycleService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Billing Cycle For';       
          this.advanceTable = data.advanceTable;
        } 
        else 
        {
          this.dialogTitle = 'Customer Billing Cycle For';
          this.advanceTable = new CustomerBillingCycle({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerID=this.data.CustomerID;
        this.CustomerName=this.data.CustomerName;
  }
  public ngOnInit(): void
  {
    this.InitBillingCycleName();
    this.InitBillingType();
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

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerBillingCycleID: [this.advanceTable.customerBillingCycleID],
      customerID: [this.advanceTable.customerID],
      billingCycleNameID: [this.advanceTable.billingCycleNameID],
      billingTypeID: [this.advanceTable.billingTypeID],
      billingTypeName: [this.advanceTable.billingTypeName],
      billingCycleName: [this.advanceTable.billingCycleName],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}




billingCycleNameNameValidator(BillingCycleNameList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = BillingCycleNameList.some(group => group.billingCycleName.toLowerCase() === value);
    return match ? null : { billingCycleNameNameInvalid: true };
  };
}

InitBillingCycleName(){
  this._generalService.getBillingCycleName().subscribe(
    data=>
    {
      this.BillingCycleNameList=data;
      this.advanceTableForm.controls['billingCycleName'].setValidators([Validators.required,
        this.billingCycleNameNameValidator(this.BillingCycleNameList)
      ]);
      this.advanceTableForm.controls['billingCycleName'].updateValueAndValidity();
      this.filteredBillingCycleNameOptions = this.advanceTableForm.controls['billingCycleName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterbillingCycleName(value || ''))
      );
    });
}
private _filterbillingCycleName(value: string): any {
  const filterValue = value.toLowerCase();
  return this.BillingCycleNameList.filter(
    customer =>
    {
      return customer.billingCycleName.toLowerCase().includes(filterValue);
    });
}
OnbillingCycleNameSelect(selectedbillingCycleName: string)
{
  const BillingCycleName = this.BillingCycleNameList.find(
    data => data.billingCycleName === selectedbillingCycleName
  );
  if (selectedbillingCycleName) 
  {
    this.getBillingCycleNameID(BillingCycleName.billingCycleID);
  }
}
getBillingCycleNameID(billingCycleID: any)
{
  this.billingCycleNameID=billingCycleID;
}



billingTypeNameNameValidator(BillingTypeList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = BillingTypeList.some(group => group.billingTypeName.toLowerCase() === value);
    return match ? null : { billingTypeNameNameInvalid: true };
  };
}

InitBillingType(){
  this._generalService.getBillingType().subscribe(
    data =>
    {
      this.BillingTypeList = data;
      this.advanceTableForm.controls['billingTypeName'].setValidators([Validators.required,
        this.billingTypeNameNameValidator(this.BillingTypeList)
      ]);
      this.advanceTableForm.controls['billingTypeName'].updateValueAndValidity();
      this.filteredBillingTypeOptions = this.advanceTableForm.controls['billingTypeName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterbillingTypeName(value || ''))
      );              
    },
    error=>{}
  );
}
private _filterbillingTypeName(value: string): any {
const filterValue = value.toLowerCase();
// if (!value || value.length < 3) {
//       return [];   
//     }
return this.BillingTypeList?.filter(
  customer =>
  {
    return customer.billingTypeName.toLowerCase().includes(filterValue);
  });
}
OnbillingTypeNameSelect(selectedbillingTypeName: string)
{
  const billingTypeNameName = this.BillingTypeList.find(
    data => data.billingTypeName === selectedbillingTypeName
  );
  if (selectedbillingTypeName) 
  {
    this.getbillingTypeNameID(billingTypeNameName.billingTypeID);
  }
}
getbillingTypeNameID(billingTypeID: any) 
{
this.billingTypeID=billingTypeID;

}
 submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerID:this.CustomerID});
    this.advanceTableForm.patchValue({billingCycleNameID:this.billingCycleNameID});
    this.advanceTableForm.patchValue({billingTypeID:this.billingTypeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerBillingCycleCreate:CustomerBillingCycleView:Success');//To Send Updates 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerBillingCycleAll:CustomerBillingCycleView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.advanceTable.customerID});
    this.advanceTableForm.patchValue({billingCycleNameID:this.billingCycleNameID || this.advanceTable.billingCycleNameID});
    this.advanceTableForm.patchValue({billingTypeID:this.billingTypeID || this.advanceTable.billingTypeID});
  
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerBillingCycleUpdate:CustomerBillingCycleView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerBillingCycleAll:CustomerBillingCycleView:Failure');//To Send Updates
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

  


}

