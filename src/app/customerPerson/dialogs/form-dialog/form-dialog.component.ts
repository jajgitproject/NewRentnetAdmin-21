// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonService } from '../../customerPerson.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import { CustomerPerson } from '../../customerPerson.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerPersonDropDown } from '../../customerPersonDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { SalutationDropDown } from 'src/app/salutation/salutationDropDown.model';
import { CustomerDesignationDropDown } from 'src/app/customerDesignation/customerDesignationDropDown.model';
import { CustomerDepartmentDropDown } from 'src/app/customerDepartment/customerDepartmentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
import { Router } from '@angular/router';
import { CustomerDepartment } from 'src/app/customerDepartment/customerDepartment.model';
import { CustomerDesignation } from 'src/app/customerDesignation/customerDesignation.model';
//import { FormDialogComponentCustomerDepartment } from 'src/app/customerDepartment/dialogs/form-dialog/form-dialog.component';
//import { FormDialogComponentCustomerDesignation } from 'src/app/customerDesignation/dialogs/form-dialog/form-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormDialogComponentCustomerDepartment } from 'src/app/customerDepartment/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponentCustomerDesignation } from 'src/app/customerDesignation/dialogs/form-dialog/form-dialog.component';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentCustomerPerson 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerPerson;
  advanceTableCustomerDepartment: CustomerDepartment | null;
  advanceTableCustomerDesignation: CustomerDesignation | null;
  public isSaving: boolean = false; 
  saveDisabled:boolean=true;
  public SalutationList?: SalutationDropDown[] = [];
  filteredSalutationOptions: Observable<SalutationDropDown[]>;

  public CustomerList?: any[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;

  salutation: FormControl = new FormControl();
  public CountryCodeList?: CountryCodeDropDown[] = [];
  filteredCountryCodeOptions: Observable<CountryCodeDropDown[]>;
  filteredCountryCodesOptions: Observable<CountryCodeDropDown[]>;
  filteredMobileCodeOptions: Observable<CountryCodeDropDown[]>;
  public CustomerDesignationList?: CustomerDesignationDropDown[] = [];
  filteredDesignationOptions: Observable<CustomerDesignationDropDown[]>;
  searchDesignationBy: FormControl = new FormControl();
  public CustomerDepartmentList?: CustomerDepartmentDropDown[] = [];
  filteredDepartmentOptions: Observable<CustomerDepartmentDropDown[]>;
  searchDepartmentBy: FormControl = new FormControl();

  image: any;
  fileUploadEl: any;
  CustomerGroupName: any;
  salutationID: any;
  customerDesignationID: any;
  customerDepartmentID: any;
  customerID: any;
  CustomerGroupID: any;
  someAction: any;
  public formGroup: FormGroup;

  referenceID: number;
  type: string="CustomerPerson";
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  PrimaryMobile: any;

  private sanitizeNullableText(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    const text = String(value).trim();
    return text.toLowerCase() === 'null' ? '' : text;
  }

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentCustomerPerson>, 
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerPersonService,
    private fb: FormBuilder,
    private el: ElementRef,
    public router:Router,
  public _generalService:GeneralService)
  {
        // Set the defaults
        
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.CustomerGroupID=data.CustomerGroupID;
          this.CustomerGroupName=data.CustomerGroupName;
          this.PrimaryMobile=data.PrimaryMobile;
          this.dialogTitle ='Customer Person for';       
          this.advanceTable = data.advanceTable;

          // Fallback for list APIs that send phone instead of primaryMobile
          if (!this.advanceTable.primaryMobile && data?.advanceTable?.phone) {
            this.advanceTable.primaryMobile = data.advanceTable.phone;
          }

          this.advanceTable.primaryMobile = this.sanitizeNullableText(this.advanceTable.primaryMobile);
          this.advanceTable.secondaryMobile1 = this.sanitizeNullableText(this.advanceTable.secondaryMobile1);
          this.advanceTable.secondaryMobile2 = this.sanitizeNullableText(this.advanceTable.secondaryMobile2);

           this.advanceTableForm = this.createContactForm();
      
          this.referenceID=this.advanceTable.customerPersonID;
          this.loadPassword();
          this.salutation.setValue(this.advanceTable.salutation)
          this.searchDesignationBy.setValue(this.advanceTable.customerDesignation)
          // this.CustomerGroupID=data.CustomerGroupID;
          // this.CustomerGroupName=data.CustomerGroupName;
          this.advanceTableForm.controls['primaryMobile'].setValue(this.advanceTable.primaryMobile);
          if (this.advanceTable.primaryMobile) {
            const mobileParts = this.advanceTable.primaryMobile.split('-');
            if (mobileParts.length > 1) {
              const countryCode = '+' + '' + mobileParts[0];
              this.advanceTable.countryCode = countryCode;
              const primaryMobile = mobileParts.slice(1).join('-');
              this.advanceTable.primaryMobile = primaryMobile;
            } else {
              this.advanceTable.countryCode = '+91';
              this.advanceTable.primaryMobile = this.advanceTable.primaryMobile;
            }
        }
        if (this.advanceTable.secondaryMobile1) {
          const mobileParts = this.advanceTable.secondaryMobile1.split('-');
          if (mobileParts.length > 1) {
            const countryCodes = '+' + '' + mobileParts[0];
            this.advanceTable.countryCodes = countryCodes;
            const secondaryMobile1 = mobileParts.slice(1).join('-');
            this.advanceTable.secondaryMobile1 = secondaryMobile1;
          }
      }
      if (this.advanceTable.secondaryMobile2) {
        const mobileParts = this.advanceTable.secondaryMobile2.split('-');
        if (mobileParts.length > 1) {
          const mobileCode = '+' + '' + mobileParts[0];
          this.advanceTable.mobileCode = mobileCode;
          const secondaryMobile2 = mobileParts.slice(1).join('-');
          this.advanceTable.secondaryMobile2 = secondaryMobile2;
        }
    }

        } 
        else if (this.action === 'add')
        {
          this.dialogTitle = 'Customer Person for';
          this.advanceTable = new CustomerPerson({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.maskMobileNumber=false;
          this.advanceTable.sendSMSWhatsApp=true;
          this.advanceTable.preferAppBasedDriver=true;
          if(data.forCP==='CP')
          {
            this.customerID=data.advanceTable.customerID;
            this.advanceTable.customerName=data.advanceTable.customerName;
           
            this.advanceTable.customerGroupID=data.advanceTable.customerGroupID;
            
            this.CustomerGroupName=data.advanceTable.customerGroup;
             this.advanceTableForm = this.createContactForm();
            //this.advanceTable.customerGroupID=data.CustomerGroupID;
            //this.advanceTableForm.controls["customerName"].disable();
          }
         
        }
        
        this.advanceTableForm = this.createContactForm();
        this.someAction=data.forCP
        if(this.someAction==='CP')
        {
          this.CustomerGroupID=data.advanceTable.customerGroupID;
          this.CustomerGroupName=data.advanceTable.customerGroup;
        }
        if(!data.advanceTable)
        {
          this.CustomerGroupID=data.CustomerGroupID;
          this.CustomerGroupName=data.CustomerGroupName;
        }
  }
  public ngOnInit(): void
  {
    if(this.someAction==='CP')
    {
      this.advanceTableForm.controls["customerName"].disable();
    }
    this.InitCustomer();
    this.InitSalutation();
    this.InitCustomerDesignation();
    this.InitCustomerDepartment();
    this.InitCountryISDCode();
    this.InitCountryISDCodes();
    this.InitCountryMobileCode();
  }

  public loadPassword() {
    this.advanceTableService.getPassword(this.referenceID, this.type).subscribe(
      (data: any) => {
        const pass = data.password;
       
        this.advanceTableForm.patchValue({ password: pass });
        this.advanceTableForm.patchValue({ confirmPassword: pass });
      },
      (error: HttpErrorResponse) => {
        // Handle error, for example:
        console.error('Failed to load password:', error.message);
      }
    );
  }
  
  InitCustomer(){
    this._generalService.GetCustomersForCP(this.data.CustomerGroupID).subscribe
    (
      data=>{
        this.CustomerList=data;
        this.advanceTableForm.controls['customerName'].setValidators([Validators.required,
          this.customerValidator(this.CustomerList)
        ]);
        this.advanceTableForm.controls['customerName'].updateValueAndValidity();
      
        this.filteredCustomerOptions = this.advanceTableForm.controls["customerName"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        ); 
      }
    );
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CustomerList?.filter(
      data => 
      {
        return data.customerName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnCustomerSelect(selectedCustomer: string)
  {
    const CustomerName = this.CustomerList.find(
      data => data.customerName === selectedCustomer
    );
    if (selectedCustomer) 
    {
      this.getCustomerID(CustomerName.customerID);
    }
  }  
  getCustomerID(customerID: any) 
  {
    this.customerID=customerID;
  }

  customerValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList?.some(group => group.customerName.toLowerCase() === value);
      return match ? null : { customerInvalid: true };
    };
  }

  salutationValidator(SalutationList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SalutationList.some(group => group.salutation.toLowerCase() === value);
      return match ? null : { salutationInvalid: true };
    };
  }

  InitSalutation(){
    this._generalService.GetSalutations().subscribe
    (
      data=>{
        this.SalutationList=data;
        this.advanceTableForm.controls['salutation'].setValidators([Validators.required,
          this.salutationValidator(this.SalutationList)
        ]);
        this.advanceTableForm.controls['salutation'].updateValueAndValidity();
        this.filteredSalutationOptions = this.salutation.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSalutation(value || ''))
        ); 
      }
    );
  }
  private _filterSalutation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.SalutationList.filter(
      data => 
      {
        return data.salutation.toLowerCase().includes(filterValue);
      });
  }
  OnSalutationSelect(selectedSalutation: string)
  {
    const SalutationName = this.SalutationList.find(
      data => data.salutation === selectedSalutation
    );
    if (selectedSalutation) 
    {
      this.getTitles(SalutationName.salutationID);
    }
  }
  getTitles(salutationID: any) {
    this.salutationID=salutationID;
  }

  // InitCountryISDCode(){
  //   this._generalService.GetCountryCode().subscribe
  //   (
  //     data=>{
  //       this.CountryCodeList=data;
  //     }
  //   );
  // }

  InitCountryISDCode(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.filteredCountryCodeOptions = this.advanceTableForm.controls['countryCode'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountryCode(value || ''))
        ); 
      }
    );
  }
  private _filterCountryCode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => 
      {
        return customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitCountryISDCodes(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.filteredCountryCodesOptions = this.advanceTableForm.controls['countryCodes'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountryCodes(value || ''))
        ); 
      }
    );
  }
  private _filterCountryCodes(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => 
      {
        return customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  InitCountryMobileCode(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.filteredMobileCodeOptions = this.advanceTableForm.controls['mobileCode'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCountryMobileCode(value || ''))
        ); 
      }
    );
  }
  private _filterCountryMobileCode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CountryCodeList.filter(
      customer => 
      {
        return customer.icon.toLowerCase().indexOf(filterValue)===0 || customer.countryISOCode.toLowerCase().indexOf(filterValue)===0 || customer.countryISDCode.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  onCountryCodeSelected(event: any): void {
    // Set the form control value to the selected country's ISD code
    this.advanceTableForm.patchValue({ countryCode: event.option.value });
    
  }
  onCountryCode(event: any): void {
    // Set the form control value to the selected country's ISD code
   
    this.advanceTableForm.patchValue({ countryCodes: event.option.value });
   
  }

  onCountryCodeMobile(event: any): void {
    // Set the form control value to the selected country's ISD code
   
    this.advanceTableForm.patchValue({ mobileCode: event.option.value });
  }
  InitCustomerDesignation(){
    this._generalService.GetCustomerDesignationBasedOnCG(this.CustomerGroupID).subscribe
    (
      data=>{
        this.CustomerDesignationList=data;
        this.filteredDesignationOptions = this.advanceTableForm.controls['customerDesignation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtercustomerDesignation(value || ''))
        ); 
      }
    );
  }

  private _filtercustomerDesignation(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3)
    //  {
    //     return [];   
    //   }
    return this.CustomerDesignationList?.filter(
      data => 
      {
        return data.customerDesignation.toLowerCase().includes(filterValue);
      }
    );
  }
  OncustomerDesignationSelect(selectedCustomer: string)
  {
    const customerDesignation = this.CustomerDesignationList.find(
      data => data.customerDesignation === selectedCustomer
    );
    if (customerDesignation) 
    {
      this.getDesignation(customerDesignation.customerDesignationID);
    }
  }  
  getDesignation(customerDesignationID: any) 
  {
    this.customerDesignationID=customerDesignationID;
    this.advanceTableForm.patchValue({customerDesignationID:this.customerDesignationID});
  }
  onImportanceChange(event: any): void {
    // Reset the values of the controls when Importance is changed
    this.advanceTableForm.controls['customerDesignationID'].setValue(0);
    this.advanceTableForm.controls['customerDesignation'].setValue('');
  }
  
  InitCustomerDepartment(){
    this._generalService.GetCustomerDepartmentBasedOnCG(this.CustomerGroupID).subscribe
    (
      data=>{
        this.CustomerDepartmentList=data;
       
      }
    );
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
  markAsTouched(controlName: string) {
    this.advanceTableForm.controls[controlName].markAsTouched();
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerPersonID: [this.advanceTable?.customerPersonID],
      customerGroupID: [this.advanceTable.customerGroupID],
      customerID: [this.advanceTable.customerID],
     oldRentNetID: [
  (this.advanceTable.oldRentNetID && this.advanceTable.oldRentNetID !== 0) ? this.advanceTable.oldRentNetID : null,
  [Validators.pattern('^[0-9]+$')]
],
      confirmPassword:[this.advanceTable.confirmPassword],
      password:[this.advanceTable.password],
      customerName: [this.advanceTable.customerName],
      salutationID: [this.advanceTable.salutationID],
      salutation:[this.advanceTable.salutation],
      customerPersonName: [this.advanceTable.customerPersonName],
      gender: [this.advanceTable.gender],
      importance: [this.advanceTable.importance],
      primaryEmail: [this.advanceTable.primaryEmail],
      billingEmail: [this.advanceTable.billingEmail],
      primaryMobile: [this.sanitizeNullableText(this.advanceTable.primaryMobile)],
      secondaryMobile1: [this.sanitizeNullableText(this.advanceTable.secondaryMobile1)],
      secondaryMobile2: [this.sanitizeNullableText(this.advanceTable.secondaryMobile2)],
      isContactPerson: [this.advanceTable.isContactPerson],
      isBooker: [this.advanceTable.isBooker],
      isPassenger: [this.advanceTable.isPassenger],
      isAdmin: [this.advanceTable.isAdmin],
      maskMobileNumber: [this.advanceTable.maskMobileNumber],
      sendSMSWhatsApp: [this.advanceTable.sendSMSWhatsApp],
      sendEmail: [this.advanceTable.sendEmail],
      employeeCode: [this.advanceTable.employeeCode],
      customerDesignationID: [this.advanceTable.customerDesignationID],
      customerDesignation: [this.advanceTable.customerDesignation],
      customerDepartmentID: [this.advanceTable.customerDepartmentID],
      preferAppBasedDriver: [this.advanceTable.preferAppBasedDriver],
      activationStatus: [this.advanceTable.activationStatus],
      loyalGuest: [this.advanceTable.loyalGuest],
      isDefaultForIntegrationRequest:[this.advanceTable.isDefaultForIntegrationRequest],
      allowLoginToCDP: [this.advanceTable.allowLoginToCDP],
      allowLoginToCustomerApp: [this.advanceTable.allowLoginToCustomerApp],
      countryCode:['+91'],
      countryCodes:['+91'],
      mobileCode:['+91',],
    },
      {
        validator: ConfirmPasswordValidator("password", "confirmPassword")
      }
      );
    
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
    this.dialogRef.close();
    this.ImagePath="";
  }
  // public Post(): void
  // {
  //   const phone1 = this.advanceTableForm.get('countryCode').value;
  //   const phone2 = this.advanceTableForm.get('primaryMobile').value;
  //   const countryCode = phone1.split('+')[1];
  //   const primaryMobile =countryCode+'-'+phone2

  //   const phone3 = this.advanceTableForm.get('countryCodes').value;
  //   const phone4 = this.advanceTableForm.get('secondaryMobile1').value;
  //   const countryCodes = phone3.split('+')[1];
  //   const secondaryMobile1 =countryCodes+'-'+phone4

  //   const phone5 = this.advanceTableForm.get('mobileCode').value;
  //   const phone6 = this.advanceTableForm.get('secondaryMobile2').value;
  //   const mobileCode = phone5.split('+')[1];
  //   const secondaryMobile2 =mobileCode+'-'+phone6

  //   this.advanceTableForm.patchValue({primaryMobile:primaryMobile});
  //   this.advanceTableForm.patchValue({secondaryMobile1:secondaryMobile1});
  //   this.advanceTableForm.patchValue({secondaryMobile2:secondaryMobile2});
  //   this.advanceTableForm.patchValue({customerGroupID:this.CustomerGroupID});
  //   this.advanceTableForm.patchValue({salutationID:this.salutationID});
  //   this.advanceTableForm.patchValue({customerID:this.customerID});
  //   if( this.someAction === 'CP')
  //     {
  //       this.advanceTableForm.patchValue({isContactPerson:false});
  //       this.advanceTableForm.patchValue({isBooker:false});
  //       this.advanceTableForm.patchValue({isPassenger:true});
  //       this.advanceTableForm.patchValue({isAdmin:false});
  //       this.advanceTableForm.patchValue({maskMobileNumber:false});
  //       this.advanceTableForm.patchValue({sendSMSWhatsApp:false});
  //       this.advanceTableForm.patchValue({sendEmail:false});
  //       this.advanceTableForm.patchValue({preferAppBasedDriver:false});
  //       this.advanceTableForm.patchValue({loyalGuest:false});
  //       this.advanceTableForm.patchValue({password:null});
  //       this.advanceTableForm.patchValue({confirmPassword:null});
  //       this.advanceTableForm.patchValue({isDefaultForIntegrationRequest:false});
  //   }

  //   this.advanceTableService.add(this.advanceTableForm.getRawValue())  
  //   .subscribe(
  //   response => 
  //   {
  //       if(response.status === "Failure") {
  //         this.showNotification(
  //           'snackbar-danger',
  //           response.message,
  //           'bottom',
  //           'center'
  //         );
  //         this.saveDisabled = true;
  //         this.isSaving = false;
  //         return;
  //       }
  //       this.dialogRef.close();
  //       // this._generalService.sendUpdate('CustomerPersonCreate:CustomerPersonView:Success');//To Send Updates  
  //       // this.saveDisabled = true;
  //       if(this.someAction==='CP')
  //       {
  //         this.saveDisabled = true;
  //         this.showNotification(
  //           'snackbar-success',
  //           'Customer Person Created...!!!',
  //           'bottom',
  //           'center'
  //         );
  //       }
  //       //  else(this.someAction==='Failure.Duplicate Name and Mobile No Found')
  //       // {
  //       //   this.saveDisabled = true;
  //       //   this.showNotification(
  //       //     'snackbar-success',
  //       //     'Customer Person Created...!!!',
  //       //     'bottom',
  //       //     'center'
  //       //   );
  //       // }
  //   },
  //   error =>
  //   {
  //     if (error.error && error.error.isDuplicate) {
  //       // Show duplicate error in snackbar
  //       this.showNotification(
  //         'snackbar-warning',
  //         error.error.message || 'Duplicate record found',
  //         'bottom',
  //         'center'
  //       );
  //     } else if(this.someAction==='CP')
  //     {
  //       this.saveDisabled = true;
  //       this.showNotification(
  //         'snackbar-danger',
  //         'Operation Failed.....!!!',
  //         'bottom',
  //         'center'
  //       );
  //     }
  //     this._generalService.sendUpdate('CustomerPersonAll:CustomerPersonView:Failure');//To Send Updates  
  //     this.saveDisabled = true;
  //   }
  // )
  // }

public Post(): void {
  // Helper function to format phone numbers with country code safely
  const formatPhone = (countryCodeControl: string, phoneControl: string): string => {
    const codeValue = this.advanceTableForm.get(countryCodeControl)?.value || '';
    let phoneValue = this.advanceTableForm.get(phoneControl)?.value || '';

    // Avoid double formatting if already in "code-number" format
    if (phoneValue && /^\d{1,4}-/.test(phoneValue)) {
      return phoneValue; // Already formatted
    }

    const code = codeValue.includes('+') ? codeValue.split('+')[1] : codeValue;
    return code && phoneValue ? `${code}-${phoneValue}` : phoneValue;
  };

  // Patch formatted phone numbers only if needed
  this.advanceTableForm.patchValue({
    primaryMobile: formatPhone('countryCode', 'primaryMobile'),
    secondaryMobile1: formatPhone('countryCodes', 'secondaryMobile1'),
    secondaryMobile2: formatPhone('mobileCode', 'secondaryMobile2'),
    customerGroupID: this.CustomerGroupID,
    salutationID: this.salutationID,
    customerID: this.customerID
  });

  // If action is CP, set default flags
  if (this.someAction === 'CP') {
    this.advanceTableForm.patchValue({
      isContactPerson: false,
      isBooker: false,
      isPassenger: true,
      isAdmin: false,
      maskMobileNumber: false,
      sendSMSWhatsApp: false,
      sendEmail: false,
      preferAppBasedDriver: false,
      loyalGuest: false,
      password: null,
      confirmPassword: null,
      isDefaultForIntegrationRequest: false
    });
  }

  // Stop if form is invalid
  if (this.advanceTableForm.invalid) {
    this.showNotification('snackbar-warning', 'Please fill all required fields', 'bottom', 'center');
    return;
  }

  // Call service
  const payload = {
  ...this.advanceTableForm.getRawValue(),
  oldRentNetID: this.getOldRentNetID()
};
  this.advanceTableService.add(payload).subscribe({
    next: (response) => {

      if (response.status === 'Failure') {
        this.showNotification('snackbar-danger', response.message, 'bottom', 'center');
        this.saveDisabled = true;
        this.isSaving = false;
        return;
      }

      this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonUpdate:CustomerPersonView:Success');//To Send Updates  
         {
          this.saveDisabled = true;
            this.showNotification(
              'snackbar-success',
              'Customer Person Created Successfully',
              'bottom',
              'center'
            );
        }
    },
    //   if (this.someAction === 'CP') {
    //     this.saveDisabled = true;
    //     this.showNotification('snackbar-success', 'Customer Person Created...!!!', 'bottom', 'center');
    //   }
    // },
    error: (error) => {
      if (error.error?.isDuplicate) {
        this.showNotification('snackbar-warning', error.error.message || 'Duplicate record found', 'bottom', 'center');
      } else if (this.someAction === 'CP') {
        this.saveDisabled = true;
        this.showNotification('snackbar-danger', 'Operation Failed.....!!!', 'bottom', 'center');
      }

      this._generalService.sendUpdate('CustomerPersonAll:CustomerPersonView:Failure');
      this.saveDisabled = true;
    }
  });
}

  public Put(): void
  {
   
    this.advanceTableForm.patchValue({customerGroupID:this.advanceTable.customerGroupID});
    this.advanceTableForm.patchValue({salutationID:this.salutationID || this.advanceTable.salutationID});
    this.advanceTableForm.patchValue({customerID:this.customerID || this.advanceTable.customerID}); 
    const phone1 = this.advanceTableForm.get('countryCode').value;
    const phone2 = this.advanceTableForm.get('primaryMobile').value;
    const countryCode = phone1.split('+')[1];
    const primaryMobile =countryCode+'-'+phone2

    const phone3 = this.advanceTableForm.get('countryCodes').value;
    const phone4 = this.advanceTableForm.get('secondaryMobile1').value;
    const countryCodes = phone3.split('+')[1];
    const secondaryMobile1 =countryCodes+'-'+phone4

    const phone5 = this.advanceTableForm.get('mobileCode').value;
    const phone6 = this.advanceTableForm.get('secondaryMobile2').value;
    const mobileCode = phone5.split('+')[1];
    const secondaryMobile2 =mobileCode+'-'+phone6

    this.advanceTableForm.patchValue({primaryMobile:primaryMobile});
    this.advanceTableForm.patchValue({secondaryMobile1:secondaryMobile1});
    this.advanceTableForm.patchValue({secondaryMobile2:secondaryMobile2});
     const payload = {
  ...this.advanceTableForm.getRawValue(),
  oldRentNetID: this.getOldRentNetID()
};
    this.advanceTableService.update(payload)  
    .subscribe(
    response => 
    {
      debugger;
         if (response.status === 'Failure') {
        this.showNotification('snackbar-danger', response.message, 'bottom', 'center');
        this.saveDisabled = true;
        this.isSaving = false;
        return;
      }
        this.dialogRef.close(true);
        // if(response.status === "Failure") {
        //   this.showNotification(
        //     'snackbar-danger',
        //     response.message,
        //     'bottom',
        //     'center'
        //   );
        // }
        this._generalService.sendUpdate('CustomerPersonUpdate:CustomerPersonView:Success');//To Send Updates  
         {
          this.saveDisabled = true;
            this.showNotification(
              'snackbar-success',
              'Customer Person Updated Successfully',
              'bottom',
              'center'
            );
        }
    },
    error =>
    {
      if (error.error && error.error?.isDuplicate) {
        // Show duplicate error in snackbar
        this.showNotification('snackbar-warning', error.error.message || 'Duplicate record found', 'bottom', 'center');
      } else {
        this._generalService.sendUpdate('CustomerPersonAll:CustomerPersonView:Failure');//To Send Updates
      }
      this.saveDisabled = true; 
    }
  )
  }
  // public confirmAdd(): void 
  // {
  //      if(this.action=="edit")
  //      {
  //         this.Put();
  //      }
  //      else
  //      {
  //         this.Post();
  //      }
  // }
  public confirmAdd(): void
   {
    this.saveDisabled = false;
    if (this.isSaving) 
      {
        return; // Prevent multiple clicks if already saving
    }

    if (this.advanceTableForm.invalid) 
      {
        return; // Ensure the form is valid before proceeding
    }

    this.isSaving = true; // Disable the Save button

    if (this.action === 'edit') {
        this.Put();
    } else {
        this.Post();
    }
}

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
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

  openCustomerDepartment()
  {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerDepartment, 
      {
        height: '80%',
        width: '40%',
        data: 
          {
            advanceTable:this.advanceTableCustomerDepartment,
            action:'add',
            ForCD:'CD',
            customerGroupID: this.CustomerGroupID,
            customerGroup: this.CustomerGroupName
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.InitCustomerDepartment();
    });
  }

  get f() { return this.formGroup?.controls; }
  
  openCustomerDesignation()
  {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerDesignation, 
      {
        height: '80%',
        width: '40%',
        data: 
          {
            advanceTable:this.advanceTableCustomerDesignation,
            action:'add',
            ForCD:'CD',
            CustomerGroupID: this.CustomerGroupID,
            CustomerGroupName: this.CustomerGroupName
          }
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        this.InitCustomerDesignation();
    });
  }

  onPrimaryEmailChange()
  {
    this.advanceTableForm.patchValue({billingEmail:this.advanceTableForm.value.primaryEmail});
  }
  onCustomerPersonName()
  {
   this.checkDuplicateCustomerPersonName()
  }

   onCustomerPersonEmail()
  {
   this.checkDuplicateCustomerPersonEmail()
  }

  checkDuplicateCustomerPersonName() {
  const customerPersonName = this.advanceTableForm.get('customerPersonName').value;
  let primaryMobile = this.advanceTableForm.get('primaryMobile').value;
  const customerGroupID = this.CustomerGroupID; // already available from your code

  if (customerPersonName && primaryMobile && customerGroupID) {
  
    if (!primaryMobile.startsWith('91-')) {
      primaryMobile = '91-' + primaryMobile;
    }
    this.advanceTableService
      .DuplicateCustomerPersonName(customerPersonName, primaryMobile, customerGroupID)
      .subscribe(response => {
        if (response.isDuplicate) {
          this.advanceTableForm.get('customerPersonName')?.setErrors({ duplicate: true });
          this.advanceTableForm.get('primaryMobile')?.setErrors({ duplicate: true });
        } else {
          if (this.advanceTableForm.get('customerPersonName')?.hasError('duplicate')) {
            this.advanceTableForm.get('customerPersonName')?.setErrors(null);
          }
          if (this.advanceTableForm.get('primaryMobile')?.hasError('duplicate')) {
            this.advanceTableForm.get('primaryMobile')?.setErrors(null);
          }
        }
      });
  }
}

  checkDuplicateCustomerPersonEmail() {
  const customerPersonName = this.advanceTableForm.get('customerPersonName').value;
  let primaryEmail = this.advanceTableForm.get('primaryEmail').value;
  const customerGroupID = this.CustomerGroupID; // already available from your code

  if (customerPersonName && primaryEmail && customerGroupID) {
    
    this.advanceTableService
      .duplicateCustomerPersonNameEmail(customerPersonName, primaryEmail, customerGroupID)
      .subscribe(response => {
        if (response.isDuplicate) {
          this.advanceTableForm.get('customerPersonName')?.setErrors({ duplicate: true });
          this.advanceTableForm.get('primaryEmail')?.setErrors({ duplicate: true });
        } else {
          if (this.advanceTableForm.get('customerPersonName')?.hasError('duplicate')) {
            this.advanceTableForm.get('customerPersonName')?.setErrors(null);
          }
          if (this.advanceTableForm.get('primaryEmail')?.hasError('duplicate')) {
            this.advanceTableForm.get('primaryEmail')?.setErrors(null);
          }
        }
      });
  }
}

  onCustomerPersonMobileEmail()
  {
   this.checkDuplicateCustomerPerson()
  }

checkDuplicateCustomerPerson() {
  const customerPersonName = this.advanceTableForm.get('customerPersonName').value;
  let primaryMobile = this.advanceTableForm.get('primaryMobile').value;
  const primaryEmail = this.advanceTableForm.get('primaryEmail').value;
  const customerGroupID = this.CustomerGroupID;

  if (customerPersonName && primaryMobile && primaryEmail && customerGroupID) {
    if (!primaryMobile.startsWith('91-')) {
      primaryMobile = '91-' + primaryMobile;

      this.advanceTableForm.get('primaryMobile')?.setValue(primaryMobile);
    }

    this.advanceTableService
      .duplicateCustomerPersonNameMobileEmail(customerPersonName, primaryMobile, primaryEmail, customerGroupID)
      .subscribe(response => {
        if (response.isDuplicate) {
          this.advanceTableForm.get('customerPersonName')?.setErrors({ duplicate: true });
          this.advanceTableForm.get('primaryMobile')?.setErrors({ duplicate: true });
          this.advanceTableForm.get('primaryEmail')?.setErrors({ duplicate: true });
        } else {
          ['customerPersonName', 'primaryMobile', 'primaryEmail'].forEach(field => {
            if (this.advanceTableForm.get(field)?.hasError('duplicate')) {
              this.advanceTableForm.get(field)?.setErrors(null);
            }
          });
        }
      });
  }
}
private getOldRentNetID(): number {
  const value = this.advanceTableForm.get('oldRentNetID')?.value;

  // Blank / null / undefined / '' → 0
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  return Number(value);
}

}


