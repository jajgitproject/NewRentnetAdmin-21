// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerKeyAccountManagerService } from '../../customerKeyAccountManager.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerKeyAccountManager } from '../../customerKeyAccountManager.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { Observable, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import moment from 'moment';
import {
  displayEmployeeDropdownValue,
  employeeMatchesDropdownInput,
  filterEmployeesForAutocomplete,
  findEmployeeByDropdownInput,
  formatEmployeeDropdownLabel,
  isEmployeeDropdownSelection,
  isEmployeeExited,
} from 'src/app/shared/employee-dropdown-display.util';
import { finalizeCustomerEmployeeSavePayload } from 'src/app/shared/customer-employee-autocomplete';

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
  displayEmployeeFn = (value: EmployeeDropDown | string | null) => displayEmployeeDropdownValue(value);

  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]> = of([]);
  filteredCityOptions: Observable<CityDropDown[]>;
  public CityLists?: CityDropDown[] = [];
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerKeyAccountManager;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  cityID: any;
  saveDisabled:boolean=true;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerKeyAccountManagerService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Key Account Manager For ';       
          this.advanceTable = data.advanceTable;

          this.employeesID = this.advanceTable.employeeID;
          let startDate=moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurFromDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Key Account Manager For ';
          this.advanceTable = new CustomerKeyAccountManager({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;       
  }

  
  public ngOnInit(): void
  {
    this.filteredinstructedByOptionss = of([]);
    this.advanceTableForm.get('attachmentStatus').valueChanges.subscribe(value => {
      if (value === 'Detached')
      {
        this.advanceTableForm.get('endDate').setValue(new Date());
      }
    });
    if (this.action === 'edit') {
      this.patchEmployeeForEdit();
    }
  }

  isSelectedEmployeeExited(): boolean {
    const value = this.advanceTableForm?.get('employeeName')?.value;
    const emp = findEmployeeByDropdownInput(value, this.EmployeeList || []);
    return emp ? isEmployeeExited(emp) : false;
  }

  private patchEmployeeForEdit(): void {
    const id = this.employeesID || this.advanceTable?.employeeID;
    if (!id) {
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
          { employeeName: employee, employeeID: id },
          { emitEvent: false }
        );
        this.advanceTableForm.controls['employeeName'].setValidators([
          Validators.required,
          this.employeeNameValidator(this.EmployeeList),
        ]);
        this.advanceTableForm.controls['employeeName'].updateValueAndValidity({ emitEvent: false });
        this.filteredinstructedByOptionss = of(this.EmployeeList);
      },
      () => {
        /* keep string label from row if lookup fails */
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

  //--------------- Employee Validator -----------
  employeeNameValidator(EmployeeList: EmployeeDropDown[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (isEmployeeDropdownSelection(value)) {
        const id = value.employeeID;
        if (id != null && Number(id) > 0) {
          return null;
        }
        return { employeeNameInvalid: true };
      }
      if (value == null || (typeof value === 'string' && !value.trim())) {
        return null;
      }
      if (typeof value !== 'string') {
        return { employeeNameInvalid: true };
      }
      const match = (EmployeeList || []).some((employee) => employeeMatchesDropdownInput(employee, value));
      return match ? null : { employeeNameInvalid: true };
    };
  }
  
  // InitCity() {
  //   this._generalService.GetCitiessAll().subscribe(
  //     data => {
  //       this.CityLists = data;
  //       this.advanceTableForm.controls['city'].setValidators([Validators.required,
  //       this.cityNameValidator(this.CityLists)
  //       ]);
  //       this.advanceTableForm.controls['city'].updateValueAndValidity();
  //       this.filteredCityOptions = this.advanceTableForm.controls["city"].valueChanges.pipe(
  //         startWith(""),
  //         map(value => this._filterCity(value || ''))
  //       );
  //     },
  //     error => {

  //     }
  //   );
  // }
  // private _filterCity(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.CityLists.filter(
  //     customer => {
  //       return customer.geoPointName.toLowerCase().indexOf(filterValue) === 0;
  //     }
  //   );
  // }
  // getCityID(geoPointID: any) {
  //   this.cityID = geoPointID;
  // }

  cityNameValidator(CityLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityNameInvalid: true };
    };
  }

  InitEmployee(_event?: any)
  {
    const raw = this.advanceTableForm.get('employeeName').value;
    const Prefix =
      typeof raw === 'string'
        ? raw
        : isEmployeeDropdownSelection(raw)
          ? formatEmployeeDropdownLabel(raw)
          : '';
    if (Prefix.length < 3)
    {
      this.EmployeeList = [];
      this.filteredinstructedByOptionss = of([]);
      this.advanceTableForm.controls['employeeName'].setValidators([Validators.required]);
      this.advanceTableForm.controls['employeeName'].updateValueAndValidity({ emitEvent: false });
      return;
    }
    if (isEmployeeDropdownSelection(raw)) {
      return;
    }
    this._generalService.searchEmployeesByPrefix(Prefix).subscribe
    (
      data =>
      {
        const current = this.advanceTableForm.get('employeeName').value;
        const currentPrefix =
          typeof current === 'string'
            ? current
            : isEmployeeDropdownSelection(current)
              ? formatEmployeeDropdownLabel(current)
              : '';
        if (currentPrefix !== Prefix) {
          return;
        }
        this.EmployeeList = data || [];
        this.advanceTableForm.controls['employeeName'].setValidators([Validators.required,
          this.employeeNameValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['employeeName'].updateValueAndValidity({ emitEvent: false });
        this.filteredinstructedByOptionss = of(filterEmployeesForAutocomplete(this.EmployeeList, Prefix));
      }
    );
  }
  OnEmployeeSelect(selectedEmployee: EmployeeDropDown)
  {
    if (!isEmployeeDropdownSelection(selectedEmployee)) {
      return;
    }
    this.advanceTableForm.patchValue(
      { employeeName: selectedEmployee, employeeID: selectedEmployee.employeeID },
      { emitEvent: false }
    );
    this.getemployeeIDTitles(selectedEmployee.employeeID);
  }

  private buildSavePayload(): Record<string, unknown> {
    const raw = { ...this.advanceTableForm.getRawValue() };
    const payload = finalizeCustomerEmployeeSavePayload(raw, {
      employeeField: 'employeeName',
      employeeList: this.EmployeeList || [],
      employeesID: this.employeesID,
      customerID: this.data.CustomerID,
      advanceTable: this.advanceTable,
      primaryKeyField: 'customerKeyAccountManagerID',
      primaryKeyAliases: ['customerKeyAccountManagerid', 'id'],
    });
    if (this.cityID) {
      payload['cityID'] = this.cityID;
    } else if (this.advanceTable?.cityID) {
      payload['cityID'] = this.advanceTable.cityID;
    }
    return payload;
  }
  getemployeeIDTitles(employeeID: any)
  {
    this.employeesID=employeeID;
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerKeyAccountManagerID: [this.advanceTable.customerKeyAccountManagerID],
      customerID: [this.advanceTable.customerID],
      employeeID: [this.advanceTable.employeeID,],
      employeeName: [this.advanceTable.employeeName, [Validators.required]],
      serviceDescription: [this.advanceTable.serviceDescription],
      attachmentStatus: [this.advanceTable.attachmentStatus],
      fromDate: [this.advanceTable.fromDate,[Validators.required, this._generalService.dateValidator()]],
      endDate: [this.advanceTable.endDate],
      // city:[this.advanceTable.city],
      // cityID:[this.advanceTable.cityID],
      activationStatus: [this.advanceTable.activationStatus],
      isDefaultKeyAccountManager: [this.advanceTable.isDefaultKeyAccountManager]
    });
  }

  //from date
  onBlurFromDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('fromDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurFromDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.fromDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }
               
  //end date
  onBlurEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["endDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
      }
    }
  }
              
  onBlurEndDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.endDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('endDate')?.setValue(formattedDate);
      }    
    } 
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["endDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
      }
    }
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

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    this.advanceTableService.add(this.buildSavePayload())  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerKeyAccountManagerCreate:CustomerKeyAccountManagerView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerKeyAccountManagerAll:CustomerKeyAccountManagerView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    const payload = this.buildSavePayload();
    if (!payload['employeeID']) {
      payload['employeeID'] = this.employeesID || this.advanceTable.employeeID;
    }
    if (!payload['cityID']) {
      payload['cityID'] = this.cityID || this.advanceTable.cityID;
    }
    this.advanceTableService.update(payload)  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerKeyAccountManagerUpdate:CustomerKeyAccountManagerView:Success');//To Send Updates 
       this.saveDisabled = true;
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerKeyAccountManagerAll:CustomerKeyAccountManagerView:Failure');//To Send Updates  
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
  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
     
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerKeyAccountManagerCreate")
          {
            if(this.MessageArray[1]=="CustomerKeyAccountManagerView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
          
                this.showNotification(
                'snackbar-success',
                'Supplier Contract City Percentage Created Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
         
        }
      }
    );
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
}



