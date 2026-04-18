// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { VendorContractService } from '../../vendorContract.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { VendorContractDropDown, VendorContractModel } from '../../vendorContract.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { ModeOfPaymentDropDown } from 'src/app/modeOfPayment/modeOfPaymentDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  advanceTable: VendorContractModel;
 
  public VendorContractList?: VendorContractDropDown[] = [];

  public CreatedList?: EmployeeDropDown[] = [];
  filteredCreatedOptions: Observable<EmployeeDropDown[]>;
  contractCreatedByID:any;

  public ApprovedList?: EmployeeDropDown[] = [];
  filteredApprovedOptions: Observable<EmployeeDropDown[]>;
  contractApprovedByID:any;
  
  public CurrencyList?: CurrencyDropDown[] = [];
  filteredCurrencyOptions: Observable<CurrencyDropDown[]>;
  currencyForBillingID:any;

  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  filteredModeOptions: Observable<ModeOfPaymentDropDown[]>;
  modeOfPaymentID:any;

  public BranchList?: OrganizationalEntityDropDown[] = [];
  filteredBranchOptions: Observable<ModeOfPaymentDropDown[]>;
  branchID:any;
  
  saveDisabled:boolean=true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: VendorContractService,
      private fb: FormBuilder,
      private el: ElementRef,
    public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Vendor Contract';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.copiedFrom='N/A';
          let startDate=moment(this.advanceTable.vendorContractValidFrom).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.vendorContractValidTo).format('DD/MM/yyyy');
          this.onBlurValidFromEdit(startDate);
          this.onBlurValidToEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Vendor Contract';
          this.advanceTable = new VendorContractModel({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.copiedFrom='N/A';
        }
        this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    this.InitCreatedBy();
    this.InitApprovedBy();
    this.InitCurrencies();
    this.InitModeOfPayment();
    this.InitBranch();
  }


  onNoClick()
  {
    if(this.action === 'add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }

  //---------- Created By ----------
  createdByValidator(CreatedList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CreatedList.some(group => (group.firstName + ' ' + group.lastName).toLowerCase() === value);
      return match ? null : { invalidCreatedBySelection: true };
    };
  }
  InitCreatedBy()
  {
    this._generalService.GetEmployee().subscribe
    (
      data =>   
      {
        this.CreatedList = data;
        this.advanceTableForm.controls['contractCreatedByName'].setValidators([Validators.required,this.createdByValidator(this.CreatedList)]);
        this.advanceTableForm.controls['contractCreatedByName'].updateValueAndValidity();
        this.filteredCreatedOptions = this.advanceTableForm.controls['contractCreatedByName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCreated(value || ''))
        );
      }
    );
  }
  private _filterCreated(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CreatedList.filter(
      data => 
      {
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  };
  OnCreateBySelect(selectedCreatedBy: string)
  {
    const CreatedByName = this.CreatedList.find(
      data => `${data.firstName} ${data.lastName}` === selectedCreatedBy
    );
    if (selectedCreatedBy) 
    {
      this.getCreatedID(CreatedByName.employeeID);
    }
  }
  getCreatedID(employeeID: any)
  {
    this.contractCreatedByID = employeeID;
  }

  
  //---------- Approved By ----------
  approvedByValidator(ApprovedList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ApprovedList.some(group => (group.firstName + ' ' + group.lastName).toLowerCase() === value);
      return match ? null : { invalidApprovedBySelection: true };
    };
  }

  InitApprovedBy()
  {
    this._generalService.GetEmployee().subscribe
    (
      data =>   
      {
        this.ApprovedList = data; 
        this.advanceTableForm.controls['contractApprovedByName'].setValidators([Validators.required,this.approvedByValidator(this.ApprovedList)]);
        this.advanceTableForm.controls['contractApprovedByName'].updateValueAndValidity();
        this.filteredApprovedOptions = this.advanceTableForm.controls['contractApprovedByName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterApproved(value || ''))
        );
      }
    );
  }
  private _filterApproved(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.ApprovedList.filter(
      data => 
      {
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  };
  OnApprovedBySelect(selectedApprovedBy: string)
  {
    const ApprovedByName = this.ApprovedList.find(
      data => `${data.firstName} ${data.lastName}` === selectedApprovedBy
    );
    if (selectedApprovedBy) 
    {
      this.getApprovedID(ApprovedByName.employeeID);
    }
  }
  getApprovedID(employeeID: any) 
  {
    this.contractApprovedByID = employeeID;
  }

  InitCurrencies() 
  {
    this._generalService.GetCurrency().subscribe(
      data =>
      {
        this.CurrencyList = data;
        this.filteredCurrencyOptions = this.advanceTableForm.controls['currencyName'].valueChanges.pipe(
         startWith(""),
         map(value => this._filterCurrency(value || ''))
       );
      }
    );
   }

   private _filterCurrency(value: string): any {
     const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
     return this.CurrencyList.filter(
       data => 
       {
         return data.currencyName.toLowerCase().indexOf(filterValue)===0;
       }
     ); 
   };
  OnBillingCurrencySelect(selectedBillingCurrency: string)
  {
    const BillingCurrencyName = this.CurrencyList.find(
      data => data.currencyName === selectedBillingCurrency
    );
    if (selectedBillingCurrency) 
    {
      this.getBillingCurrencyID(BillingCurrencyName.currencyID);
    }
  }
   getBillingCurrencyID(currencyID: any) 
   {
      this.currencyForBillingID = currencyID;
   }


  //---------- Mode Of Payment ----------
  modeOfPaymentValidator(ModeOfPaymentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ModeOfPaymentList.some(group => group.modeOfPayment.toLowerCase() === value);
      return match ? null : { invalidModeOfPaymentSelection: true };
    };
  }

  InitModeOfPayment()
  {
    this._generalService.GetModeOfPayment().subscribe
    (
      data =>   
      {
        this.ModeOfPaymentList = data; 
        this.advanceTableForm.controls['modeOfPayment'].setValidators([Validators.required,this.modeOfPaymentValidator(this.ModeOfPaymentList)]);
        this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
        this.filteredModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterModeOfPayment(value || ''))
        ); 
      }
    );
  }

  private _filterModeOfPayment(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ModeOfPaymentList.filter(
      data => 
      {
        return data.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
      }
    );   
   };
  OnMOPSelect(selectedMOP: string)
  {
    const MOPName = this.ModeOfPaymentList.find(
      data => data.modeOfPayment === selectedMOP
    );
    if (selectedMOP) 
    {
      this.getModeOfPaymentID(MOPName.modeOfPaymentID);
    }
  }
   getModeOfPaymentID(modeOfPaymentID: any) 
   {
    this.modeOfPaymentID = modeOfPaymentID;
   }


  //---------- Branch ----------
  branchValidator(BranchList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BranchList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { invalidBranchSelection: true };
    };
  }

  InitBranch()
  {
    this._generalService.GetOrganizationalBranch().subscribe(
      data=>{
        this.BranchList=data;
        this.advanceTableForm.controls['branch'].setValidators([Validators.required,this.branchValidator(this.BranchList)]);
        this.advanceTableForm.controls['branch'].updateValueAndValidity();
        this.filteredBranchOptions = this.advanceTableForm.controls['branch'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterBranch(value || ''))
        );
      }
    )
  }
  private _filterBranch(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.BranchList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  };
  OnBranchSelect(selectedBranch: string)
  {
    const BranchName = this.BranchList.find(
      data => data.organizationalEntityName === selectedBranch
    );
    if (selectedBranch) 
    {
      this.getBranchID(BranchName.organizationalEntityID);
    }
  }
  getBranchID(organizationalEntityID: any) 
  {
    this.branchID = organizationalEntityID;
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

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() 
  {
    return this.formControl.hasError('required') ? 'Required field'
      : this.formControl.hasError('email') ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vendorContractID: [this.advanceTable.vendorContractID],
      vendorContractName: [this.advanceTable.vendorContractName],
      vendorContractValidFrom: [this.advanceTable.vendorContractValidFrom,[Validators.required, this._generalService.dateValidator()]],
      vendorContractValidTo: [this.advanceTable.vendorContractValidTo,[Validators.required, this._generalService.dateValidator()]],
      copiedFromID: [this.advanceTable.copiedFromID],
      copiedFrom: [this.advanceTable.copiedFrom],
      modeOfPaymentID: [this.advanceTable.modeOfPaymentID],
      modeOfPayment:[this.advanceTable.modeOfPayment],
      contractCreatedByID: [this.advanceTable.contractCreatedByID],
      contractCreatedByName:[this.advanceTable.contractCreatedByName],
      contractApprovedByID: [this.advanceTable.contractApprovedByID],
      contractApprovedByName:[this.advanceTable.contractApprovedByName],
      currencyForBillingID: [this.advanceTable.currencyForBillingID],
      currencyName:[this.advanceTable.currencyName],
      currencyRateFixedorFloating: [this.advanceTable.currencyRateFixedorFloating],
      fixedRateOfExchange: [this.advanceTable.fixedRateOfExchange],
      billingCycle: [this.advanceTable.billingCycle],
      tdsChargedOn: [this.advanceTable.tdsChargedOn],
      tdsPercentage: [this.advanceTable.tdsPercentage],
      branchID: [this.advanceTable.branchID],
      branch:[this.advanceTable.branch],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  //valid from
  onBlurValidFrom(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('vendorContractValidFrom')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('vendorContractValidFrom')?.setErrors({ invalidDate: true });
    }
  }
                 
  onBlurValidFromEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.vendorContractValidFrom=formattedDate
      }
      else
      {
        this.advanceTableForm.get('vendorContractValidFrom')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('vendorContractValidFrom')?.setErrors({ invalidDate: true });
    }
  }
                 
  //valid to
  onBlurValidTo(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('vendorContractValidTo')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('vendorContractValidTo')?.setErrors({ invalidDate: true });
    }
  }
                
    onBlurValidToEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.vendorContractValidTo=formattedDate
      }
      else
      {
        this.advanceTableForm.get('vendorContractValidTo')?.setValue(formattedDate);
      }    
    } else {
          this.advanceTableForm.get('vendorContractValidTo')?.setErrors({ invalidDate: true });
        }
    }

  public noWhitespaceValidator(control: FormControl) 
  {
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

  public Post(): void
  { 
    this.advanceTableForm.patchValue({currencyForBillingID:this.currencyForBillingID || this.advanceTable.currencyForBillingID});
    this.advanceTableForm.patchValue({branchID:this.branchID || this.advanceTable.branchID});
    this.advanceTableForm.patchValue({modeOfPaymentID:this.modeOfPaymentID || this.advanceTable.modeOfPaymentID});
    this.advanceTableForm.patchValue({contractApprovedByID:this.contractApprovedByID || this.advanceTable.contractApprovedByID});
    this.advanceTableForm.patchValue({contractCreatedByID:this.contractCreatedByID || this.advanceTable.contractCreatedByID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('VendorContractCreate:VendorContractView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('VendorContractAll:VendorContractView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    })
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({currencyForBillingID:this.currencyForBillingID || this.advanceTable.currencyForBillingID});
    this.advanceTableForm.patchValue({branchID:this.branchID || this.advanceTable.branchID});
    this.advanceTableForm.patchValue({modeOfPaymentID:this.modeOfPaymentID || this.advanceTable.modeOfPaymentID});
    this.advanceTableForm.patchValue({contractApprovedByID:this.contractApprovedByID || this.advanceTable.contractApprovedByID});
    this.advanceTableForm.patchValue({contractCreatedByID:this.contractCreatedByID || this.advanceTable.contractCreatedByID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('VendorContractUpdate:VendorContractView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('VendorContractAll:VendorContractView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    })
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


