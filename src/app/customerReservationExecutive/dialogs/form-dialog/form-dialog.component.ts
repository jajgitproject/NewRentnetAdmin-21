// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input, Optional } from '@angular/core';
import { CustomerReservationExecutiveService } from '../../customerReservationExecutive.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerReservationExecutive } from '../../customerReservationExecutive.model';
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
import {
  createDisplayEmployeeFn,
  formatEmployeeDropdownLabel,
  initEmployeeNamePrefixSearch,
  isEmployeeExited,
  isSelectedEmployeeExitedFromForm,
  finalizeCustomerEmployeeSavePayload,
  onEmployeeAutocompleteSelected,
  patchEmployeeNameForEditById,
  readCustomerIdFromBrowserUrl,
  resolveCustomerIdFromQueryValue,
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
  advanceTable: CustomerReservationExecutive;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerReservationExecutiveService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Reservation Executive For ';       
          this.advanceTable = data.advanceTable;
          this.employeesID = this.advanceTable.employeeID;
        } else 
        {
          this.dialogTitle = ' Reservation Executive For ';
          this.advanceTable = new CustomerReservationExecutive({});
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
        onEmployeeId: (id) => {
          this.employeesID = id;
          this.advanceTableForm.patchValue({ employeeID: id }, { emitEvent: false });
        },
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
      (id) => {
        this.employeesID = id;
        this.advanceTableForm.patchValue({ employeeID: id }, { emitEvent: false });
      }
    );
  }

  getemployeeIDTitles(employeeID: any) {
    this.employeesID = employeeID;
  }

  private getResolvedCustomerId(): number {
    const candidates = [
      readCustomerIdFromBrowserUrl(),
      this.data?.routeCustomerID,
      this.data?.CustomerID,
      this.data?.customerID,
      this.CustomerID,
      this.advanceTable?.customerID,
      this.advanceTableForm?.get('customerID')?.value,
    ];
    for (const candidate of candidates) {
      const id = resolveCustomerIdFromQueryValue(this._generalService, candidate);
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
    const payload = finalizeCustomerEmployeeSavePayload(raw, {
      employeeField: 'employeeName',
      employeeList: this.EmployeeList || [],
      employeesID: this.employeesID,
      customerID: customerId,
      advanceTable: this.advanceTable,
      primaryKeyField: 'customerReservationExecutiveID',
      primaryKeyAliases: ['customerReservationExecutiveid', 'id'],
    });
    if (customerId > 0) {
      payload['customerID'] = customerId;
    }
    return payload;
  }

  private validateSavePayload(payload: Record<string, unknown>): boolean {
    const customerId = Number(payload['customerID'] ?? 0);
    if (!Number.isFinite(customerId) || customerId <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Customer is missing. Open Reservation Executive from the customer menu.',
        'bottom',
        'center'
      );
      return false;
    }
    if (!payload['employeeID'] || Number(payload['employeeID']) <= 0) {
      this.showNotification(
        'snackbar-danger',
        'Please select an employee from the dropdown list.',
        'bottom',
        'center'
      );
      return false;
    }
    if (!payload['fromDate']) {
      this.showNotification(
        'snackbar-danger',
        'From Date is required.',
        'bottom',
        'center'
      );
      return false;
    }
    if (!payload['toDate']) {
      this.showNotification(
        'snackbar-danger',
        'End Date is required.',
        'bottom',
        'center'
      );
      return false;
    }
    return true;
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerReservationExecutiveID: [this.advanceTable.customerReservationExecutiveID],
      customerID: [this.advanceTable.customerID],
      employeeID: [this.advanceTable.employeeID,],
      employeeName: [this.advanceTable.employeeName, [Validators.required]],
      fromDate: [this.advanceTable.fromDate, [Validators.required]],
      toDate: [this.advanceTable.toDate, [Validators.required]],
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
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    const payload = this.buildSavePayload();
    if (!this.validateSavePayload(payload)) {
      return;
    }
    this.advanceTableService.add(payload as CustomerReservationExecutive)
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerReservationExecutiveCreate:CustomerReservationExecutiveView:Success');//To Send Updates  
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerReservationExecutiveAll:CustomerReservationExecutiveView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    const payload = this.buildSavePayload();
    if (!payload['employeeID']) {
      payload['employeeID'] = this.employeesID || this.advanceTable.employeeID;
    }
    if (!payload['customerReservationExecutiveID']) {
      payload['customerReservationExecutiveID'] =
        this.advanceTable.customerReservationExecutiveID ??
        this.advanceTable.customerReservationExecutiveid;
    }
    if (!this.validateSavePayload(payload)) {
      return;
    }
    this.advanceTableService.update(payload as CustomerReservationExecutive)
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerReservationExecutiveUpdate:CustomerReservationExecutiveView:Success');//To Send Updates 
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerReservationExecutiveAll:CustomerReservationExecutiveView:Failure');//To Send Updates  
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


