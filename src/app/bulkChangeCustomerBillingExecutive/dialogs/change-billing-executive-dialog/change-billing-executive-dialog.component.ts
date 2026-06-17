// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-change-billing-executive-dialog',
  templateUrl: './change-billing-executive-dialog.component.html',
  styleUrls: ['./change-billing-executive-dialog.component.sass']
})
export class ChangeBillingExecutiveDialogComponent implements OnInit {
  changeForm: FormGroup;
  public EmployeeList: EmployeeDropDown[] = [];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]> = of([]);
  newEmployeeID: number;
  selectedCount: number;

  constructor(
    public dialogRef: MatDialogRef<ChangeBillingExecutiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.selectedCount = data?.selectedCount || 0;
    this.changeForm = this.fb.group({
      newBillingExecutive: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._generalService.GetEmployeesForVehicleCategory().subscribe({
      next: (data) => {
        this.EmployeeList = data || [];
        const control = this.changeForm.controls['newBillingExecutive'];
        control.setValidators([Validators.required, this.employeeNameValidator(this.EmployeeList)]);
        control.updateValueAndValidity();
        this.filteredEmployeeOptions = control.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterEmployee(value || ''))
        );
      },
      error: () => {
        this.EmployeeList = [];
        this.filteredEmployeeOptions = of([]);
      }
    });
  }

  employeeNameValidator(employeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim?.() ?? control.value;
      if (!value) {
        return null;
      }
      const match = employeeList.some(
        (employee) => `${employee.firstName} ${employee.lastName}`.toLowerCase() === String(value).toLowerCase()
      );
      return match ? null : { employeeNameInvalid: true };
    };
  }

  private _filterEmployee(value: string): EmployeeDropDown[] {
    if (!value || value.length < 3) {
      return [];
    }
    const filterValue = String(value).toLowerCase();
    return (this.EmployeeList || []).filter((employee) => {
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase();
      return fullName.includes(filterValue);
    });
  }

  onEmployeeSelected(selectedEmployee: string) {
    const employee = this.EmployeeList.find(
      (item) => `${item.firstName} ${item.lastName}` === selectedEmployee
    );
    if (employee) {
      this.newEmployeeID = employee.employeeID;
    }
  }

  onChange() {
    if (!this.changeForm.valid || !this.newEmployeeID) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      html: `<b>Change Billing Executive for ${this.selectedCount} selected record(s)?</b><br/>Existing assignments will be deactivated and new records will be created.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Change',
      cancelButtonText: 'Cancel',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close(this.newEmployeeID);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
