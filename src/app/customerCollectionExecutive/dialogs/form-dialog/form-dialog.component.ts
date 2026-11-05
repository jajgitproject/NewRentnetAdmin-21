// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerCollectionExecutiveService } from '../../customerCollectionExecutive.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerCollectionExecutive } from '../../customerCollectionExecutive.model';
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
  advanceTable: CustomerCollectionExecutive;
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
  public advanceTableService: CustomerCollectionExecutiveService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Collection Executive For ';       
          this.advanceTable = data.advanceTable;
          this.employeesID = this.advanceTable.employeeID;
          if (this.advanceTable.fromDate) {
            const startDate = moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
            if (moment(startDate, 'DD/MM/YYYY', true).isValid()) {
              this.onBlurFromEdit(startDate);
            }
          }
          if (this.advanceTable.toDate) {
            const endDate = moment(this.advanceTable.toDate).format('DD/MM/yyyy');
            if (moment(endDate, 'DD/MM/YYYY', true).isValid()) {
              this.onBlurToDateEdit(endDate);
            }
          }
        } else 
        {
          this.dialogTitle = ' Collection Executive For ';
          this.advanceTable = new CustomerCollectionExecutive({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
        const customerId = this.getResolvedCustomerId();
        if (customerId > 0) {
          this.advanceTableForm.patchValue({ customerID: customerId }, { emitEvent: false });
          this.CustomerID = customerId;
        }
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
      (id) => {
        this.employeesID = id;
        this.advanceTableForm.patchValue({ employeeID: id }, { emitEvent: false });
      }
    );
  }

  getemployeeIDTitles(employeeID: any) {
    this.employeesID = employeeID;
  }

  private resolveCustomerIdValue(value: unknown): number {
    if (value == null || String(value).trim() === '') {
      return 0;
    }
    const normalized = decodeURIComponent(String(value).trim()).replace(/ /g, '+');
    const decrypted = this._generalService.decrypt(normalized);
    const fromDecrypt = Number(String(decrypted).trim());
    if (Number.isFinite(fromDecrypt) && fromDecrypt > 0) {
      return fromDecrypt;
    }
    const plain = Number(normalized);
    if (Number.isFinite(plain) && plain > 0) {
      return plain;
    }
    return 0;
  }

  private getResolvedCustomerId(): number {
    const candidates = [
      this.data?.CustomerID,
      this.data?.customerID,
      this.data?.routeCustomerID,
      this.CustomerID,
      this.advanceTable?.customerID,
      this.advanceTableForm?.get('customerID')?.value,
    ];
    for (const candidate of candidates) {
      const id = this.resolveCustomerIdValue(candidate);
      if (id > 0) {
        return id;
      }
    }
    return 0;
  }

  private buildSavePayload(): Record<string, unknown> {
    const raw = { ...this.advanceTableForm.getRawValue() };
    const customerId = this.getResolvedCustomerId();
    if (customerId > 0) {
      raw['customerID'] = customerId;
    }
    return finalizeCustomerEmployeeSavePayload(raw, {
      employeeField: 'employeeName',
      employeeList: this.EmployeeList || [],
      employeesID: this.employeesID,
      customerID: customerId,
      advanceTable: this.advanceTable,
      primaryKeyField: 'customerCollectionExecutiveID',
      primaryKeyAliases: ['customerCollectionExecutiveid', 'id'],
    });
  }


  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerCollectionExecutiveID: [this.advanceTable.customerCollectionExecutiveID],
      customerID: [this.advanceTable.customerID],
      employeeID: [this.advanceTable.employeeID,],
      employeeName: [this.advanceTable.employeeName, [Validators.required]],
      fromDate: [this.advanceTable.fromDate,[Validators.required, this._generalService.dateValidator()]],
      toDate: [this.advanceTable.toDate],
      activationStatus: [this.advanceTable.activationStatus],
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
        
  onBlurFromEdit(value: string): void {  
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
        
  //to date
  onBlurToDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('toDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["toDate"].setValue(null);
      }
      else
      {
        this.advanceTableForm?.get('toDate')?.setErrors({ invalidDate: true });
      }
    }
  }
        
  onBlurToDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.toDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('toDate')?.setValue(formattedDate);
      }    
    } 
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["toDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('toDate')?.setErrors({ invalidDate: true });
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
 
  public Post(): void
  {
    const payload = this.buildSavePayload();
    const customerId = Number(payload['customerID'] ?? 0);
    if (!Number.isFinite(customerId) || customerId <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Customer is missing. Open Collection Executive from the customer menu (Customer link with ID in the URL).',
        'bottom',
        'center'
      );
      return;
    }
    if (!payload['employeeID'] || Number(payload['employeeID']) <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Please select an employee from the dropdown list.',
        'bottom',
        'center'
      );
      return;
    }
    if (!payload['fromDate']) {
      this.showNotification(
        'snackbar-danger',
        'From Date is required.',
        'bottom',
        'center'
      );
      return;
    }
    this.advanceTableService.add(payload as CustomerCollectionExecutive)
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerCollectionExecutiveCreate:CustomerCollectionExecutiveView:Success');//To Send Updates 
      this.saveDisabled = true;  
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerCollectionExecutiveAll:CustomerCollectionExecutiveView:Failure');//To Send Updates
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
       this._generalService.sendUpdate('CustomerCollectionExecutiveUpdate:CustomerCollectionExecutiveView:Success');//To Send Updates 
       this.saveDisabled = true; 
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerCollectionExecutiveAll:CustomerCollectionExecutiveView:Failure');//To Send Updates 
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



