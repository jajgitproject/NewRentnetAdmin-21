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
  createdByDisplay: string = '';
  isLoading = false;
  CustomerID:any;

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
      this.advanceTable.activationStatus = true;
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
        this.CustomerID = this.advanceTable.customerID;
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
        this.loadStatesForCustomer(this.advanceTable.customerID);
        this.advanceTableForm.get('stateID')?.enable();
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

    if (!this.advanceTableForm.get('customerID').value) {
      this.advanceTableForm.get('stateID')?.disable();
    }

    this.advanceTableForm.get('customerName')?.valueChanges.subscribe((customerValue) => {
      if (!customerValue || customerValue.trim() === '') {
        this.CustomerID = null;
        this.StateList = [];
        this.advanceTableForm.patchValue({
          customerID: null,
          stateID: 0,
          stateName: ''
        });
        this.advanceTableForm.get('stateID')?.disable();
      }
    });
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      invoiceSummaryID: [this.advanceTable.invoiceSummaryID],
      customerID: [this.advanceTable.customerID || null, Validators.required],
      customerName: [this.advanceTable.customerName || this.advanceTable.customer, Validators.required],
      stateID: [this.advanceTable.stateID || 0, [Validators.required, Validators.min(1)]],
      stateName: [this.advanceTable.stateName || this.advanceTable.state],
      billSubmittedTo: [this.advanceTable.billSubmittedTo, [Validators.required, this.noWhitespaceValidator]],
      contactNumber: [this.advanceTable.contactNumber],
      remark: [this.advanceTable.remark],
      invoiceSummaryDate: [{value: this.advanceTable.invoiceSummaryDate, disabled: true}, Validators.required],
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

  loadStatesForCustomer(customerID: number) {
    if (!customerID) {
      this.StateList = [];
      this.advanceTableForm.patchValue({ stateID: 0, stateName: '' });
      return;
    }

    this._generalService.getStateForCustomer(customerID).subscribe((data) => {
      this.StateList = data || [];
      if (this.action === 'edit' && this.advanceTable.stateID) {
        this.advanceTableForm.patchValue({ stateID: this.advanceTable.stateID });
        const selectedState = this.StateList.find((state) => state.geoPointID === this.advanceTable.stateID);
        if (selectedState) {
          this.advanceTableForm.patchValue({ stateName: selectedState.geoPointName });
        }
      }
    });
  }

  private _filterCustomers(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return (this.CustomerList || []).filter((data) => data.customerName.toLowerCase().includes(filterValue));
  }

  onCustomerSelected(customer: CustomerDropDown) {
    if (!customer?.customerID) {
      return;
    }

    this.CustomerID = customer.customerID;
    this.advanceTableForm.patchValue({
      customerID: customer.customerID,
      customerName: customer.customerName,
      stateID: 0,
      stateName: ''
    });
    this.advanceTableForm.get('stateID')?.enable();
    this.loadStatesForCustomer(customer.customerID);
  }

  onStateSelected(stateID: number) {
    const selectedValue = (this.StateList || []).find((data) => data.geoPointID === stateID);
    if (selectedValue) {
      this.advanceTableForm.patchValue({
        stateID: selectedValue.geoPointID,
        stateName: selectedValue.geoPointName
      });
    } else {
      this.advanceTableForm.patchValue({ stateName: '' });
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
    this.CustomerID = null;
    this.CustomerList = [];
    this.StateList = [];
    this.EmployeeList = [];
    this.advanceTableForm.patchValue({
      summaryDispatchStatus: 'No',
      activationStatus: true,
      createdByID: this._generalService.getUserID(),
      customerID: null,
      stateID: 0,
      stateName: ''
    });
    this.advanceTableForm.get('stateID')?.disable();
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
