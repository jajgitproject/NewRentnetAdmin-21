// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ChangeCollectionExecutiveForCustomersService } from '../../changeCollectionExecutiveForCustomers.service';
import { Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ChangeCollectionExecutiveForCustomers } from '../../changeCollectionExecutiveForCustomers.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { startWith, map } from 'rxjs/operators';
import moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-change-collection-executive-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponentHolder implements OnInit {
  employeeID: number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList: EmployeeDropDown[] = [];
  filteredOldCollectionExecutiveOptions: Observable<EmployeeDropDown[]> = of([]);
  filteredNewCollectionExecutiveOptions: Observable<EmployeeDropDown[]> = of([]);
  advanceTable: ChangeCollectionExecutiveForCustomers;
  saveDisabled: boolean = true;
  oldCollectionExecutiveID: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: ChangeCollectionExecutiveForCustomersService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Change Collection Executive For Customers';
      this.advanceTable = data.advanceTable;
      const startDate = moment(this.advanceTable.newCollectionExecutiveActivationFromDate).format('DD/MM/yyyy');
      this.onBlurFromDateEdit(startDate);
    } else {
      this.dialogTitle = 'Change Collection Executive For Customers';
      this.advanceTable = new ChangeCollectionExecutiveForCustomers({});
      this.advanceTable.newCollectionExecutiveActivationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit(): void {
    this.setupEmployeeAutocomplete('oldCustomerCollectionExecutiveEmployee', 'filteredOldCollectionExecutiveOptions');
    this.setupEmployeeAutocomplete('newCustomerCollectionExecutiveEmployee', 'filteredNewCollectionExecutiveOptions');
    this.loadEmployees();
  }

  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim?.() ?? control.value;
      if (!value) {
        return null;
      }
      const match = EmployeeList.some(
        (employee) => `${employee.firstName} ${employee.lastName}`.toLowerCase() === String(value).toLowerCase()
      );
      return match ? null : { employeeNameInvalid: true };
    };
  }

  private setupEmployeeAutocomplete(controlName: string, observableKey: string): void {
    const control = this.advanceTableForm.controls[controlName];
    this[observableKey] = control.valueChanges.pipe(
      startWith(control.value || ''),
      map((value) => this._filterEmployee(value || ''))
    );
  }

  private loadEmployees(): void {
    this._generalService.GetEmployees().subscribe({
      next: (data) => {
        this.EmployeeList = data || [];
        const validators = [Validators.required, this.employeeNameValidator(this.EmployeeList)];

        const oldControl = this.advanceTableForm.controls['oldCustomerCollectionExecutiveEmployee'];
        const newControl = this.advanceTableForm.controls['newCustomerCollectionExecutiveEmployee'];

        oldControl.setValidators(validators);
        newControl.setValidators(validators);
        oldControl.updateValueAndValidity({ emitEvent: true });
        newControl.updateValueAndValidity({ emitEvent: true });
      },
      error: () => {
        this.EmployeeList = [];
      }
    });
  }

  private _filterEmployee(value: string): EmployeeDropDown[] {
    const filterValue = String(value).toLowerCase();
    return (this.EmployeeList || []).filter((employee) => {
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  onOldEmployeeSelected(selectedEmployee: string): void {
    const employee = this.EmployeeList.find(
      (item) => `${item.firstName} ${item.lastName}` === selectedEmployee
    );
    if (employee) {
      this.getOldCollectionExecutiveID(employee.employeeID);
    }
  }

  onNewEmployeeSelected(selectedEmployee: string): void {
    const employee = this.EmployeeList.find(
      (item) => `${item.firstName} ${item.lastName}` === selectedEmployee
    );
    if (employee) {
      this.getNewCollectionExecutiveID(employee.employeeID);
    }
  }

  getOldCollectionExecutiveID(employeeID: any) {
    this.oldCollectionExecutiveID = employeeID;
    this.advanceTableForm.patchValue({ oldCollectionExecutiveID: this.oldCollectionExecutiveID });
  }

  getNewCollectionExecutiveID(employeeID: any) {
    this.employeeID = employeeID;
    this.advanceTableForm.patchValue({ newCollectionExecutiveID: this.employeeID });
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      customerCollectionExecutiveID: [this.advanceTable.customerCollectionExecutiveID],
      newCollectionExecutiveActivationFromDate: [this.advanceTable.newCollectionExecutiveActivationFromDate, [Validators.required, this._generalService.dateValidator()]],
      oldCustomerCollectionExecutiveEmployee: [this.advanceTable.oldCustomerCollectionExecutiveEmployee],
      newCustomerCollectionExecutiveEmployee: [this.advanceTable.newCustomerCollectionExecutiveEmployee],
      oldCollectionExecutiveID: [this.advanceTable.oldCollectionExecutiveID],
      newCollectionExecutiveID: [this.advanceTable.employeeID],
      newCollectionExecutiveActivationStatus: [this.advanceTable.newCollectionExecutiveActivationStatus]
    });
  }

  onBlurFromDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      this.advanceTableForm.get('newCollectionExecutiveActivationFromDate')?.setValue(moment(value, 'DD/MM/YYYY').toDate());
    } else {
      this.advanceTableForm.get('newCollectionExecutiveActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurFromDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.newCollectionExecutiveActivationFromDate = formattedDate;
      } else {
        this.advanceTableForm.get('newCollectionExecutiveActivationFromDate')?.setValue(formattedDate);
      }
    } else {
      this.advanceTableForm.get('newCollectionExecutiveActivationFromDate')?.setErrors({ invalidDate: true });
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
        this._generalService.sendUpdate('ChangeCollectionExecutiveForCustomersCreate:ChangeCollectionExecutiveForCustomersView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('ChangeCollectionExecutiveForCustomersAll:ChangeCollectionExecutiveForCustomersView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public confirmAdd(): void {
    Swal.fire({
      title: '',
      icon: 'warning',
      html: `<b>Do you really want to change the Collection Executive? This will reassign all customers linked to the current collection executive.</b>`,
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
