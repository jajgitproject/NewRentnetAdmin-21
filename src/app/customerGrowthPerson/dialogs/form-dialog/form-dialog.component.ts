// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerGrowthPersonService } from '../../customerGrowthPerson.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerGrowthPerson } from '../../customerGrowthPerson.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Observable, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import {
  createDisplayEmployeeFn,
  formatEmployeeDropdownLabel,
  initEmployeeNamePrefixSearch,
  isEmployeeExited,
  isSelectedEmployeeExitedFromForm,
  onEmployeeAutocompleteSelected,
  patchEmployeeNameForEditById,
  employeeNameControlValidator,
  finalizeCustomerEmployeeSavePayload,
  isEmployeeDropdownSelection,
} from 'src/app/shared/customer-employee-autocomplete';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentHolder 
{
  formatEmployeeDropdownLabel = formatEmployeeDropdownLabel;
  isEmployeeExited = isEmployeeExited;
  displayEmployeeFn = createDisplayEmployeeFn();
  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]> = of([]);
    filteredcustomerGrowthPerson: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerGrowthPerson;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  saveDisabled:boolean=true;
  growthPersonManagerID: any;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerGrowthPersonService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Customer Growth Person  For ';       
          this.advanceTable = data.advanceTable;
          // let startDate=moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
          // let endDate=moment(this.advanceTable.toDate).format('DD/MM/yyyy');
          // this.onBlurFromEdit(startDate);
          // this.onBlurToDateEdit(endDate);
        } else 
        {
          this.dialogTitle = ' Customer Growth Person  For ';
          this.advanceTable = new CustomerGrowthPerson({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
       
  }
  public ngOnInit(): void
  {
    const employeeCtrl = this.advanceTableForm.get('employeeName');
    employeeCtrl?.setValidators([
      Validators.required,
      employeeNameControlValidator(() => this.EmployeeList || []),
    ]);
    employeeCtrl?.updateValueAndValidity({ emitEvent: false });
    if (this.action === 'edit') {
      this.patchEmployeeForEdit();
    }
  }

  isSelectedEmployeeExited(): boolean {
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'employeeName', this.EmployeeList || []);
  }

  private patchEmployeeForEdit(): void {
    patchEmployeeNameForEditById(
      this._generalService,
      this.advanceTable?.employeeID,
      this.advanceTableForm,
      'employeeName',
      {
        getEmployeeList: () => this.EmployeeList || [],
        setEmployeeList: (list) => { this.EmployeeList = list; },
        setFilteredOptions: (options) => { this.filteredinstructedByOptionss = options; },
        onEmployeeId: (id) => {
          this.employeesID = id;
          this.advanceTableForm.patchValue({ employeeID: id }, { emitEvent: false });
        },
      }
    );
  }

  InitEmployeePrefix(): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'employeeName', {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredinstructedByOptionss = options; },
    });
  }

  OnEmployeeSelect(selectedEmployee: EmployeeDropDown): void {
    if (isEmployeeDropdownSelection(selectedEmployee)) {
      const list = this.EmployeeList || [];
      if (!list.some((e) => Number(e.employeeID) === Number(selectedEmployee.employeeID))) {
        this.EmployeeList = [selectedEmployee, ...list];
      }
    }
    onEmployeeAutocompleteSelected(
      this.advanceTableForm,
      'employeeName',
      selectedEmployee,
      (id) => {
        this.employeesID = id;
        this.advanceTableForm.patchValue({ employeeID: id }, { emitEvent: false });
      }
    );
    this.advanceTableForm.get('employeeName')?.updateValueAndValidity({ emitEvent: false });
  }

  private buildSavePayload(): Record<string, unknown> {
    const customerId = Number(this.data?.CustomerID ?? this.CustomerID);
    return finalizeCustomerEmployeeSavePayload(this.advanceTableForm.getRawValue(), {
      employeeField: 'employeeName',
      employeeList: this.EmployeeList || [],
      employeesID: this.employeesID,
      customerID: Number.isFinite(customerId) && customerId > 0 ? customerId : undefined,
      advanceTable: this.advanceTable,
      primaryKeyField: 'customerGrowthPersonID',
      primaryKeyAliases: ['id'],
    });
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
// InitEmployee(){
//   this._generalService.GetEmployeesForVehicleCategory().subscribe(data => {
    
//     this.EmployeeList = data;

//     // ✅ Employee Validator
//     this.advanceTableForm.controls['employeeName'].setValidators([
//       Validators.required,
//       this.employeeNameValidator(this.EmployeeList)
//     ]);

//     // ✅ Growth Manager Validator
//     this.advanceTableForm.controls['growthPersonManager'].setValidators([
//       Validators.required,
//       this.growthPersonManagerValidator(this.EmployeeList)
//     ]);

//     // ✅ Employee Filter
//     this.filteredinstructedByOptionss =
//       this.advanceTableForm.controls['employeeName'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filtersearchinstructed(value || ''))
//       );

//     // ✅ Growth Manager Filter
//     this.filteredcustomerGrowthPerson =
//       this.advanceTableForm.controls['growthPersonManager'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filtersearchgrowthPersonManager(value || ''))
//       );

//     // ✅ EDIT MODE FIX (MOST IMPORTANT)
//     if (this.action === 'edit') {
//       this.patchEditData(this.advanceTable);
//     }

//   });
// }

// patchEditData(data: any) {

//   const emp = this.EmployeeList.find(x => x.employeeID == data.employeeID);

//   const manager = this.EmployeeList.find(x => x.employeeID == data.growthPersonManagerID);

//   this.advanceTableForm.patchValue({
//     employeeName: emp ? emp.firstName + ' ' + emp.lastName : '',
//     employeeID: data.employeeID,

//     growthPersonManager: manager ? manager.firstName + ' ' + manager.lastName : '',
//     growthPersonManagerID: data.growthPersonManagerID
//   });
// }

// private _filtersearchinstructed(value: string): any {
//   const filterValue = value.toLowerCase();

//   return this.EmployeeList.filter(data => {
//     const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
//     return fullName.includes(filterValue);
//   });
// }

// private _filtersearchgrowthPersonManager(value: string): any {
//   const filterValue = value.toLowerCase();

//   return this.EmployeeList.filter(data => {
//     const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
//     return fullName.includes(filterValue);
//   });
// }

// growthPersonManagerValidator(EmployeeList: any[]): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {

//     if (!control.value) {
//       return null; // required validator handle karega
//     }

//     const value = control.value.toString().toLowerCase().trim();

//     const match = EmployeeList.some(emp => {
//       const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`
//         .toLowerCase()
//         .trim();

//       return fullName === value;
//     });

//     return match ? null : { growthPersonManagerInvalid: true };
//   };
// }


// OnEmployeeSelect(selectedEmployee: string)
// {
//   const emp = this.EmployeeList.find(
//     x => `${x.firstName} ${x.lastName}` === selectedEmployee
//   );

//   if (emp) {
//     this.employeesID = emp.employeeID;

//     this.advanceTableForm.patchValue({
//       employeeID: emp.employeeID
//     });
//   }
// }

// OngrowthPersonManagerSelect(selectedEmployee: string)
// {
//   const emp = this.EmployeeList.find(
//     x => `${x.firstName} ${x.lastName}` === selectedEmployee
//   );

//   if (emp) {
//     this.growthPersonManagerID = emp.employeeID;

//     this.advanceTableForm.patchValue({
//       growthPersonManagerID: emp.employeeID
//     });
//   }
// }
//   sameEmployeeValidator(): ValidatorFn {
//   return (group: AbstractControl): ValidationErrors | null => {

//     const empID = group.get('employeeID')?.value;
//     const managerID = group.get('growthPersonManagerID')?.value;

//     if (empID && managerID && empID === managerID) {
//       return { sameEmployeeError: true };
//     }

//     return null;
//   };
// }
  
//growthPersonCode//

//  InitgrowthPersonManager(){
//     this._generalService.GetEmployeesForVehicleCategory().subscribe
//     (
//       data =>   
//       {
//         this.EmployeeList = data;
//         this.advanceTableForm.controls['growthPersonManager'].setValidators([Validators.required,this.growthPersonManagerValidator(this.EmployeeList)
//         ]);
//         this.advanceTableForm.controls['growthPersonManager'].updateValueAndValidity();
//         this.filteredcustomerGrowthPerson = this.advanceTableForm.controls['growthPersonManager'].valueChanges.pipe(
//           startWith(""),
//           map(value => this._filtersearchgrowthPersonManager(value || ''))
//         );
//       });
//   }
//   private _filtersearchgrowthPersonManager(value: string): any {
//     const filterValue = value.toLowerCase();
//     // if (!value || value.length < 3) {
//     //   return [];   
//     // }
//     return this.EmployeeList.filter(
//       data => 
//       {
//         //return data.firstName.toLowerCase().includes(filterValue);
//         const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
//         return fullName.includes(filterValue);
//       });
//   }
  

//   OngrowthPersonManagerSelect(selectedEmployee: string)
// {
//   const emp = this.EmployeeList.find(
//     x => `${x.firstName} ${x.lastName}` === selectedEmployee
//   );

//   if (emp) {
//     this.getOngrowthPersonManagerTitles(emp.employeeID);
//   }
// }
//  getOngrowthPersonManagerTitles(employeeID: any) 
// {   
//   this.growthPersonManagerID = employeeID;

//   this.advanceTableForm.patchValue({
//     growthPersonManagerID: employeeID
//   });
// }

//     growthPersonManagerValidator(EmployeeList: any[]): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {
//       const value = control.value?.toLowerCase();
//       const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
//       return match ? null : { growthPersonManagerInvalid: true };
//     };
//   }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerGrowthPersonID: [this.advanceTable.customerGrowthPersonID],
      customerID: [this.advanceTable.customerID],
      employeeID: [this.advanceTable.employeeID,],
      employeeName: [this.advanceTable.employeeName, [Validators.required]],
      growthPersonCode: [this.advanceTable.growthPersonCode, [Validators.required]],
      growthPersonManageCode: [this.advanceTable.growthPersonManageCode, [Validators.required]],
      activationStatus: [this.advanceTable.activationStatus],
  });

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
 
  public Post(): void
  {
    const requestObject = this.buildSavePayload();
    if (!requestObject.employeeID || Number(requestObject.employeeID) <= 0) {
      this.saveDisabled = true;
      this.showNotification('snackbar-danger', 'Please select an employee from the list.', 'bottom', 'center');
      return;
    }
    this.advanceTableService.add(requestObject as CustomerGrowthPerson)  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerGrowthPersonCreate:CustomerGrowthPersonView:Success');//To Send Updates 
      this.saveDisabled = true;  
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerGrowthPersonAll:CustomerGrowthPersonView:Failure');//To Send Updates
       this.saveDisabled = true;   
    }
  )
  }
  public Put(): void
  {
    const requestObject = this.buildSavePayload();
    if (!requestObject.employeeID || Number(requestObject.employeeID) <= 0) {
      requestObject.employeeID = this.employeesID || this.advanceTable.employeeID;
    }
    if (!requestObject.employeeID || Number(requestObject.employeeID) <= 0) {
      this.saveDisabled = true;
      this.showNotification('snackbar-danger', 'Please select an employee from the list.', 'bottom', 'center');
      return;
    }
    this.advanceTableService.update(requestObject as CustomerGrowthPerson)  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerGrowthPersonUpdate:CustomerGrowthPersonView:Success');//To Send Updates 
       this.saveDisabled = true; 
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerGrowthPersonAll:CustomerGrowthPersonView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    }
  )
  }
  messageReceived: string;
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  
  public confirmAdd(): void 
  {
    this.advanceTableForm.markAllAsTouched();
    if (!this.advanceTableForm.valid) {
      this.showNotification(
        'snackbar-warning',
        'Please fill required fields and pick an employee from the dropdown (type at least 3 characters, then select).',
        'bottom',
        'center'
      );
      return;
    }
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
}



