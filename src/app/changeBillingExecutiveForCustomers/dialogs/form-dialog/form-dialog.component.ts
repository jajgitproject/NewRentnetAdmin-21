// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ChangeBillingExecutiveForCustomersService } from '../../changeBillingExecutiveForCustomers.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ChangeBillingExecutiveForCustomers } from '../../changeBillingExecutiveForCustomers.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { startWith, map } from 'rxjs/operators';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public billingExecutiveList?: EmployeeDropDown[] = [];
  filteredOldBillingExecutiveOptions: Observable<EmployeeDropDown[]>;
  filteredNewBillingExecutiveOptions: Observable<EmployeeDropDown[]>;
  advanceTable: ChangeBillingExecutiveForCustomers;
  saveDisabled: boolean = true;
  oldBillingExecutiveID: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: ChangeBillingExecutiveForCustomersService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Change Billing Executive For Customers';
      this.advanceTable = data.advanceTable;
      const startDate = moment(this.advanceTable.newBillingExecutiveActivationFromDate).format('DD/MM/yyyy');
      this.onBlurFromDateEdit(startDate);
    } else {
      this.dialogTitle = 'Change Billing Executive For Customers';
      this.advanceTable = new ChangeBillingExecutiveForCustomers({});
      this.advanceTable.newBillingExecutiveActivationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void {
    this.InitOldBillingExecutive();
    this.InitNewBillingExecutive();
  }

  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some((employee) => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
      return match ? null : { employeeNameInvalid: true };
    };
  }

  billingExecutiveNameValidator(list: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = list.some((employee) => (employee.employeeFirstName + ' ' + employee.employeeLastName).toLowerCase() === value);
      return match ? null : { customerBillingExecutiveNameInvalid: true };
    };
  }

  InitOldBillingExecutive() {
    this._generalService.GetCustomerChangesBillingExecutive().subscribe((data) => {
      this.billingExecutiveList = data;
      this.advanceTableForm.controls['oldCustomerBillingExecutiveEmployee'].setValidators([
        Validators.required,
        this.billingExecutiveNameValidator(this.billingExecutiveList)
      ]);
      this.advanceTableForm.controls['oldCustomerBillingExecutiveEmployee'].updateValueAndValidity();
      this.filteredOldBillingExecutiveOptions = this.advanceTableForm.controls['oldCustomerBillingExecutiveEmployee'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filterOldBillingExecutive(value || ''))
      );
    });
  }

  private _filterOldBillingExecutive(value: string): any {
    const filterValue = value.toLowerCase();
    return this.billingExecutiveList.filter((data) => {
      const fullName = `${data.employeeFirstName} ${data.employeeLastName}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  InitNewBillingExecutive() {
    this._generalService.GetEmployees().subscribe((data) => {
      this.EmployeeList = data;
      this.advanceTableForm.controls['newCustomerBillingExecutiveEmployee'].setValidators([
        Validators.required,
        this.employeeNameValidator(this.EmployeeList)
      ]);
      this.advanceTableForm.controls['newCustomerBillingExecutiveEmployee'].updateValueAndValidity();
      this.filteredNewBillingExecutiveOptions = this.advanceTableForm.controls['newCustomerBillingExecutiveEmployee'].valueChanges.pipe(
        startWith(''),
        map((value) => this._filterNewBillingExecutive(value || ''))
      );
    });
  }

  private _filterNewBillingExecutive(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter((data) => {
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  getOldBillingExecutiveID(employeeID: any) {
    this.oldBillingExecutiveID = employeeID;
    this.advanceTableForm.patchValue({ oldBillingExecutiveID: this.oldBillingExecutiveID });
  }

  getNewBillingExecutiveID(employeeID: any) {
    this.employeeID = employeeID;
    this.advanceTableForm.patchValue({ newBillingExecutiveID: this.employeeID });
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      customerBillingExecutiveID: [this.advanceTable.customerBillingExecutiveID],
      newBillingExecutiveActivationFromDate: [this.advanceTable.newBillingExecutiveActivationFromDate, [Validators.required, this._generalService.dateValidator()]],
      oldCustomerBillingExecutiveEmployee: [this.advanceTable.oldCustomerBillingExecutiveEmployee],
      newCustomerBillingExecutiveEmployee: [this.advanceTable.newCustomerBillingExecutiveEmployee],
      oldBillingExecutiveID: [this.advanceTable.oldBillingExecutiveID],
      newBillingExecutiveID: [this.advanceTable.employeeID],
      newBillingExecutiveActivationStatus: [this.advanceTable.newBillingExecutiveActivationStatus]
    });
  }

  onBlurFromDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      this.advanceTableForm.get('newBillingExecutiveActivationFromDate')?.setValue(moment(value, 'DD/MM/YYYY').toDate());
    } else {
      this.advanceTableForm.get('newBillingExecutiveActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurFromDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.newBillingExecutiveActivationFromDate = formattedDate;
      } else {
        this.advanceTableForm.get('newBillingExecutiveActivationFromDate')?.setValue(formattedDate);
      }
    } else {
      this.advanceTableForm.get('newBillingExecutiveActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }

  submit() {}

  onNoClick(action: string) {
    if (action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('ChangeBillingExecutiveForCustomersCreate:ChangeBillingExecutiveForCustomersView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('ChangeBillingExecutiveForCustomersAll:ChangeBillingExecutiveForCustomersView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public confirmAdd(): void {
    Swal.fire({
      title: '',
      icon: 'warning',
      html: `<b>Do you really want to change the Billing Executive? This will reassign all customers linked to the current billing executive.</b>`,
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDisabled = false;
        this.Post();
      }
    });
  }
}
