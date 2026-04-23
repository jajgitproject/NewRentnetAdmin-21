// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { SupplierContractService } from '../../supplierContract.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { SupplierContract } from '../../supplierContract.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { SupplierContractDropDown } from '../../supplierContractDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { ModeOfPaymentDropDown } from '../../modeOfPaymentDropDown.model';
import { PaymentCycleDropDown } from '../../paymentCycleDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
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
  advanceTable: SupplierContract;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  saveDisabled:boolean=true;
  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  public PaymentCycleList?: PaymentCycleDropDown[] = [];
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  searchCreatedBy: FormControl = new FormControl();
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();
  filteredModeOfPaymentOptionss: Observable<ModeOfPaymentDropDown[]>;
  searchModeOfPayment: FormControl = new FormControl();
  filteredPaymentCycleOptionss: Observable<PaymentCycleDropDown[]>;
  searchPaymentCycle: FormControl = new FormControl();
  image: any;
  fileUploadEl: any;
  supplierID: any;
  supplierName: any;
  supplierRateCardID: any;
  supplierRateCardName: any;
  employeeID: any;
  employeesID: any;
  modeOfPaymentID: any;
  paymentCycleID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: SupplierContractService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Supplier Contract';       
          this.advanceTable = data.advanceTable;

           let validFrom=moment(this.advanceTable.validFrom).format('DD/MM/yyyy');
           let validTo=moment(this.advanceTable.validTo).format('DD/MM/yyyy');
          this.onBlurUpdateDateValidFromEdit(validFrom);
          this.onBlurUpdateDateValidToEdit(validTo);
       
          this.advanceTable.copiedFromPreviousContractName='N/A';
        } else 
        {
          this.dialogTitle = 'Supplier Contract';
          this.advanceTable = new SupplierContract({});
          this.advanceTable.activationStatus=true;
          //this.advanceTable.supplierRateCardName=data.SUPPLIERRATECARDNAME; 
          
        }
        this.advanceTableForm = this.createContactForm();
        this.supplierRateCardID=data.SUPPLIERRATECARDID; 

  }
  public ngOnInit(): void
  {
    this.InitEmployee();
    this.InitEmployees();
    this.InitModeOfPayment();
    this.InitPaymentCycle();
  }
  formControl = new FormControl('', 
  [
    Validators.required
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
      supplierContractID: [this.advanceTable.supplierContractID],
      supplierContractName:[this.advanceTable.supplierContractName],
      supplierRateCardID: [this.advanceTable.supplierRateCardID],
      //supplierRateCardName:[this.advanceTable.supplierRateCardName],
      copiedFromPreviousContractID: [this.advanceTable.copiedFromPreviousContractID],
      copiedFromPreviousContractName:[this.advanceTable.copiedFromPreviousContractName],
      validFrom: [this.advanceTable.validFrom,[Validators.required, this._generalService.dateValidator()]],
      validTo: [this.advanceTable.validTo,[Validators.required, this._generalService.dateValidator()]],
      negotiatedByID: [this.advanceTable.negotiatedByID],
      approvedByID: [this.advanceTable.approvedByID],
      negotiatedBy: [this.advanceTable.negotiatedBy],
      approvedBy: [this.advanceTable.approvedBy],
      gstParking: [this.advanceTable.gstParking],
      modeOfPaymentID: [this.advanceTable?.modeOfPaymentID || null],
      paymentCycleID: [this.advanceTable.paymentCycleID],
      paymentCycle: [this.advanceTable.paymentCycle],
      modeOfPayment: [this.advanceTable.modeOfPayment],
      referenceNote: [this.advanceTable.referenceNote],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

    //start date
    onBlurUpdateDateValidFrom(value: string): void {
        value= this._generalService.resetDateiflessthan12(value);
      
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
          this.advanceTableForm.get('validFrom')?.setValue(formattedDate);    
      } else {
        this.advanceTableForm.get('validFrom')?.setErrors({ invalidDate: true });
      }
    }
    
    onBlurUpdateDateValidFromEdit(value: string): void {  
      const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
      if (validDate) {
        const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        if(this.action==='edit')
        {
          this.advanceTable.validFrom=formattedDate
        }
        else{
          this.advanceTableForm.get('validFrom')?.setValue(formattedDate);
        }
        
      } else {
        this.advanceTableForm.get('validFrom')?.setErrors({ invalidDate: true });
      }
    }
    
    //end date
    onBlurUpdateDateValidTo(value: string): void {
      value= this._generalService.resetDateiflessthan12(value);
    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
        this.advanceTableForm.get('validTo')?.setValue(formattedDate);    
    } else {
      this.advanceTableForm.get('validTo')?.setErrors({ invalidDate: true });
    }
    }
    
    onBlurUpdateDateValidToEdit(value: string): void {  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.validTo=formattedDate
      }
      else{
        this.advanceTableForm.get('validTo')?.setValue(formattedDate);
      }
      
    } else {
      this.advanceTableForm.get('validTo')?.setErrors({ invalidDate: true });
    }
    }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    
  }

  reset(): void 
  {
    this.advanceTableForm.reset();
  }
  onNoClick():void{
    this.dialogRef.close();
  }

  // InitEmployee(){
  //   this._generalService.GetEmployeesForSupplierContract().subscribe
  //   (
  //     data =>   
  //     {
  //       this.EmployeeList = data; 
       
  //     }
  //   );
  // }

  //----------- Employee  Validation --------------
  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
      return match ? null : { employeeNameInvalid: true };
    };
  }
  
  InitEmployee(){
    this._generalService.GetEmployeesForSupplierContract().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.advanceTableForm.controls['negotiatedBy'].setValidators([Validators.required,this.employeeNameValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['negotiatedBy'].updateValueAndValidity();
        this.filteredCreatedByOptionss = this.advanceTableForm.controls['negotiatedBy'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCreatedBy(value || ''))
        ); 
      });
  }
  
  private _filterCreatedBy(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.EmployeeList.filter(
      data => 
      {
        const fullName=`${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.toLowerCase().includes(filterValue);
      }
    );
  }

  onNegotiatedSelected(selectedNegotiated: string) {
    const negotiatedselect = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedNegotiated
    );
  
    if (selectedNegotiated) {
      this.getemployee(negotiatedselect.employeeID);
    }
  }
  
  getemployee(employeeID: any) {
    //debugger;
    this.employeeID=employeeID;
  }

  InitEmployees(){
    
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.advanceTableForm.controls['approvedBy'].setValidators([Validators.required,this.employeeNameValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['approvedBy'].updateValueAndValidity();
        this.filteredinstructedByOptionss = this.advanceTableForm.controls['approvedBy'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        ); 
      });
  }
  
  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.EmployeeList.filter(
      data => 
      {
        const fullName=`${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.toLowerCase().includes(filterValue);
      }
    );
  }
  
  onApprovedSelected(selectedApproved: string) {
    const Approvedselect = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedApproved
    );
  
    if (selectedApproved) {
      this.getemployeeIDTitles(Approvedselect.employeeID);
    }
  }
  
  getemployeeIDTitles(employeeID: any) {
    //debugger;
    this.employeesID=employeeID;
  }

  // InitModeOfPayment(){
  //   this._generalService.GetModeOfPayment().subscribe
  //   (
  //     data =>   
  //     {
  //       this.ModeOfPaymentList = data; 
       
  //     }
  //   );
  // }

  //----------- Mode Of Payment Validation --------------
  modeOfPaymentValidator(ModeOfPaymentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ModeOfPaymentList.some(employee => employee.modeOfPayment.toLowerCase() === value);
      return match ? null : { modeOfPaymentInvalid: true };
    };
  }

  InitModeOfPayment(){
    this._generalService.GetModeOfPayment().subscribe(
      data=>
      {
        this.ModeOfPaymentList=data;
        this.advanceTableForm.controls['modeOfPayment'].setValidators([Validators.required,
          this.modeOfPaymentValidator(this.ModeOfPaymentList)]);
        this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
        this.filteredModeOfPaymentOptionss = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchimodeofPayment(value || ''))
        ); 
      });
  }
  
  private _filtersearchimodeofPayment(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.ModeOfPaymentList.filter(
      customer => 
      {
        return customer.modeOfPayment.toLowerCase().includes(filterValue);
      }
    );
  }

  onModeOfPaymentSelected(selectedModeOfPayment: string) {
    const selectedModeOfPaymen = this.ModeOfPaymentList.find(
      payment => payment.modeOfPayment === selectedModeOfPayment
    );
  
    if (selectedModeOfPayment) {
      this.getmodeOfPayment(selectedModeOfPaymen.modeOfPaymentID);
    }
  }
  
  getmodeOfPayment(modeOfPaymentID: any) 
  { 
    this.modeOfPaymentID=modeOfPaymentID;
  }

  // InitPaymentCycle(){
  //   this._generalService.GetPaymentCycle().subscribe
  //   (
  //     data =>   
  //     {
  //       this.PaymentCycleList = data; 
       
  //     }
  //   );
  // }

  //----------- Payment Cycle Validation --------------
  paymentCycleValidator(PaymentCycleList?: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PaymentCycleList?.some(employee => employee.paymentCycle.toLowerCase() === value);
      return match ? null : { paymentCycleInvalid: true };
    };
  }

  InitPaymentCycle(){
    this._generalService.GetPaymentCycle().subscribe(
      data=>
      {
        this.PaymentCycleList=data;
        this.advanceTableForm.controls['paymentCycle'].setValidators([Validators.required,
          this.paymentCycleValidator(this.PaymentCycleList)]);
        this.advanceTableForm.controls['paymentCycle'].updateValueAndValidity();
        this.filteredPaymentCycleOptionss = this.advanceTableForm.controls['paymentCycle'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchPaymentCycle(value || ''))
        ); 
      });
  }
  
  private _filtersearchPaymentCycle(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
    return this.PaymentCycleList?.filter(
      customer => 
      {
        return customer.paymentCycle.toLowerCase().includes(filterValue);
      }
    );
  }

  onPaymentCycleSelected(selectedonPaymentCycle: string) {
    const selectePaymentCycle= this.PaymentCycleList?.find(
      data => data.paymentCycle === selectedonPaymentCycle
    );
  
    if (selectedonPaymentCycle) {
      this.getPaymentCycle(selectePaymentCycle.paymentCycleID);
    }
  }
  
  getPaymentCycle(paymentCycleID: any) {
    //debugger;
    this.paymentCycleID=paymentCycleID;
  }

  public Post(): void {
    this.advanceTableForm.patchValue({ supplierRateCardID: this.supplierRateCardID });
    this.advanceTableForm.patchValue({ negotiatedByID: this.employeeID });
    this.advanceTableForm.patchValue({ approvedByID: this.employeesID });
    this.advanceTableForm.patchValue({ modeOfPaymentID: this.modeOfPaymentID });
    this.advanceTableForm.patchValue({ paymentCycleID: this.paymentCycleID });

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.saveDisabled = true; // Hide spinner when request completes
          this._generalService.sendUpdate('SupplierContractCreate:SupplierContractView:Success');
          this.dialogRef.close();
        },
        error => {
          this.saveDisabled = true; // Hide spinner on error
          this._generalService.sendUpdate('SupplierContractAll:SupplierContractView:Failure');
        }
      );
  }

  public Put(): void {
    this.advanceTableForm.patchValue({ supplierRateCardID: this.advanceTable.supplierRateCardID });
    this.advanceTableForm.patchValue({ negotiatedByID: this.employeeID || this.advanceTable.negotiatedByID });
    this.advanceTableForm.patchValue({ approvedByID: this.employeesID || this.advanceTable.approvedByID });
    this.advanceTableForm.patchValue({ modeOfPaymentID: this.modeOfPaymentID || this.advanceTable.modeOfPaymentID });
    this.advanceTableForm.patchValue({ paymentCycleID: this.paymentCycleID || this.advanceTable.paymentCycleID });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.saveDisabled = true; // Hide spinner when request completes
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractUpdate:SupplierContractView:Success');
        },
        error => {
          this.saveDisabled = true; // Hide spinner on error
          this._generalService.sendUpdate('SupplierContractAll:SupplierContractView:Failure');
        }
      );
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

}



