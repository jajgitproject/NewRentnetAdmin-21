// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { CustomerConfigurationInvoicingService } from '../../customerConfigurationInvoicing.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerConfigurationInvoicing } from '../../customerConfigurationInvoicing.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentHolder 
{
  isMaxLengthExceeded = false;
  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  filteredCityOptions: Observable<CityDropDown[]>;
  searchCityTerm: FormControl = new FormControl();
  image: any;
  advanceTable: CustomerConfigurationInvoicing;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  geoPointStateID: any;
  geoPointCityID: any;
saveDisabled:boolean = true;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerConfigurationInvoicingService,
    private fb: FormBuilder,
  public _generalService:GeneralService,
  private cdr: ChangeDetectorRef)
  {
        // Set the defaults
        this.action = data.action;
         
        if (this.action === 'edit') 
        {
          this.advanceTable = data.advanceTable;
          this.advanceTableForm = this.createContactForm(); 
          this.dialogTitle ='Customer Configuration Invoicing For';       
          this.searchStateTerm.setValue(this.advanceTable.billingStateName);
          this.searchCityTerm.setValue(this.advanceTable.billingCityName);
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurStartDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
          let sezStartDate=moment(this.advanceTable.sezStartDate).format('DD/MM/yyyy');
          let sezEndDate=moment(this.advanceTable.sezEndDate).format('DD/MM/yyyy');
          this.onBlurSEZStartDateEdit(sezStartDate);
          this.onBlurSEZEndDateEdit(sezEndDate);
          this.advanceTableForm?.controls['billingAddress'].setValue(this.advanceTable.billingAddress);
          this.advanceTableForm?.controls['eInvoiceAddress'].setValue(this.advanceTable.eInvoiceAddress);
          this.advanceTableForm.controls['startDate'].setValue(this.advanceTable.startDate);
        } else 
        {
          this.dialogTitle = 'Customer Configuration Invoicing For';
          this.advanceTable = new CustomerConfigurationInvoicing({});
          this.advanceTable.activationStatus=true;
          this.advanceTableForm = this.createContactForm(); 
        }
          
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
  }

  //----------- Validator ---------
  billingStateNameValidator(StatesList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = StatesList.some(group => group.geoPointName.toLowerCase() === value);
    return match ? null : { billingStateNameInvalid: true };
  };
}

  public ngOnInit(): void
  {
    this.deferFormUpdate(() => {
      this.advanceTableForm.patchValue({customerName:this.customerName});
      if (this.action === 'edit') {
        this.geoPointStateID = this.advanceTable?.billingStateID || null;
        this.geoPointCityID = this.advanceTable?.billingCityID || null;
        if (this.geoPointStateID) {
          this.OnStateChangeGetCity();
        }
      }
    });
    {
      this._generalService.GetStatesAl().subscribe
      (
        data =>   
        {
          this.deferFormUpdate(() => {
            this.StatesList = data;
            this.advanceTableForm.controls['billingStateName'].setValidators([Validators.required,
              this.billingStateNameValidator(this.StatesList)
            ]);
            this.advanceTableForm.controls['billingStateName'].updateValueAndValidity();  
            this.filteredStateOptions = this.advanceTableForm.controls['billingStateName'].valueChanges.pipe(
              startWith(""),
              map(value => this._filterState(value || ''))
            );
          });
        });
    }
  }

  private deferFormUpdate(apply: () => void): void {
    setTimeout(() => {
      apply();
      this.cdr.detectChanges();
    }, 0);
  }

  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.StatesList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
  }
  OnStateSelect(selectedState: string)
  {
    const StateName = this.StatesList.find(
      data => data.geoPointName === selectedState
    );
    if (selectedState) 
    {
      this.getStateID(StateName.geoPointID);
    }
  }
  getStateID(geoPointID: any)
  {
    this.geoPointStateID=geoPointID;
    this.OnStateChangeGetCity();
    this.advanceTableForm.controls['billingCityName'].setValue('');
    //this.OnStateChangeGetCity();
  }

  onStateInputChange(event: any) {
    if(event.target.value.length === 0) {
      this.advanceTableForm.controls['billingCityName'].setValue('');
      this.OnStateChangeGetCity();
    } 
  }

  //----------- Validator ---------
  billingCityNameValidator(CityList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null;
    if (!CityList || CityList.length === 0) return null;

    const value = control.value.toLowerCase();

    const match = CityList.some(
      city => city.geoPointName.toLowerCase() === value
    );

    return match ? null : { billingCityNameInvalid: true };
  };
}

triggerBillingCityValidation() {
  const control = this.advanceTableForm.get('billingCityName');
  control.markAsTouched();
  control.updateValueAndValidity();
}
  
  OnStateChangeGetCity(){
    if (!this.geoPointStateID) {
      this.CityList = [];
      this.advanceTableForm.controls['billingCityName'].updateValueAndValidity();
      return;
    }
    this._generalService.GetCities(this.geoPointStateID).subscribe(
      data =>
      {
        this.deferFormUpdate(() => {
          this.CityList = data;
          this.advanceTableForm.controls['billingCityName'].setValidators([Validators.required,
            this.billingCityNameValidator(this.CityList)
          ]);
          if (this.action === 'edit' && this.advanceTable?.billingCityName) {
            this.advanceTableForm.controls['billingCityName'].setValue(this.advanceTable.billingCityName, { emitEvent: false });
          }
          this.advanceTableForm.controls['billingCityName'].updateValueAndValidity();
          this.filteredCityOptions = this.advanceTableForm.controls['billingCityName'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterCity(value || ''))
          );
        });                  
      },
      error=>
      {
   
      }
    );
   }
   private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityList.filter(
      customer =>
      {
        return customer.geoPointName.toLowerCase().includes(filterValue);
      });
   }
  OnCitySelect(selectedCity: string)
  {
    const CityName = this.CityList.find(
      data => data.geoPointName === selectedCity
    );
    if (selectedCity) 
    {
      this.getCityID(CityName.geoPointID);
    }
  }
  getCityID(geoPointID: any)
  {
    this.geoPointCityID=geoPointID; 
  }

reset(): void 
  {
    this.advanceTableForm.reset();
   
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
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
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerConfigurationInvoicingID: [this.advanceTable.customerConfigurationInvoicingID],
      customerID: [this.advanceTable.customerID],
      gstNumber: [this.advanceTable.gstNumber || null],
      gstRate: [this.advanceTable.gstRate],
      //billingName: [this.advanceTable.billingName],
      // billingAddress: [this.advanceTable.billingAddress,[Validators.maxLength(99)]],
       billingAddress: ['', [Validators.required, Validators.maxLength(499)]],
      billingCityID: [this.advanceTable.billingCityID],
      billingStateID: [this.advanceTable.billingStateID],
      billingCityName: [this.advanceTable.billingCityName, [Validators.required, this.billingCityNameValidator(this.CityList)]],
      billingStateName: [this.advanceTable.billingStateName],
      billingPin: [this.advanceTable.billingPin],
      // eInvoiceAddress: [this.advanceTable.eInvoiceAddress],
      eInvoiceAddress: ['', [Validators.required, Validators.maxLength(100)]] ,
      startDate: [this.advanceTable.startDate,[Validators.required, this._generalService.dateValidator()]],
      endDate: [this.advanceTable?.endDate],
      activationStatus: [this.advanceTable.activationStatus],
      customerName:[this.advanceTable.customerName],
      isBaseForInvoicing:[this.advanceTable.isBaseForInvoicing],
      isSEZ:[this.advanceTable.isSEZ],
      sezStartDate:[this.advanceTable?.sezStartDate],
      sezEndDate:[this.advanceTable?.sezEndDate]
    });
  }

  checkMaxLength() {
    const value = this.advanceTableForm.get('eInvoiceAddress')?.value || '';
    this.isMaxLengthExceeded = value.length > 100;
  }

  //start date
  onBlurStartDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
    }
  }
          
  onBlurStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.startDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('startDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
    }
  }
          
  //end date
  onBlurEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["endDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
      }
    }
  }
          
  onBlurEndDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.endDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('endDate')?.setValue(formattedDate);
      }    
    } 
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["endDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
      }
    }
  }

  //SEZ start date
  onBlurSEZStartDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('sezStartDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["sezStartDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('sezStartDate')?.setErrors({ invalidDate: true });
      }
    }
  }
            
  onBlurSEZStartDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.sezStartDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('sezStartDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      if(value === "")
      {
        this.advanceTableForm.controls["sezStartDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('sezStartDate')?.setErrors({ invalidDate: true });
      }
    }
  }

  //SEZ end date
  onBlurSEZEndDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('sezEndDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["sezEndDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('sezEndDate')?.setErrors({ invalidDate: true });
      }
    }
  }
            
  onBlurSEZEndDateEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.sezEndDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('sezEndDate')?.setValue(formattedDate);
      }    
    } 
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["sezEndDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('sezEndDate')?.setErrors({ invalidDate: true });
      }
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
  // onNoClick(): void 
  // {
  //   this.dialogRef.close();
  // }
  public Post(): void
  {
    
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({billingStateID:this.geoPointStateID});
    this.advanceTableForm.patchValue({billingCityID:this.geoPointCityID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerConfigurationInvoicingCreate:CustomerConfigurationInvoicingView:Success');//To Send Updates
      this.saveDisabled = true;  
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerConfigurationInvoicingAll:CustomerConfigurationInvoicingView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({billingStateID:this.geoPointStateID || this.advanceTable.billingStateID});
    this.advanceTableForm.patchValue({billingCityID:this.geoPointCityID || this.advanceTable.billingCityID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationInvoicingUpdate:CustomerConfigurationInvoicingView:Success');//To Send Updates 
       this.saveDisabled = true;
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerConfigurationInvoicingAll:CustomerConfigurationInvoicingView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  limitInput(event: any, maxLength: number) {
    if (event.target.value.length >= maxLength) {
      event.preventDefault();
    }
  }

  get eInvoiceAddressControl() {
    return this.advanceTableForm.get('eInvoiceAddress');
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
}



