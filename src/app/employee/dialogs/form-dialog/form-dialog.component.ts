// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { EmployeeService } from '../../employee.service';
import { FormControl, Validators, FormGroup, FormBuilder, RequiredValidator, AbstractControl} from '@angular/forms';
import { Employee } from '../../employee.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown, LocationDropDown } from '../../employeeDropDown.model';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentHolder } from 'src/app/organizationalEntityStakeHolders/dialogs/form-dialog/form-dialog.component';
import { SupplierDropDown } from 'src/app/organizationalEntity/supplierDropDown.model';
//import { ConfirmPasswordValidator } from './confirm-password.validator';
import { RoleDropDown } from 'src/app/role/roleDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import {  ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import moment from 'moment';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import {
  displayEmployeeDropdownValue,
  employeeMatchesDropdownInput,
  filterEmployeesForAutocomplete,
  findEmployeeByDropdownInput,
  formatEmployeeDropdownLabel,
  isEmployeeDropdownSelection,
  isEmployeeExited,
} from 'src/app/shared/employee-dropdown-display.util';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  isEmployeeExited = isEmployeeExited;
  displayEmployeeFn = (value: EmployeeDropDown | string | null) => displayEmployeeDropdownValue(value);

  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Employee;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
  employeeID:number;
  responseEmployeeId: any;
  public formGroup: FormGroup;

  public isButtonVisible = false;
  public SupplierList?: SupplierDropDown[] = [];
  public RoleList?: RoleDropDown[] = [];
  public EmployeesList?: EmployeeDropDown[] = [];
  filteredEmployeesOptions: Observable<EmployeeDropDown[]>;
  searchEmployees: FormControl = new FormControl();
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  searchSupplier: FormControl = new FormControl();
  searchRole: FormControl = new FormControl();
  filteredRoleOptions: Observable<RoleDropDown[]>;
  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  filteredCountryCodesOptions: Observable<CountryCodeDropDown[]>;
  public CountryCodeList?: CountryCodeDropDown[] = [];
  searchEmployee: FormControl = new FormControl();
    filteredCompanyOptions: Observable<OrganizationalEntityDropDown[]>;
     public CompanyList?: OrganizationalEntityDropDown[] = [];

  public LocationList?: LocationDropDown[] = [];
  filteredLocationOptions: Observable<LocationDropDown []>;
  organizationalEntityID:number;
  emailDuplicateMessage: string;
  isDuplicate: boolean;

  image: any;
  last: any;
  fileUploadEl: any;
  value: string;
  lastSaved: any;
  reportingManagerID: any;
  supplierID: any;
  form: FormGroup = new FormGroup({});
  roleID: any;

  referenceID: number;
  type: string="Employee";
  public showPassword: boolean;
  public showConfirmPassword: boolean;
  saveDisabled: boolean = true;
  employeeAttachedToLocationID: any;
  
  constructor(
    public dialog: MatDialog,
  private router:Router,
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: EmployeeService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
 if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Employee';
          this.dialogTitle ='Employee';    
          this.advanceTable = data.advanceTable;
  //          const rm = this.EmployeesList.find(e => e.employeeID === this.advanceTable.reportingManagerID);
  // if (rm) {
  //   const fullValue = `${rm.firstName} ${rm.lastName} ${rm.employeeOfficeID}`;
  //   this.advanceTableForm.patchValue({ reportingManager: fullValue });
  // }
          this.searchSupplier.setValue(this.advanceTable.supplierName);
          this.referenceID=this.advanceTable?.employeeID;
          this.searchRole.setValue(this.advanceTable.role);
          this.searchEmployee.setValue(this.advanceTable.reportingManager);
           this.advanceTableForm?.patchValue({
    employmentStatus: this.advanceTable.employmentStatus || 'Active',
    dateOfLeaving: this.advanceTable.dateOfLeaving
      ? new Date(this.advanceTable.dateOfLeaving)
      : null
  });

          this.loadPassword();
          if (this.advanceTable.mobile) {
            const mobileParts = this.advanceTable.mobile.split('-');
            const countryCodes = '+'+''+mobileParts[0];
            this.advanceTable.countryCodes=countryCodes;
            const mobile1 = mobileParts[1];
            this.advanceTable.mobile=mobile1;
             if (this.advanceTable.dateOfLeaving) {
               const dateOfLeaving = moment(this.advanceTable.dateOfLeaving).format('DD/MM/YYYY');
               if (moment(dateOfLeaving, 'DD/MM/YYYY', true).isValid()) {
                 this.onBlurUpdatedateOfLeavingEdit(dateOfLeaving);
               }
             }
        }
      }
 else 
        {
          //this.dialogTitle = 'Create Employee';
          this.dialogTitle = 'Employee';
          this.advanceTable = new Employee({});
          this.advanceTableForm = this.createContactForm();
          this.advanceTable.activationStatus=true;
          this.advanceTable.vpn=true;
          this.advanceTable.employeeOf = 'Eco';
        }
        this.advanceTableForm = this.createContactForm();
        this.lastSaved=data.lastid;

  }

  public ngOnInit(): void
  {
    this.InitSupplier();
    this.initRole();
    this.InitEmployee();
    this.InitCountryISDCodes();
    this.InitLocation();
    // this._generalService.GetSupplier().subscribe
    // (
    //   data =>   
    //   {
    //     this.SupplierList = data;
      
    //   }
    // );
    // this._generalService.GetReportingManager().subscribe
    // (
    //   data =>   
    //   {
    //     this.EmployeesList = data;
    //   }
    // );

this.syncDateOfLeavingForEmploymentStatus(this.advanceTableForm.get('employmentStatus')!.value);

    this.advanceTableForm.get('employmentStatus')!.valueChanges.subscribe((status) => {
      this.syncDateOfLeavingForEmploymentStatus(status);
    });

  // VPN & Reason logic
  const vpnCtrl = this.advanceTableForm.get('vpn');
  const reasonCtrl = this.advanceTableForm.get('reason');

  const setReasonState = (vpnValue: boolean) => {
    if (vpnValue === false) {
      reasonCtrl?.enable();
      reasonCtrl?.setValidators([Validators.required]);
    } else {
      reasonCtrl?.reset();
      reasonCtrl?.clearValidators();
      reasonCtrl?.disable();
    }
    reasonCtrl?.updateValueAndValidity();
  };

  // ✅ EDIT MODE initial VPN check
  setReasonState(vpnCtrl?.value);

  // ✅ VPN change listener (runtime)
  vpnCtrl?.valueChanges.subscribe(vpn => setReasonState(vpn));


//  // ✅ EDIT MODE initial VPN check (YAHAN)
//   if (this.advanceTableForm.get('vpn')?.value === false) {
//     const reasonCtrl = this.advanceTableForm.get('reason');
//     reasonCtrl.enable();
//     reasonCtrl.setValidators([Validators.required]);
//     reasonCtrl.updateValueAndValidity();
//   }

  // // ✅ VPN change listener (already correct)
  // this.advanceTableForm.get('vpn')!.valueChanges.subscribe(vpn => {
  //   const reasonCtrl = this.advanceTableForm.get('reason');

  //   if (vpn === false) {
  //     reasonCtrl.enable();
  //     reasonCtrl.setValidators([Validators.required]);
  //   } else {
  //     reasonCtrl.reset();
  //     reasonCtrl.clearValidators();
  //     reasonCtrl.disable();
  //   }

  //   reasonCtrl.updateValueAndValidity();
  // });

   
  }

  InitCountryISDCodes(){
    this._generalService.GetCountryCodes().subscribe
    (
      data=>{
        this.CountryCodeList=data;
        this.advanceTableForm.controls['countryCodes'].setValidators([this.countryValidator(this.CountryCodeList)
        ]);
        this.advanceTableForm.controls['countryCodes'].updateValueAndValidity();

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

  countryValidator(CountryCodeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = CountryCodeList.some(group => group.countryISDCode.toLowerCase() === value);
      return match ? null : { countryCodesTypeInvalid: true };
    };
  }

  onCountryCode(event: any): void {
    // Set the form control value to the selected country's ISD code
   
    this.advanceTableForm?.patchValue({ countryCodes: event.option.value });
   
  }

  markAsTouched(controlName: string) {
    this.advanceTableForm?.controls[controlName].markAsTouched();
  }

  public loadPassword() {
    this.advanceTableService.getPassword(this.referenceID, this.type).subscribe(
      (data: any) => {
        var pass = data.password;
        this.advanceTableForm?.patchValue({ password: pass });
        this.advanceTableForm?.patchValue({ confirmPassword: pass });
      },
      (error: HttpErrorResponse) => {
        // Handle error, for example:
        console.error('Failed to load password:', error.message);
      }
    );
  }
  
  // passwordsMatchValidator(control: AbstractControl, formGroup:FormGroup) {
  //   const password = formGroup.get('password')?.value;
  //   const confirmPassword = formGroup.get('confirmPassword')?.value;
  //   return password === confirmPassword ? null : { passwordsNotMatch: true };
  // }

  InitSupplier(){
    this._generalService.GetSupplier().subscribe(
      data=>
      {
        this.SupplierList=data;
        this.advanceTableForm.controls['supplierName'].setValidators([Validators.required,
          this.supplierTypeValidator(this.SupplierList)
        ]);
        this.advanceTableForm.controls['supplierName'].updateValueAndValidity();

        this.filteredSupplierOptions = this.advanceTableForm.controls['supplierName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchSupplier(value || ''))
        ); 
      });
  }

  private _filtersearchSupplier(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.SupplierList.filter(
      customer => 
      {
        return customer.supplierName.toLowerCase().includes(filterValue);
      });
  }
  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getsupplierID(SupplierName.supplierID);
    }
  }
  getsupplierID(supplierID: any) 
  {
    this.supplierID=supplierID;
  }

 supplierTypeValidator(SupplierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierList.some(group => group.supplierName.toLowerCase() === value);
      return match ? null : { supplierNameInvalid: true };
    };
  }

  initRole(){
    this._generalService.GetRole().subscribe(
      data=>
      {
        this.RoleList=data;
        this.advanceTableForm.controls['role'].setValidators([Validators.required,
          this.roleTypeValidator(this.RoleList)
        ]);
        this.advanceTableForm.controls['role'].updateValueAndValidity();

        this.filteredRoleOptions = this.advanceTableForm.controls['role'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchRole(value || ''))
        ); 
      });
  }

  private _filtersearchRole(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.RoleList.filter(
      customer => 
      {
        return customer.role.toLowerCase().includes(filterValue);
      });
  }
  OnRoleSelect(selectedRole: string)
  {
    const RoleName = this.RoleList.find(
      data => data.role === selectedRole
    );
    if (selectedRole) 
    {
      this.getRoleID(RoleName.roleID);
    }
  }
  getRoleID(roleID: any) 
  {
    this.roleID=roleID;
    this.advanceTableForm?.patchValue({roleID:this.roleID})
  }

  roleTypeValidator(RoleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = RoleList.some(group => group.role.toLowerCase() === value);
      return match ? null : { roleTypeInvalid: true };
    };
  }

  private syncDateOfLeavingForEmploymentStatus(status: string): void {
    const dateControl = this.advanceTableForm.get('dateOfLeaving');
    if (!dateControl) {
      return;
    }

    if (status === 'Exited') {
      dateControl.enable({ emitEvent: false });
      dateControl.setValidators([Validators.required]);
      if (dateControl.hasError('invalidDate') && !dateControl.value) {
        dateControl.setErrors(null);
      }
    } else {
      dateControl.clearValidators();
      dateControl.setErrors(null);
      dateControl.setValue(null, { emitEvent: false });
      dateControl.disable({ emitEvent: false });
    }
    dateControl.updateValueAndValidity({ emitEvent: false });
    this.advanceTableForm.updateValueAndValidity({ emitEvent: false });
  }

  isSelectedReportingManagerExited(): boolean {
    const value = this.advanceTableForm?.get('reportingManager')?.value;
    const emp = findEmployeeByDropdownInput(value, this.EmployeesList || []);
    return emp ? isEmployeeExited(emp) : false;
  }

  InitEmployee(){
    this._generalService.GetReportingManager().subscribe(
      data=>
      {
        this.EmployeesList=data;
        this.advanceTableForm.controls['reportingManager'].setValidators([Validators.required,
          this.reportingManagerValidator(this.EmployeesList)
        ]);
        this.advanceTableForm.controls['reportingManager'].updateValueAndValidity();

        this.filteredEmployeeOptions = this.advanceTableForm.controls['reportingManager'].valueChanges.pipe(
          startWith(this.advanceTableForm.controls['reportingManager'].value ?? ''),
          map((value) => {
            const term =
              typeof value === 'string'
                ? value
                : isEmployeeDropdownSelection(value)
                  ? formatEmployeeDropdownLabel(value)
                  : '';
            return filterEmployeesForAutocomplete(this.EmployeesList || [], term);
          })
        );
        if (this.action === 'edit' && this.advanceTable) {
          const rm = this.EmployeesList.find(e => e.employeeID === this.advanceTable.reportingManagerID);
          if (rm) {
            this.advanceTableForm.patchValue(
              { reportingManager: rm, reportingManagerID: rm.employeeID },
              { emitEvent: false }
            );
            this.reportingManagerID = rm.employeeID;
          } else if (this.advanceTable.reportingManagerID) {
            this.patchReportingManagerForEdit(this.advanceTable.reportingManagerID);
          }
        }
      });


  }

  private patchReportingManagerForEdit(reportingManagerID: number): void {
    this._generalService.getEmployeeID(reportingManagerID).subscribe(
      (data) => {
        const employee = Array.isArray(data) ? data[0] : data;
        if (!employee) {
          return;
        }
        this.EmployeesList = [employee, ...(this.EmployeesList || [])];
        this.advanceTableForm.patchValue(
          { reportingManager: employee, reportingManagerID: reportingManagerID },
          { emitEvent: false }
        );
        this.reportingManagerID = reportingManagerID;
        this.advanceTableForm.controls['reportingManager'].setValidators([
          Validators.required,
          this.reportingManagerValidator(this.EmployeesList),
        ]);
        this.advanceTableForm.controls['reportingManager'].updateValueAndValidity({ emitEvent: false });
      },
      () => { /* keep string from row if lookup fails */ }
    );
  }

  OnReportingManagerSelect(selectedReportingManager: EmployeeDropDown)
  {
    if (!isEmployeeDropdownSelection(selectedReportingManager)) {
      return;
    }
    this.advanceTableForm.patchValue(
      { reportingManager: selectedReportingManager, reportingManagerID: selectedReportingManager.employeeID },
      { emitEvent: false }
    );
    this.getTitles(selectedReportingManager.employeeID);
  }
  getTitles(reportingManagerID: any)
  {
    this.reportingManagerID=reportingManagerID;
  }
  reportingManagerValidator(EmployeesList: EmployeeDropDown[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const rmId =
        control.parent?.get('reportingManagerID')?.value ?? this.reportingManagerID ?? null;

      if (isEmployeeDropdownSelection(value)) {
        const id = value.employeeID;
        if (id != null && Number(id) > 0) {
          return null;
        }
        return { reportingManagerInvalid: true };
      }
      if (value == null || typeof value !== 'string' || !value.trim()) {
        if (rmId != null && Number(rmId) > 0) {
          return null;
        }
        return { reportingManagerInvalid: true };
      }
      const match = (EmployeesList || []).some((employee) => employeeMatchesDropdownInput(employee, value));
      if (match) {
        return null;
      }
      if (rmId != null && Number(rmId) > 0) {
        return null;
      }
      return { reportingManagerInvalid: true };
    };
  }

  private buildSavePayload(): Record<string, unknown> {
    const raw = { ...this.advanceTableForm.getRawValue() };
    const rmValue = raw['reportingManager'];
    const reportingManager =
      findEmployeeByDropdownInput(rmValue as EmployeeDropDown | string, this.EmployeesList || []) ||
      (isEmployeeDropdownSelection(rmValue) ? (rmValue as EmployeeDropDown) : null);
    if (reportingManager) {
      raw['reportingManagerID'] = reportingManager.employeeID;
      raw['reportingManager'] = formatEmployeeDropdownLabel(reportingManager);
      this.reportingManagerID = reportingManager.employeeID;
    } else if (this.reportingManagerID) {
      raw['reportingManagerID'] = this.reportingManagerID;
    }
    return raw;
  }
  
  // //-------- Location ---------
  // InitLocation(){
  //   this._generalService.GetLocation().subscribe(
  //     data=>
  //     {
  //       this.LocationList=data;
  //       this.filteredLocationOptions = this.advanceTableForm.controls['employeeAttachedToLocation'].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterLocation(value || ''))
  //       ); 
  //     });
  // }

    InitLocation(){
    this._generalService.GetLocation().subscribe(
      data=>
      {
        this.LocationList=data;
        this.advanceTableForm.controls['employeeAttachedToLocation'].setValidators([Validators.required,
          this.locationTypeValidator(this.LocationList)
        ]);
        this.advanceTableForm.controls['employeeAttachedToLocation'].updateValueAndValidity();
        this.filteredLocationOptions = this.advanceTableForm.controls['employeeAttachedToLocation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        ); 
      });
  }
  
  private _filterLocation(value: string): any {
    const filterValue = value.toLowerCase();
     if (!value || value.length < 3)
     {
        return [];   
      }
    return this.LocationList.filter(
      data => 
      {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  // getLocationID(employeeAttachedToLocationID: any) {
  //   this.employeeAttachedToLocationID=employeeAttachedToLocationID;
  // }

   OnLocationSelect(selectedLocation: string)
  {
    const LocationName = this.LocationList.find(
      data => data.organizationalEntityName === selectedLocation
    );
    if (selectedLocation) 
    {
      this.getLocationID(LocationName.organizationalEntityID);
    }
  }
 getLocationID(employeeAttachedToLocationID: any) {
    this.employeeAttachedToLocationID=employeeAttachedToLocationID;
  }
  locationTypeValidator(LocationList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = LocationList.some(group => group.organizationalEntityName?.toLowerCase() === value);
      return match ? null : { locationTypeInvalid: true };
    };
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
  
  organizationalEntityStakeHoldersCall() {
   this.dialog.open(FormDialogComponentHolder,
      {

        data:
        {
          advanceTable: this.advanceTable,
          action: 'add',
          lastid: this.responseEmployeeId.employeeID,
          employeeRecord: this.responseEmployeeId
         
        }
      });
     this.dialogRef.close();
  }

  onEmailChange(): void {
    this.checkDuplicateEmail();
  }

  onMobileChange(): void {
    this.checkDuplicateMobile();
  }

//-------- Check Duplicate Email & Mobile -----------------
checkDuplicateMobile() {
  const mobile = this.advanceTableForm.get('mobile').value;

  if (mobile) {
    this._generalService.DuplicateMobile(mobile).subscribe(response => {
      if (response.isDuplicate) 
      {
        this.advanceTableForm.get('mobile').setErrors({ duplicate: true });
      }
      else 
      {
        if (this.advanceTableForm.get('mobile').hasError('duplicate')) 
        {
          this.advanceTableForm.get('mobile').setErrors(null);
        }
      }
    });
  }
}

// checkDuplicateEmail() {
//   const email = this.advanceTableForm.get('email').value;

//   if (email) {
//     this._generalService.DuplicateEmail(email).subscribe(response => {
//       if (response.isDuplicate) 
//       {
//         this.advanceTableForm.get('email').setErrors({ duplicate: true });
//       }
//       else 
//       {
//         if (this.advanceTableForm.get('email').hasError('duplicate')) 
//         {
//           this.advanceTableForm.get('email').setErrors(null);
//         }
//       }
//     });
//   }
// }

// checkDuplicateMobile() {
//   const mobile = this.advanceTableForm.get('mobile').value;

//   // Only check duplicates for new employee
//   if (mobile && this.action === 'add') {
//     this._generalService.DuplicateMobile(mobile).subscribe(response => {
//       if (response.isDuplicate) {
//         this.advanceTableForm.get('mobile').setErrors({ duplicate: true });
//       } else {
//         if (this.advanceTableForm.get('mobile').hasError('duplicate')) {
//           this.advanceTableForm.get('mobile').setErrors(null);
//         }
//       }
//     });
//   } else {
//     // If editing, remove duplicate error
//     if (this.advanceTableForm.get('mobile').hasError('duplicate')) {
//       this.advanceTableForm.get('mobile').setErrors(null);
//     }
//   }
// }
checkDuplicateEmail() {
  const email = this.advanceTableForm.get('email').value;

  // Only check duplicates for new employee
  if (email && this.action === 'add') {
    this._generalService.DuplicateEmail(email).subscribe(response => {
      if (response.isDuplicate) {
        this.advanceTableForm.get('email').setErrors({ duplicate: true });
      } else {
        if (this.advanceTableForm.get('email').hasError('duplicate')) {
          this.advanceTableForm.get('email').setErrors(null);
        }
      }
    });
  } else {
    // If editing, remove duplicate error
    if (this.advanceTableForm.get('email').hasError('duplicate')) {
      this.advanceTableForm.get('email').setErrors(null);
    }
  }
}


  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      employeeID: [this.advanceTable.employeeID],
      firstName: [this.advanceTable.firstName],
      lastName: [this.advanceTable.lastName],
      gender: [this.advanceTable.gender],
      reportingManagerID: [this.advanceTable.reportingManagerID],
      mobile: [this.advanceTable.mobile],
  email: [
  this.advanceTable.email,
  [Validators.required, Validators.email]
],
      employeeOf: [this.advanceTable.employeeOf],
      supplierID: [this.advanceTable.supplierID],
      roleID: [this.advanceTable.roleID],
       oldRenNetID: [
  (this.advanceTable.oldRenNetID && this.advanceTable.oldRenNetID !== 0) ? this.advanceTable.oldRenNetID : null,
  [Validators.pattern('^[0-9]+$')]
],
      employeeOfficeID: [this.advanceTable.employeeOfficeID],
      // loginName: [this.advanceTable.loginName],
      // employmentType: [this.advanceTable.employmentType],
     employeeAttachedToLocationID: [this.advanceTable.employeeAttachedToLocationID],
     employeeAttachedToLocation: [this.advanceTable.employeeAttachedToLocation],
      reportingManager:[this.advanceTable.reportingManager],
      role:[this.advanceTable.role],
      supplierName:[this.advanceTable.supplierName],
    employmentStatus: [
  this.advanceTable.employmentStatus || 'Active',
  Validators.required
],
dateOfLeaving: [
  {
    value: this.advanceTable.dateOfLeaving
      ? new Date(this.advanceTable.dateOfLeaving)
      : null,
    disabled: this.advanceTable.employmentStatus !== 'Exited'
  }
],

      //dateOfLeaving: [this.advanceTable.dateOfLeaving],
      activationStatus: [this.advanceTable.activationStatus],
      // password: [this.advanceTable?.password],
      // confirmPassword: [this.advanceTable?.confirmPassword],
      // organizationalEntityID: [this.advanceTable?.organizationalEntityID],
      // organizationalEntityName: [this.advanceTable?.organizationalEntityName],
      packageAmount: [this.advanceTable?.packageAmount],
      vpn: [this.advanceTable?.vpn],
      reason: [this.advanceTable?.reason],
//  vpn: [this.advanceTable?.vpn ?? true],
// reason: [
//   {
//     value: this.advanceTable?.reason ?? null,
//     disabled: this.advanceTable?.vpn !== false
//   }
// ],


      showAllLocation: [this.advanceTable?.showAllLocation],
      countryCodes:['+91'],
    },
    // {
    //   validator: ConfirmPasswordValidator("password", "confirmPassword")
    // }
  );
  }

  get f() { return this.formGroup?.controls; }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    const phone1 = this.advanceTableForm.get('countryCodes').value;
    const phone2 = this.advanceTableForm.get('mobile').value;
    const countryCodes = phone1.split('+')[1];
    const mobile =countryCodes+'-'+phone2
    this.advanceTableForm?.patchValue({mobile:mobile});
    this.advanceTableForm?.patchValue({supplierID:this.supplierID})
    this.advanceTableForm?.patchValue({organizationalEntityID:this.organizationalEntityID})
    this.advanceTableForm?.patchValue({employeeAttachedToLocationID:this.employeeAttachedToLocationID})
     const payload = {
  ...this.buildSavePayload(),
  dateOfLeaving: this.advanceTableForm.get('dateOfLeaving')?.value || null,
  oldRenNetID: this.getOldRentNetID()
  
};
    this.advanceTableService.add(payload)  
    .subscribe(
    response => 
    {
      this.responseEmployeeId = response;
      this.isButtonVisible=true;
        this.dialogRef.close();
       
       this._generalService.sendUpdate('EmployeeCreate:EmployeeView:Success');//To Send Updates  
       this.saveDisabled = true;
  },
    error =>
    {
       const mobile =this.advanceTableForm?.get('mobile').value.split('-')[1];
       this.advanceTableForm?.patchValue({ mobile: mobile});
       this._generalService.sendUpdate('EmployeeAll:EmployeeView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    const phone1 = this.advanceTableForm?.get('countryCodes').value;
    const phone2 = this.advanceTableForm?.get('mobile').value;
    const countryCodes = phone1.split('+')[1];
    const mobile =countryCodes+'-'+phone2
    this.advanceTableForm?.patchValue({mobile:mobile});
    this.advanceTableForm?.patchValue({supplierID:this.supplierID || this.advanceTable.supplierID});
    this.advanceTableForm?.patchValue({employeeAttachedToLocationID:this.employeeAttachedToLocationID || this.advanceTable.employeeAttachedToLocationID})
       const payload = {
  ...this.buildSavePayload(),
    dateOfLeaving: this.advanceTableForm.get('dateOfLeaving')?.value || null,
  oldRenNetID: this.getOldRentNetID()
};
    this.advanceTableService.update(payload)  
    .subscribe(
    response => 
    {
     
      this.isButtonVisible=true;
      this.dialogRef.close();    
       this._generalService.sendUpdate('EmployeeUpdate:EmployeeView:Success');//To Send Updates  
       this.saveDisabled = true;
    },
    error =>
    {
      const mobile =this.advanceTableForm?.get('mobile').value.split('-')[1];
      this.advanceTableForm?.patchValue({ mobile: mobile});
     this._generalService.sendUpdate('EmployeeAll:EmployeeView:Failure');//To Send Updates  
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
  // OnEmployeeChangeGetcurrencies()
  // {
  //   this._generalService.GetCurrencies(this.advanceTableForm.get("nativeCurrencyID").value).subscribe(
  //     data =>
  //      {
  //       this.CurrencyList = data;
  //      },
  //      error =>
  //      {
  //      }
  //   );
  // }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm?.patchValue({image:this.ImagePath})
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
keyPressAlphaNumeric(event) {

  var inp = String.fromCharCode(event.keyCode);

  if (/[a-zA-Z]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

//start date
 onBlurdateOfLeaving(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('dateOfLeaving')?.setValue(formattedDate);    
} else {
  if(value===""){
  this.advanceTableForm.controls['dateOfLeaving'].setValue('');
  }
  else{
    this.advanceTableForm?.get('dateOfLeaving')?.setErrors({ invalidDate: true });
  }
  
}
}

onBlurUpdatedateOfLeavingEdit(value: string): void {
  if (!value || !String(value).trim()) {
    return;
  }
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    if (this.action === 'edit') {
      this.advanceTable.dateOfLeaving = formattedDate;
    } else {
      this.advanceTableForm.get('dateOfLeaving')?.setValue(formattedDate);
    }
    this.advanceTableForm.get('dateOfLeaving')?.setErrors(null);
    this.advanceTableForm.get('dateOfLeaving')?.updateValueAndValidity({ emitEvent: false });
  } else {
    this.advanceTableForm?.get('dateOfLeaving')?.setErrors({ invalidDate: true });
  }
}

 companyNameValidator(CompanyList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CompanyList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { companyNameInvalid: true };
    };
  }
  private getOldRentNetID(): number {
  const value = this.advanceTableForm.get('oldRenNetID')?.value;

  // Blank / null / undefined / '' → 0
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  return Number(value);
}
onBlurUpdateDate(value: string): void {
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    this.advanceTableForm.get('dateOfLeaving')
      ?.setValue(moment(value, 'DD/MM/YYYY').toDate());
  } else {
    this.advanceTableForm.get('dateOfLeaving')?.setValue(null);
  }
}




}





