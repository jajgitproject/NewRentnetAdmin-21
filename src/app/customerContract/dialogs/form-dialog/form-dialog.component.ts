// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerContractService } from '../../customerContract.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerContract } from '../../customerContract.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerContractDropDown } from '../../customerContractDropDown.model';
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
  advanceTable: CustomerContract;
 
  public CustomerContractList?: CustomerContractDropDown[] = [];

  public EmployeeList?: EmployeeDropDown[] = [];
  searchApprovedTerm:  FormControl = new FormControl();
  filteredCreatedOptions: Observable<EmployeeDropDown[]>;

  public EmployeesList?: EmployeeDropDown[] = [];
  searchCreatedTerm:  FormControl = new FormControl();
  filteredApprovedOptions: Observable<EmployeeDropDown[]>;
  
  public CurrencyList?: CurrencyDropDown[] = [];
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<CurrencyDropDown[]>;

  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  searchModeTerm:  FormControl = new FormControl();
  filteredModeOptions: Observable<ModeOfPaymentDropDown[]>;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  searchBranchTerm:  FormControl = new FormControl();
  filteredBranchOptions: Observable<ModeOfPaymentDropDown[]>;
  
  image: any;
  fileUploadEl: any;
  currencyID: any;
  modeOfPaymentID: any;
  organizationalEntityID: any;
  approvedEmployeeID: any;
  createdEmployeeID: any;
  saveDisabled:boolean=true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerContractService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Contract';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.copiedFrom='N/A'; 
          //this.advanceTable.billingCurrency=this.advanceTable.currencyName;
          //this.searchTerm.setValue(this.advanceTable.currencyName);  
          this.advanceTable.approvedBy=this.advanceTable.contractApprovedByName;
          this.advanceTable.createdBy=this.advanceTable.contractCreatedByName;
          this.advanceTable.branch=this.advanceTable.organizationalEntityName;
          // this.searchApprovedTerm.setValue(this.advanceTable.contractApprovedByName);  
          // this.searchCreatedTerm.setValue(this.advanceTable.contractCreatedByName);  
          // this.searchModeTerm.setValue(this.advanceTable.modeOfPayment);  
          // this.searchBranchTerm.setValue(this.advanceTable.organizationalEntityName);  
          // this.advanceTableForm?.controls['surchargeFormula'].setValue(this.advanceTable.surchargeFormula);

          this.advanceTableForm?.controls['surchargeFormula'].setValue(this.advanceTable.surchargeFormula || '');
          let startDate=moment(this.advanceTable.customerContractValidFrom).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.customerContractValidTo).format('DD/MM/yyyy');
          this.onBlurValidFromEdit(startDate);
          this.onBlurValidToEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Customer Contract';
          this.advanceTable = new CustomerContract({});
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
    //this.InitModeOfPayment();
    this.InitBranch();
    if(this.advanceTableForm.controls["surchargeFormula"].value === null || this.advanceTableForm.controls["surchargeFormula"].value === "null")
    {
      this.advanceTableForm.patchValue({surchargeFormula : null});
      this.advanceTableForm.get('percentageOfChangeForFuelSurcharge')?.disable();
      this.advanceTableForm.get('surchargePercentageForAOrB')?.disable();
      this.advanceTableForm.get('surchargeApplicableOnBaseRate')?.disable();
      this.advanceTableForm.get('surchargeApplicableOnExtraKM')?.disable();
      this.advanceTableForm.get('surchargeApplicableOnExtraHR')?.disable();
    }
    else
    {
      this.advanceTableForm.get('percentageOfChangeForFuelSurcharge')?.enable();
      this.advanceTableForm.get('surchargePercentageForAOrB')?.enable();
      this.advanceTableForm.get('surchargeApplicableOnBaseRate')?.enable();
      this.advanceTableForm.get('surchargeApplicableOnExtraKM')?.enable();
      this.advanceTableForm.get('surchargeApplicableOnExtraHR')?.enable();
    }
  }


  onSurchargeFormulaChange(value:any)
  {
    if(value === "null" || value === null)
    {
      this.advanceTableForm.patchValue({
        percentageOfChangeForFuelSurcharge: 0,
        surchargePercentageForAOrB:0,
        surchargeApplicableOnBaseRate: null,
        surchargeApplicableOnExtraKM: null,
        surchargeApplicableOnExtraHR: null
      });
      this.advanceTableForm.patchValue({surchargeFormula : null});
      this.advanceTableForm.get('percentageOfChangeForFuelSurcharge')?.disable();
      this.advanceTableForm.get('surchargePercentageForAOrB')?.disable();
      this.advanceTableForm.get('surchargeApplicableOnBaseRate')?.disable();
      this.advanceTableForm.get('surchargeApplicableOnExtraKM')?.disable();
      this.advanceTableForm.get('surchargeApplicableOnExtraHR')?.disable();
    }
    else
    {
      this.advanceTableForm.get('percentageOfChangeForFuelSurcharge')?.enable();
      this.advanceTableForm.get('surchargePercentageForAOrB')?.enable();
      this.advanceTableForm.get('surchargeApplicableOnBaseRate')?.enable();
      this.advanceTableForm.get('surchargeApplicableOnExtraKM')?.enable();
      this.advanceTableForm.get('surchargeApplicableOnExtraHR')?.enable();
    }
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

  InitCreatedBy(){
    this._generalService.GetEmployee().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
        this.advanceTableForm.controls['createdBy'].setValidators([Validators.required,
          this.createdByValidator(this.EmployeeList)
        ]);
        this.advanceTableForm.controls['createdBy'].updateValueAndValidity();
        this.filteredCreatedOptions = this.advanceTableForm.controls['createdBy'].valueChanges.pipe(
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
    return this.EmployeeList.filter(
      data => 
      {
        //return customer.firstName.toLowerCase().includes(filterValue);
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  };
  OnCreateBySelect(selectedCreatedBy: string)
  {
    const CreatedByName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedCreatedBy
    );
    if (selectedCreatedBy) 
    {
      this.getCreatedID(CreatedByName.employeeID);
    }
  }
  getCreatedID(employeeID: any)
  {
    this.createdEmployeeID=employeeID;
  }

  InitApprovedBy(){
    this._generalService.GetEmployee().subscribe
    (
      data =>   
      {
        this.EmployeesList = data; 
        this.advanceTableForm.controls['approvedBy'].setValidators([Validators.required,
          this.approvedByValidator(this.EmployeesList)
        ]);
        this.advanceTableForm.controls['approvedBy'].updateValueAndValidity();
        this.filteredApprovedOptions = this.advanceTableForm.controls['approvedBy'].valueChanges.pipe(
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
    return this.EmployeesList.filter(
      data => 
      {
        //return customer.firstName.toLowerCase().includes(filterValue);
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  };
  OnApprovedBySelect(selectedApprovedBy: string)
  {
    const ApprovedByName = this.EmployeesList.find(
      data => `${data.firstName} ${data.lastName}` === selectedApprovedBy
    );
    if (selectedApprovedBy) 
    {
      this.getApprovedID(ApprovedByName.employeeID);
    }
  }
  getApprovedID(employeeID: any) 
  {
    this.approvedEmployeeID=employeeID;
  }

  InitCurrencies() {
    this._generalService.GetCurrency().subscribe(
      data =>
      {
         ;
        this.CurrencyList = data;
        this.filteredOptions = this.advanceTableForm.controls['billingCurrency'].valueChanges.pipe(
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
    // if (!value || value.length < 3) {
    //   return [];   
    // }
     return this.CurrencyList.filter(
       customer => 
       {
         return customer.currencyName.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };
   getTierID(currencyID: any) {
     this.currencyID=currencyID;
   }

  InitModeOfPayment(){
    this._generalService.GetModeOfPayment().subscribe
    (
      data =>   
      {
        this.ModeOfPaymentList = data; 
        this.advanceTableForm.controls['modeOfPayment'].setValidators([Validators.required,
          this.modeOfPaymentValidator(this.ModeOfPaymentList)
        ]);
        this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
        this.filteredModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterMode(value || ''))
        );
       
      }
    );
  }
private _filterMode(value: string): any {
     const filterValue = value.toLowerCase();
     return this.ModeOfPaymentList.filter(
       customer => 
       {
         return customer.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
       }
     );
     
   };
   getModeID(modeOfPaymentID: any) {
     this.modeOfPaymentID=modeOfPaymentID;
   }

  InitBranch(){
    this._generalService.GetOrganizationalBranch().subscribe(
      data=>{
        this.OrganizationalEntityList=data;
        this.advanceTableForm.controls['branch'].setValidators([Validators.required,
          this.branchValidator(this.OrganizationalEntityList)
        ]);
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
    return this.OrganizationalEntityList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      });
  };
  OnBranchSelect(selectedBranch: string)
  {
    const BranchName = this.OrganizationalEntityList.find(
      data => data.organizationalEntityName === selectedBranch
    );
    if (selectedBranch) 
    {
      this.getBranchID(BranchName.organizationalEntityID);
    }
  }
  getBranchID(organizationalEntityID: any) 
  {
    this.organizationalEntityID=organizationalEntityID;
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
      customerContractID: [this.advanceTable.customerContractID],
      customerContractName: [this.advanceTable.customerContractName],
      customerContractValidFrom: [this.advanceTable.customerContractValidFrom,[Validators.required, this._generalService.dateValidator()]],
      customerContractValidTo: [this.advanceTable.customerContractValidTo,[Validators.required, this._generalService.dateValidator()]],
      copiedFromID: [this.advanceTable.copiedFromID],
      copiedFrom: [this.advanceTable.copiedFrom],
      contractCreatedByID: [this.advanceTable.contractCreatedByID],
      contractApprovedByID: [this.advanceTable.contractApprovedByID],
      //currencyForBillingID: [this.advanceTable.currencyForBillingID],
      //currencyRateFixedorFloating: [this.advanceTable.currencyRateFixedorFloating],
      //fixedRateOfExchange: [this.advanceTable.fixedRateOfExchange],
      gstOnParking: [this.advanceTable.gstOnParking],
      modeOfPaymentID: [this.advanceTable.modeOfPaymentID],
      billingCycle: [this.advanceTable.billingCycle],
      petrolPriceOnContract: [this.advanceTable.petrolPriceOnContract],
      dieselPriceOnContract: [this.advanceTable.dieselPriceOnContract],
      surchargeFormula: [this.advanceTable.surchargeFormula || null],
      percentageOfChangeForFuelSurcharge: [this.advanceTable.percentageOfChangeForFuelSurcharge],
      surchargePercentageForAOrB: [this.advanceTable.surchargePercentageForAOrB],
      surchargeApplicableOnBaseRate: [this.advanceTable.surchargeApplicableOnBaseRate],
      surchargeApplicableOnExtraKM: [this.advanceTable.surchargeApplicableOnExtraKM],
      surchargeApplicableOnExtraHR: [this.advanceTable.surchargeApplicableOnExtraHR],
      //tdsChargedOn: [this.advanceTable.tdsChargedOn],
      //tdsPercentage: [this.advanceTable.tdsPercentage],
      branchID: [this.advanceTable.branchID],
      createdBy:[this.advanceTable.createdBy],
      approvedBy:[this.advanceTable.approvedBy],
      modeOfPayment:[this.advanceTable.modeOfPayment],
     branch:[this.advanceTable.branch],
     billingCurrency:[this.advanceTable.branch],
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
      this.advanceTableForm.get('customerContractValidFrom')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('customerContractValidFrom')?.setErrors({ invalidDate: true });
    }
  }
                 
  onBlurValidFromEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.customerContractValidFrom=formattedDate
      }
      else
      {
        this.advanceTableForm.get('customerContractValidFrom')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('customerContractValidFrom')?.setErrors({ invalidDate: true });
    }
  }
                 
  //valid to
  onBlurValidTo(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('customerContractValidTo')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('customerContractValidTo')?.setErrors({ invalidDate: true });
    }
  }
                
    onBlurValidToEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.customerContractValidTo=formattedDate
      }
      else
      {
        this.advanceTableForm.get('customerContractValidTo')?.setValue(formattedDate);
      }    
    } else {
          this.advanceTableForm.get('customerContractValidTo')?.setErrors({ invalidDate: true });
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
  public Post(): void
  {
    // debugger
    this.advanceTableForm.patchValue({contractCreatedByID:this.createdEmployeeID});
    this.advanceTableForm.patchValue({contractApprovedByID:this.approvedEmployeeID});
    //this.advanceTableForm.patchValue({currencyForBillingID:this.currencyID});
    this.advanceTableForm.patchValue({modeOfPaymentID:this.modeOfPaymentID});
    this.advanceTableForm.patchValue({branchID:this.organizationalEntityID});
    let requestObject = this.advanceTableForm.getRawValue();
    requestObject.percentageOfChangeForFuelSurcharge = requestObject.percentageOfChangeForFuelSurcharge || 0;
    requestObject.surchargePercentageForAOrB = requestObject.surchargePercentageForAOrB || 0;
    requestObject.petrolPriceOnContract = requestObject.petrolPriceOnContract || 0;
    requestObject.dieselPriceOnContract = requestObject.dieselPriceOnContract || 0;
    requestObject.surchargeApplicableOnBaseRate = requestObject.surchargeApplicableOnBaseRate || false;
    requestObject.surchargeApplicableOnExtraKM = requestObject.surchargeApplicableOnExtraKM || false;
    requestObject.surchargeApplicableOnExtraHR = requestObject.surchargeApplicableOnExtraHR || false;
    this.advanceTableService.add(requestObject)  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerContractCreate:CustomerContractView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerContractAll:CustomerContractView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({contractCreatedByID:this.createdEmployeeID || this.advanceTable.contractCreatedByID});
    this.advanceTableForm.patchValue({contractApprovedByID:this.approvedEmployeeID || this.advanceTable.contractApprovedByID});
    //this.advanceTableForm.patchValue({currencyForBillingID:this.currencyID || this.advanceTable.currencyForBillingID});
    this.advanceTableForm.patchValue({modeOfPaymentID:this.modeOfPaymentID || this.advanceTable.modeOfPaymentID});
    this.advanceTableForm.patchValue({branchID:this.organizationalEntityID || this.advanceTable.branchID});
    let requestObject = this.advanceTableForm.getRawValue();
    requestObject.percentageOfChangeForFuelSurcharge = requestObject.percentageOfChangeForFuelSurcharge || 0;
    requestObject.surchargePercentageForAOrB = requestObject.surchargePercentageForAOrB || 0;
    requestObject.petrolPriceOnContract = requestObject.petrolPriceOnContract || 0;
    requestObject.dieselPriceOnContract = requestObject.dieselPriceOnContract || 0;
    requestObject.surchargeApplicableOnBaseRate = requestObject.surchargeApplicableOnBaseRate || false;
    requestObject.surchargeApplicableOnExtraKM = requestObject.surchargeApplicableOnExtraKM || false;
    requestObject.surchargeApplicableOnExtraHR = requestObject.surchargeApplicableOnExtraHR || false;
    this.advanceTableService.update(requestObject)  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerContractUpdate:CustomerContractView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerContractAll:CustomerContractView:Failure');//To Send Updates 
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

  createdByValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(group => (group.firstName + ' ' + group.lastName).toLowerCase() === value);
      return match ? null : { invalidSelection: true };
    };
  }

  approvedByValidator(EmployeesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeesList.some(group => (group.firstName + ' ' + group.lastName).toLowerCase() === value);
      return match ? null : { invalidApprovedBySelection: true };
    };
  }

  branchValidator(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { invalidBranchSelection: true };
    };
  }

  modeOfPaymentValidator(ModeOfPaymentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ModeOfPaymentList.some(group => group.modeOfPayment.toLowerCase() === value);
      return match ? null : { invalidModeOfPaymentSelection: true };
    };
  }

}



