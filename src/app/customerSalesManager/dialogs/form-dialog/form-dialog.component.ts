// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerSalesManagerService } from '../../customerSalesManager.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerSalesManager } from '../../customerSalesManager.model';
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
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import moment from 'moment';
import {
  createDisplayEmployeeFn,
  formatEmployeeDropdownLabel,
  initEmployeeNamePrefixSearch,
  isEmployeeExited,
  isSelectedEmployeeExitedFromForm,
  finalizeCustomerEmployeeSavePayload,
  onEmployeeAutocompleteSelected,
  patchEmployeeNameForEditById,
} from 'src/app/shared/customer-employee-autocomplete';

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
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerSalesManager;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  saveDisabled:boolean=true;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerSalesManagerService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Sales Manager For ';       
          this.advanceTable = data.advanceTable;
          this.employeesID = this.advanceTable.employeeID;
          if (this.advanceTable.fromDate) {
            const startDate = moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
            if (moment(startDate, 'DD/MM/YYYY', true).isValid()) {
              this.onBlurFromDateEdit(startDate);
            }
          }
          if (this.advanceTable.endDate) {
            const endDate = moment(this.advanceTable.endDate).format('DD/MM/yyyy');
            if (moment(endDate, 'DD/MM/YYYY', true).isValid()) {
              this.onBlurEndDateEdit(endDate);
            }
          }
        } else 
        {
          this.dialogTitle = 'Sales  Manager For ';
          this.advanceTable = new CustomerSalesManager({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
       
  }
  public ngOnInit(): void
  {
    this.filteredinstructedByOptionss = of([]);
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
      this.employeesID || this.advanceTable?.employeeID,
      this.advanceTableForm,
      'employeeName',
      {
        getEmployeeList: () => this.EmployeeList || [],
        setEmployeeList: (list) => { this.EmployeeList = list; },
        setFilteredOptions: (options) => { this.filteredinstructedByOptionss = options; },
        onEmployeeId: (id) => { this.employeesID = id; },
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

  InitEmployee(_event?: unknown): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'employeeName', {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredinstructedByOptionss = options; },
    });
  }

  OnEmployeeSelect(selectedEmployee: EmployeeDropDown): void {
    onEmployeeAutocompleteSelected(
      this.advanceTableForm,
      'employeeName',
      selectedEmployee,
      (id) => { this.employeesID = id; }
    );
  }

  getemployeeIDTitles(employeeID: any) {
    this.employeesID = employeeID;
  }

  private buildSavePayload(): Record<string, unknown> {
    const raw = { ...this.advanceTableForm.getRawValue() };
    return finalizeCustomerEmployeeSavePayload(raw, {
      employeeField: 'employeeName',
      employeeList: this.EmployeeList || [],
      employeesID: this.employeesID,
      customerID: this.data.CustomerID,
      advanceTable: this.advanceTable,
      primaryKeyField: 'customerSalesManagerID',
      primaryKeyAliases: ['customerSalesManagerid', 'id'],
    });
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerSalesManagerID: [this.advanceTable.customerSalesManagerID],
      customerID: [this.advanceTable.customerID],
      employeeID: [this.advanceTable.employeeID,],
      employeeName: [this.advanceTable.employeeName, [Validators.required]],
      serviceDescription: [this.advanceTable.serviceDescription],
      attachmentStatus: [this.advanceTable.attachmentStatus],
      fromDate: [this.advanceTable.fromDate,[Validators.required, this._generalService.dateValidator()]],
      endDate: [this.advanceTable.endDate],
      activationStatus: [this.advanceTable.activationStatus],
      isDefaultSalesManager: [this.advanceTable.isDefaultSalesManager]
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
       
      this._generalService.sendUpdate('CustomerSalesManagerCreate:CustomerSalesManagerView:Success');//To Send Updates  
      this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerSalesManagerAll:CustomerSalesManagerView:Failure');//To Send Updates 
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
    this.advanceTableService.update(payload)  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerSalesManagerUpdate:CustomerSalesManagerView:Success');//To Send Updates 
       this.saveDisabled = true;
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerSalesManagerAll:CustomerSalesManagerView:Failure');//To Send Updates
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



