// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InvoiceSummaryService } from '../../invoiceSummary.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { InvoiceSummary } from '../../invoiceSummary.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { CustomerDropDown } from 'src/app/supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: InvoiceSummary;
  public EmployeeList?: EmployeeDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
  public StateList?: StateDropDown[] = [];
  filteredDispatchedByOptions: Observable<EmployeeDropDown[]>;
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredStateOptions: Observable<StateDropDown[]>;
  createdByDisplay: string = '';
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: InvoiceSummaryService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.advanceTable = data.advanceTable;
      this.dialogTitle = 'Invoice Summary - ' + this.advanceTable.invoiceSummaryID;
      this.createdByDisplay = this.advanceTable.createdBy || '';
    } else {
      this.dialogTitle = 'Invoice Summary';
      this.advanceTable = new InvoiceSummary({});
      this.advanceTable.summaryDispatchStatus = 'No';
      this.advanceTable.activationStatus = false;
      this.advanceTable.createdByID = this._generalService.getUserID();
      this.createdByDisplay = this.getLoggedInUserDisplayName();
    }
    this.advanceTableForm = this.createContactForm();
    this.updateDispatchValidators(this.advanceTable.summaryDispatchStatus);
  }

  public ngOnInit(): void {
    if (this.action === 'edit') {
      if (this.advanceTable.dispatchedBy) {
        this.advanceTableForm.patchValue({ dispatchedByName: this.advanceTable.dispatchedBy });
        this.EmployeeList = [{
          employeeID: this.advanceTable.dispatchedByID,
          firstName: this.advanceTable.dispatchedBy.split(' ')[0] || '',
          lastName: this.advanceTable.dispatchedBy.split(' ').slice(1).join(' ') || ''
        }];
      }
      if (this.advanceTable.customerID && this.advanceTable.customer) {
        this.CustomerList = [{
          customerID: this.advanceTable.customerID,
          customerName: this.advanceTable.customer
        }];
        this.advanceTableForm.patchValue({ customerName: this.advanceTable.customer });
        this.advanceTableForm.controls['customerName'].setValidators([
          Validators.required,
          this.customerValidator(this.CustomerList)
        ]);
        this.advanceTableForm.controls['customerName'].updateValueAndValidity();
      }
      if (this.advanceTable.stateID && this.advanceTable.state) {
        this.StateList = [{
          geoPointID: this.advanceTable.stateID,
          geoPointName: this.advanceTable.state
        }];
        this.advanceTableForm.patchValue({ stateName: this.advanceTable.state });
        this.advanceTableForm.controls['stateName'].setValidators([
          Validators.required,
          this.stateValidator(this.StateList)
        ]);
        this.advanceTableForm.controls['stateName'].updateValueAndValidity();
      }
    }

    this.filteredDispatchedByOptions = this.advanceTableForm.controls['dispatchedByName'].valueChanges.pipe(
      startWith(this.advanceTableForm.controls['dispatchedByName'].value || ''),
      map((value) => this._filterEmployees(value || ''))
    );
    this.filteredCustomerOptions = this.advanceTableForm.controls['customerName'].valueChanges.pipe(
      startWith(this.advanceTableForm.controls['customerName'].value || ''),
      map((value) => this._filterCustomers(value || ''))
    );
    this.filteredStateOptions = this.advanceTableForm.controls['stateName'].valueChanges.pipe(
      startWith(this.advanceTableForm.controls['stateName'].value || ''),
      map((value) => this._filterStates(value || ''))
    );
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      invoiceSummaryID: [this.advanceTable.invoiceSummaryID],
      customerID: [this.advanceTable.customerID, Validators.required],
      customerName: [this.advanceTable.customerName || this.advanceTable.customer, Validators.required],
      stateID: [this.advanceTable.stateID, Validators.required],
      stateName: [this.advanceTable.stateName || this.advanceTable.state, Validators.required],
      billSubmittedTo: [this.advanceTable.billSubmittedTo, [Validators.required, this.noWhitespaceValidator]],
      contactNumber: [this.advanceTable.contactNumber],
      remark: [this.advanceTable.remark],
      invoiceSummaryDate: [this.advanceTable.invoiceSummaryDate, Validators.required],
      summaryDispatchStatus: [this.advanceTable.summaryDispatchStatus || 'No', Validators.required],
      dispatchedByID: [this.advanceTable.dispatchedByID],
      dispatchedByName: [this.advanceTable.dispatchedByName || ''],
      dispatchDate: [this.advanceTable.dispatchDate],
      acknowledgement: [this.advanceTable.acknowledgement],
      activationStatus: [this.advanceTable.activationStatus === true, Validators.required],
      createdByID: [this.advanceTable.createdByID]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = ((control && control.value && control.value.toString()) || '').trim().length === 0;
    return !isWhitespace ? null : { whitespace: true };
  }

  customerValidator(customerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { customerTypeInvalid: true };
      }
      const value = control.value.toLowerCase();
      const match = customerList.some((customer) => customer.customerName.toLowerCase() === value);
      return match ? null : { customerTypeInvalid: true };
    };
  }

  stateValidator(stateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { stateTypeInvalid: true };
      }
      const value = control.value.toLowerCase();
      const match = stateList.some((state) => state.geoPointName.toLowerCase() === value);
      return match ? null : { stateTypeInvalid: true };
    };
  }

  employeeValidator(employeesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { employeeTypeInvalid: true };
      }
      const value = control.value.toLowerCase();
      const match = employeesList.some(
        (employee) => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value
      );
      return match ? null : { employeeTypeInvalid: true };
    };
  }

  InitCustomer() {
    const prefix = this.advanceTableForm.get('customerName').value;
    if (!prefix || prefix.length < 3) {
      this.CustomerList = [];
      return;
    }
    this._generalService.getCustomerForInvoice(prefix).subscribe((data) => {
      this.CustomerList = data || [];
      this.advanceTableForm.controls['customerName'].setValidators([
        Validators.required,
        this.customerValidator(this.CustomerList)
      ]);
      this.advanceTableForm.controls['customerName'].updateValueAndValidity();
      this.filteredCustomerOptions = this.advanceTableForm.controls['customerName'].valueChanges.pipe(
        startWith(prefix || ''),
        map((value) => this._filterCustomers(value || ''))
      );
    });
  }

  InitState() {
    const prefix = this.advanceTableForm.get('stateName').value;
    if (!prefix || prefix.length < 3) {
      this.StateList = [];
      return;
    }
    this._generalService.GetStateForSearchPrefix(prefix).subscribe((data) => {
      this.StateList = data || [];
      this.advanceTableForm.controls['stateName'].setValidators([
        Validators.required,
        this.stateValidator(this.StateList)
      ]);
      this.advanceTableForm.controls['stateName'].updateValueAndValidity();
      this.filteredStateOptions = this.advanceTableForm.controls['stateName'].valueChanges.pipe(
        startWith(prefix || ''),
        map((value) => this._filterStates(value || ''))
      );
    });
  }

  private _filterCustomers(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return (this.CustomerList || []).filter((data) => data.customerName.toLowerCase().includes(filterValue));
  }

  private _filterStates(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return (this.StateList || []).filter((data) => data.geoPointName.toLowerCase().includes(filterValue));
  }

  onCustomerSelected(selectedCustomer: string) {
    const selectedValue = (this.CustomerList || []).find((data) => data.customerName === selectedCustomer);
    if (selectedValue) {
      this.advanceTableForm.patchValue({ customerID: selectedValue.customerID });
    }
  }

  onStateSelected(selectedState: string) {
    const selectedValue = (this.StateList || []).find((data) => data.geoPointName === selectedState);
    if (selectedValue) {
      this.advanceTableForm.patchValue({ stateID: selectedValue.geoPointID });
    }
  }

  onDispatchStatusChange(value: string) {
    this.updateDispatchValidators(value);
    if (value !== 'Yes') {
      this.advanceTableForm.patchValue({
        dispatchedByID: 0,
        dispatchedByName: '',
        dispatchDate: null
      });
      this.EmployeeList = [];
    }
  }

  updateDispatchValidators(dispatchStatus: string) {
    const dispatchedByControl = this.advanceTableForm.controls['dispatchedByName'];
    const dispatchDateControl = this.advanceTableForm.controls['dispatchDate'];

    if (dispatchStatus === 'Yes') {
      dispatchedByControl.setValidators([Validators.required, this.employeeValidator(this.EmployeeList || [])]);
      dispatchDateControl.setValidators([Validators.required]);
    } else {
      dispatchedByControl.clearValidators();
      dispatchDateControl.clearValidators();
    }
    dispatchedByControl.updateValueAndValidity();
    dispatchDateControl.updateValueAndValidity();
  }

  InitEmployee() {
    const prefix = this.advanceTableForm.get('dispatchedByName').value;
    if (!prefix || prefix.length < 3) {
      this.EmployeeList = [];
      return;
    }
    this._generalService.GetEmployeesForVehicleCategoryPrefix(prefix).subscribe((data) => {
      this.EmployeeList = data;
      if (this.advanceTableForm.get('summaryDispatchStatus').value === 'Yes') {
        this.advanceTableForm.controls['dispatchedByName'].setValidators([
          Validators.required,
          this.employeeValidator(this.EmployeeList)
        ]);
        this.advanceTableForm.controls['dispatchedByName'].updateValueAndValidity();
      }
      this.filteredDispatchedByOptions = this.advanceTableForm.controls['dispatchedByName'].valueChanges.pipe(
        startWith(prefix || ''),
        map((value) => this._filterEmployees(value || ''))
      );
    });
  }

  private _filterEmployees(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return (this.EmployeeList || []).filter((data) => {
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  onEmployeeSelected(selectedEmployee: string) {
    const selectedValue = (this.EmployeeList || []).find(
      (data) => `${data.firstName} ${data.lastName}` === selectedEmployee
    );
    if (selectedValue) {
      this.advanceTableForm.patchValue({ dispatchedByID: selectedValue.employeeID });
    }
  }

  getLoggedInUserDisplayName(): string {
    try {
      const rawCurrentUser = localStorage.getItem('currentUser');
      if (rawCurrentUser) {
        const parsed = JSON.parse(rawCurrentUser);
        const employee = parsed?.employee ?? parsed?.Employee;
        const firstName = employee?.FirstName ?? employee?.firstName ?? '';
        const lastName = employee?.LastName ?? employee?.lastName ?? '';
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          return fullName;
        }
      }
    } catch {
    }
    return this._generalService.getUserName() || '';
  }

  submit() {}

  reset() {
    this.advanceTableForm.reset();
    this.createdByDisplay = this.getLoggedInUserDisplayName();
    this.CustomerList = [];
    this.StateList = [];
    this.EmployeeList = [];
    this.advanceTableForm.patchValue({
      summaryDispatchStatus: 'No',
      activationStatus: false,
      createdByID: this._generalService.getUserID()
    });
    this.updateDispatchValidators('No');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public Post(): void {
    this.isLoading = true;
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.isLoading = false;
        this.dialogRef.close();
        this._generalService.sendUpdate('InvoiceSummaryCreate:InvoiceSummaryView:Success');
      },
      () => {
        this.isLoading = false;
        this._generalService.sendUpdate('InvoiceSummaryAll:InvoiceSummaryView:Failure');
      }
    );
  }

  public Put(): void {
    this.isLoading = true;
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.isLoading = false;
        this.dialogRef.close();
        this._generalService.sendUpdate('InvoiceSummaryUpdate:InvoiceSummaryView:Success');
      },
      () => {
        this.isLoading = false;
        this._generalService.sendUpdate('InvoiceSummaryAll:InvoiceSummaryView:Failure');
      }
    );
  }

  public confirmAdd(): void {
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }
}
