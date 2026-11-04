// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VehicleCategoryService } from '../../vehicleCategory.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { VehicleCategory } from '../../vehicleCategory.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { VehicleCategoryDropDown } from '../../vehicleCategoryDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  advanceTable: VehicleCategory;
  public VehicleCategoryList?: VehicleCategoryDropDown[] = [];
  filteredVehicleCategoryOptions: Observable<VehicleCategoryDropDown[]>;
  searchVehicleCategory: FormControl = new FormControl();
  filteredVehicleCategoryOptionss: Observable<VehicleCategoryDropDown[]>;
  searchVehicleCategorys: FormControl = new FormControl();
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  searchCreatedBy: FormControl = new FormControl();
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();
  public EmployeeList?: EmployeeDropDown[] = [];
  public EmployeeLists?: EmployeeDropDown[] = [];
  previousVehicleCategoryID: any;
  nextVehicleCategoryID: any;
  employeeID: any;
  employeesID: any;
  isLoading = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VehicleCategoryService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Vehicle Category';
          this.dialogTitle ='Vehicle Category';
          this.advanceTable = data.advanceTable;
          this.employeesID = this.advanceTable.instructedByID;
          this.ImagePath=this.advanceTable.vehicleCategoryImage;
          this.ImagePath1=this.advanceTable.supportingDoc;
          this.searchVehicleCategory.setValue(this.advanceTable.previousCategory);
          this.searchVehicleCategorys.setValue(this.advanceTable.nextCategory);
          this.searchCreatedBy.setValue(this.advanceTable.createdBy);
          this.searchinstructedBy.setValue(this.advanceTable.employee || this.advanceTable.instructedBy);
        } else 
        {
          //this.dialogTitle = 'Create Vehicle Category';
          this.dialogTitle = 'Vehicle Category';
          this.advanceTable = new VehicleCategory({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
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
  
  public ngOnInit(): void
  {
    this.InitVehicleCategories();
    //this.InitEmployee();
    this.InitEmployees();
    this.InitVehicleCategoriess();
  }

  // InitVehicleCategories() {
    
  //   this._generalService.GetVehicleCategories().subscribe(
  //     data =>
  //     {
  //       this.VehicleCategoryList = data;
  //      // console.log(this.VehicleCategoryList);
  //     },
  //     error =>
  //     {
       
  //     }
  //   );
  // }
  
  InitVehicleCategories(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;

        this.filteredVehicleCategoryOptions =  this.advanceTableForm.controls["previousCategory"].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  private _filter(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().includes(filterValue)
  );
}

  
  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleCategory.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }
  onVehicleCategorySelected(selectedVehicleCategory: string) {

    const selectedValue = this.VehicleCategoryList.find(
      data => data.vehicleCategory === selectedVehicleCategory
    );
  
    if (selectedValue) {
      this.getTitles(selectedValue.vehicleCategoryID);
    }
  }
  
  getTitles(previousVehicleCategoryID: any) {
    
    this.previousVehicleCategoryID=previousVehicleCategoryID;
  }

  customerTypeValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehicleCategoryTypeInvalid: true };
    };
  }

  InitVehicleCategoriess(){
    this._generalService.GetVehicleCategories().subscribe(
      data=>
      {
        this.VehicleCategoryList=data;

        this.filteredVehicleCategoryOptionss =  this.advanceTableForm.controls["nextCategory"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVehicleCategory(value || ''))
        ); 
      });
  }
  private _filterVehicleCategory(value: string): any {
  const filterValue = value.toLowerCase();

  // Only show results after typing at least 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.VehicleCategoryList.filter(customer =>
    customer.vehicleCategory.toLowerCase().includes(filterValue)
  );
}

  
  // private _filterVehicleCategory(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.VehicleCategoryList.filter(
  //     customer => 
  //     {
  //       return customer.vehicleCategory.toLowerCase().includes(filterValue);
  //     }
  //   );
  // }
  onVehicleNextCategorySelected(selectedVehicleCategory: string) {
    const selectedValue = this.VehicleCategoryList.find(
      data => data.vehicleCategory === selectedVehicleCategory
    );
  
    if (selectedValue) {
      this.getnextCategoryID(selectedValue.vehicleCategoryID);
    }
  }
  
  getnextCategoryID(nextVehicleCategoryID: any) {
    
    this.nextVehicleCategoryID=nextVehicleCategoryID;
  }

  vehicleCategoryTypeValidator(VehicleCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleCategoryList.some(group => group.vehicleCategory.toLowerCase() === value);
      return match ? null : { vehiclesCategoryTypeInvalid: true };
    };
  }
  
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeeLists=data;
        this.filteredCreatedByOptionss = this.searchCreatedBy.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCreatedBy(value || ''))
        ); 
      });
  }
  
  private _filterCreatedBy(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeLists.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().includes(filterValue);
        // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  // onEmployeeSelected(selectedEmployee: string) {
  //   const selectedValue = this.EmployeeLists.find(
  //     data => data.firstName === selectedEmployee
  //   );
  
  //   if (selectedValue) {
  //     this.getemployee(selectedValue.employeeID);
  //   }
  // }
  
  getemployee(employeeID: any) {
    
    this.employeeID=employeeID;
  }

  isSelectedInstructedByExited(): boolean {
    const value = this.advanceTableForm?.get('employee')?.value;
    const emp = findEmployeeByDropdownInput(value, this.EmployeeList || []);
    if (emp && isEmployeeExited(emp)) {
      return true;
    }
    if (typeof value === 'string' && value.trim()) {
      return /\s-\s*Exited\s-/i.test(value);
    }
    return false;
  }

  InitEmployees(){
    this._generalService.GetEmployee().subscribe(
      data=>
      {
        this.EmployeeList = data || [];
        this.advanceTableForm.controls['employee'].setValidators([Validators.required,
          this.employeeValidator(this.EmployeeList)
        ]);
        this.advanceTableForm.controls['employee'].updateValueAndValidity();
        this.filteredinstructedByOptionss = this.advanceTableForm.controls['employee'].valueChanges.pipe(
          startWith(this.advanceTableForm.controls['employee'].value ?? ''),
          map((value) => {
            const term =
              typeof value === 'string'
                ? value
                : isEmployeeDropdownSelection(value)
                  ? formatEmployeeDropdownLabel(value)
                  : '';
            return filterEmployeesForAutocomplete(this.EmployeeList || [], term);
          })
        );
        if (this.action === 'edit') {
          this.patchInstructedByEmployeeForEdit();
        }
      });
  }

  private patchInstructedByEmployeeForEdit(): void {
    const id = this.employeesID || this.advanceTable?.instructedByID;
    if (id) {
      const fromList = (this.EmployeeList || []).find((e) => e.employeeID === id);
      if (fromList) {
        this.advanceTableForm.patchValue(
          { employee: fromList, instructedByID: id },
          { emitEvent: false }
        );
        this.employeesID = id;
        return;
      }
      this._generalService.getEmployeeID(id).subscribe(
        (data) => {
          const employee = Array.isArray(data) ? data[0] : data;
          if (!employee) {
            return;
          }
          this.EmployeeList = [employee, ...(this.EmployeeList || [])];
          this.advanceTableForm.patchValue(
            { employee, instructedByID: id },
            { emitEvent: false }
          );
          this.employeesID = id;
          this.advanceTableForm.controls['employee'].setValidators([
            Validators.required,
            this.employeeValidator(this.EmployeeList),
          ]);
          this.advanceTableForm.controls['employee'].updateValueAndValidity({ emitEvent: false });
        },
        () => { /* keep string label from row if lookup fails */ }
      );
      return;
    }
    const label = this.advanceTable?.employee || this.advanceTable?.instructedBy;
    if (label) {
      const found = findEmployeeByDropdownInput(label, this.EmployeeList || []);
      if (found) {
        this.advanceTableForm.patchValue(
          { employee: found, instructedByID: found.employeeID },
          { emitEvent: false }
        );
        this.employeesID = found.employeeID;
      }
    }
  }

  onEmployeeSelected(selectedEmployee: EmployeeDropDown) {
    if (!isEmployeeDropdownSelection(selectedEmployee)) {
      return;
    }
    this.advanceTableForm.patchValue(
      { employee: selectedEmployee, instructedByID: selectedEmployee.employeeID },
      { emitEvent: false }
    );
    this.employeesID = selectedEmployee.employeeID;
  }

  getemployeeIDTitles(employeeID: any) {
    this.employeesID = employeeID;
    this.advanceTableForm.patchValue({ instructedByID: this.employeesID });
  }

  employeeValidator(EmployeesList: EmployeeDropDown[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const instructedById =
        control.parent?.get('instructedByID')?.value ?? this.employeesID ?? null;

      if (isEmployeeDropdownSelection(value)) {
        const id = value.employeeID;
        if (id != null && Number(id) > 0) {
          return null;
        }
        return { employeeTypeInvalid: true };
      }
      if (value == null || typeof value !== 'string' || !value.trim()) {
        if (instructedById != null && Number(instructedById) > 0) {
          return null;
        }
        return { employeeTypeInvalid: true };
      }
      const match = (EmployeesList || []).some((employee) =>
        employeeMatchesDropdownInput(employee, value)
      );
      if (match) {
        return null;
      }
      if (instructedById != null && Number(instructedById) > 0) {
        return null;
      }
      return { employeeTypeInvalid: true };
    };
  }

  private buildSavePayload(): Record<string, unknown> {
    const raw = { ...this.advanceTableForm.getRawValue() };
    const empValue = raw['employee'];
    const employee =
      findEmployeeByDropdownInput(empValue as EmployeeDropDown | string, this.EmployeeList || []) ||
      (isEmployeeDropdownSelection(empValue) ? (empValue as EmployeeDropDown) : null);
    if (employee) {
      const label = formatEmployeeDropdownLabel(employee);
      raw['instructedByID'] = employee.employeeID;
      raw['employee'] = label;
      raw['instructedBy'] = label;
      this.employeesID = employee.employeeID;
    } else if (this.employeesID || raw['instructedByID']) {
      raw['instructedByID'] = this.employeesID || raw['instructedByID'];
      if (typeof empValue === 'string' && empValue.trim()) {
        raw['employee'] = empValue;
        raw['instructedBy'] = empValue;
      }
    }
    return raw;
  }

  // InitEmployee(){
  //   this._generalService.GetEmployeesForVehicleCategory().subscribe
  //   (
  //     data =>   
  //     {
  //       this.EmployeeList = data; 
       
  //     }
  //   );
  // }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      vehicleCategoryID: [this.advanceTable.vehicleCategoryID],
      vehicleCategory: [this.advanceTable.vehicleCategory,[this.noWhitespaceValidator]],
      vehicleCategoryLevel: [this.advanceTable.vehicleCategoryLevel,[this.noWhitespaceValidator]],
      previousVehicleCategoryID: [this.advanceTable.previousVehicleCategoryID],
      previousCategory: [this.advanceTable.previousCategory],
      nextVehicleCategoryID: [this.advanceTable.nextVehicleCategoryID],
      nextCategory: [this.advanceTable.nextCategory],
      vehicleCategoryImage: [this.advanceTable.vehicleCategoryImage],
      activationStatus: [this.advanceTable.activationStatus],
      createdByID :[this.advanceTable.createdByID],
      instructedByID :[this.advanceTable.instructedByID],
      supportingDoc :[this.advanceTable.supportingDoc],
      employee :[this.advanceTable.employee || this.advanceTable.instructedBy],
      description :[this.advanceTable.description],
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() 
  {
    // emppty stuff
  }
  reset(){
    this.advanceTableForm.reset();
    this.ImagePath="";
    this.ImagePath1="";
  }
  onNoClick():void{
    this.dialogRef.close();
  }
  public Post(): void {
    this.isLoading = true; // Show spinner
    this.advanceTableService.add(this.buildSavePayload())
      .subscribe(
        response => {
          this.isLoading = false; // Hide spinner
          this.dialogRef.close();
          this._generalService.sendUpdate('VehicleCategoryCreate:VehicleCategoryView:Success');
        },
        error => {
          this.isLoading = false; // Hide spinner in case of error
          this._generalService.sendUpdate('VehicleCategoryAll:VehicleCategoryView:Failure');
        }
      );
  }

  public Put(): void {
    this.isLoading = true; // Show spinner
    this.advanceTableService.update(this.buildSavePayload())
      .subscribe(
        response => {
          this.isLoading = false; // Hide spinner
          this.dialogRef.close();
          this._generalService.sendUpdate('VehicleCategoryUpdate:VehicleCategoryView:Success');
        },
        error => {
          this.isLoading = false; // Hide spinner in case of error
          this._generalService.sendUpdate('VehicleCategoryAll:VehicleCategoryView:Failure');
        }
      );
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public confirmAdd(): void 
  {
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
  public ImagePath1: string = "";
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({vehicleCategoryImage:this.ImagePath})
  }
  public uploadFinishedDoc = (event) => 
  {
    this.response = event;
    this.ImagePath1 = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({supportingDoc:this.ImagePath1})
  }
/////////////////for Image Upload ends////////////////////////////
}


