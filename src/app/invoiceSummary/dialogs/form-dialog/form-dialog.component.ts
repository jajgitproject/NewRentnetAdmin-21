// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InvoiceSummaryService } from '../../invoiceSummary.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { InvoiceSummary } from '../../invoiceSummary.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
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
  filteredDispatchedByOptions: Observable<EmployeeDropDown[]>;
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
      this.dialogTitle = 'Invoice Summary';
      this.advanceTable = data.advanceTable;
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
    if (this.action === 'edit' && this.advanceTable.dispatchedBy) {
      this.advanceTableForm.patchValue({ dispatchedByName: this.advanceTable.dispatchedBy });
    }
    this.filteredDispatchedByOptions = this.advanceTableForm.controls['dispatchedByName'].valueChanges.pipe(
      startWith(this.advanceTableForm.controls['dispatchedByName'].value || ''),
      map((value) => this._filterEmployees(value || ''))
    );
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      invoiceSummaryID: [this.advanceTable.invoiceSummaryID],
      invoiceSummaryDate: [this.advanceTable.invoiceSummaryDate, Validators.required],
      remark: [this.advanceTable.remark],
      createdByID: [this.advanceTable.createdByID],
      summaryDispatchStatus: [this.advanceTable.summaryDispatchStatus || 'No', Validators.required],
      acknowledgement: [this.advanceTable.acknowledgement],
      billSubmittedTo: [this.advanceTable.billSubmittedTo, [Validators.required, this.noWhitespaceValidator]],
      contactNumber: [this.advanceTable.contactNumber],
      dispatchedByID: [this.advanceTable.dispatchedByID],
      dispatchedByName: [this.advanceTable.dispatchedByName || ''],
      dispatchDate: [this.advanceTable.dispatchDate],
      activationStatus: [this.advanceTable.activationStatus === true, Validators.required]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = ((control && control.value && control.value.toString()) || '').trim().length === 0;
    return !isWhitespace ? null : { whitespace: true };
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
