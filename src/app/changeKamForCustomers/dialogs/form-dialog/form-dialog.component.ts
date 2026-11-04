// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { ChangeKamForCustomersService } from '../../changeKamForCustomers.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { ChangeKamForCustomers } from '../../changeKamForCustomers.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { Observable, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import moment from 'moment';
import Swal from 'sweetalert2';
import {
  createDisplayEmployeeFn,
  employeeNameControlValidator,
  filterPreloadedEmployeesForControl,
  formatEmployeeDropdownLabel,
  initEmployeeNamePrefixSearch,
  isEmployeeExited,
  isSelectedEmployeeExitedFromForm,
  finalizeChangeKamSavePayload,
  employeeStubFromIdAndDisplayName,
  normalizeChangeKamGridRowForEdit,
  normalizeKamChangeRow,
  onEmployeeAutocompleteSelected,
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
  public kamList? : EmployeeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]> = of([]);
  filteredinstructedByOptions: Observable<EmployeeDropDown[]> = of([]);
  filteredCityOptions: Observable<CityDropDown[]>;
  public CityLists?: CityDropDown[] = [];
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: ChangeKamForCustomers;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  cityID: any;
  saveDisabled:boolean=true;
  oldKAMID: any;
  newKAMID: any;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: ChangeKamForCustomersService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Change Kam For Customers';       
          this.advanceTable = normalizeChangeKamGridRowForEdit(data.advanceTable) as ChangeKamForCustomers;
          if (this.advanceTable.newKAMActivationFromDate) {
            const startDate = moment(this.advanceTable.newKAMActivationFromDate).format('DD/MM/yyyy');
            if (moment(startDate, 'DD/MM/YYYY', true).isValid()) {
              this.onBlurFromDateEdit(startDate);
            }
          }
          if (this.advanceTable.newKAMActivationToDate) {
            const newKAMActivationToDate = moment(this.advanceTable.newKAMActivationToDate).format('DD/MM/yyyy');
            if (moment(newKAMActivationToDate, 'DD/MM/YYYY', true).isValid()) {
              this.onBlurEndDateEdit(newKAMActivationToDate);
            }
          }
        } else 
        {
          this.dialogTitle = 'Change Kam For Customers ';
          this.advanceTable = new ChangeKamForCustomers({});
          this.advanceTable.newKAMActivationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;       
  }

  
  public ngOnInit(): void
  {
    this.filteredinstructedByOptionss = of([]);
    this.filteredinstructedByOptions = of([]);
    this.loadOldKamList();
  }

  isSelectedOldKamExited(): boolean {
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'oldCustomerkamEmployee', this.kamList || []);
  }

  isSelectedNewKamExited(): boolean {
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'newCustomerkamEmployee', this.EmployeeList || []);
  }

  private loadOldKamList(): void {
    this._generalService.GetCustomerChangesKam().subscribe((data) => {
      this.kamList = (data || []).map((row) => normalizeKamChangeRow(row as Record<string, unknown>));
      this.advanceTableForm.controls['oldCustomerkamEmployee'].setValidators([
        Validators.required,
        employeeNameControlValidator(() => this.kamList || []),
      ]);
      this.advanceTableForm.controls['oldCustomerkamEmployee'].updateValueAndValidity({ emitEvent: false });
      if (this.action === 'edit') {
        this.patchEditEmployeeFields();
      }
    });
  }

  private patchEditEmployeeFields(): void {
    const oldId = Number(this.advanceTable.oldKAMID ?? 0);
    const newId = Number(this.advanceTable.newKAMID ?? 0);
    const oldName = String(this.advanceTable.oldCustomerkamEmployee ?? '');
    const newName = String(this.advanceTable.newCustomerkamEmployee ?? '');
    const oldEmp =
      (this.kamList || []).find((e) => e.employeeID === oldId) ??
      employeeStubFromIdAndDisplayName(oldId, oldName);
    const newEmp = employeeStubFromIdAndDisplayName(newId, newName);
    if (!this.EmployeeList?.some((e) => e.employeeID === newEmp.employeeID)) {
      this.EmployeeList = [...(this.EmployeeList || []), newEmp];
    }
    this.oldKAMID = oldEmp.employeeID;
    this.newKAMID = newEmp.employeeID;
    this.advanceTableForm.patchValue(
      {
        oldCustomerkamEmployee: oldEmp,
        newCustomerkamEmployee: newEmp,
        oldKAMID: oldEmp.employeeID,
        newKAMID: newEmp.employeeID,
        customerKeyAccountManagerID: this.advanceTable.customerKeyAccountManagerID,
        newKAMActivationFromDate: this.advanceTable.newKAMActivationFromDate,
      },
      { emitEvent: false }
    );
    this.advanceTableForm.controls['newCustomerkamEmployee'].setValidators([
      Validators.required,
      employeeNameControlValidator(() => this.EmployeeList || []),
    ]);
    this.advanceTableForm.controls['newCustomerkamEmployee'].updateValueAndValidity({ emitEvent: false });
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

  cityNameValidator(CityLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityNameInvalid: true };
    };
  }

  InitOldKamEmployee(_event?: unknown): void {
    filterPreloadedEmployeesForControl(
      this.advanceTableForm,
      'oldCustomerkamEmployee',
      this.kamList || [],
      (options) => { this.filteredinstructedByOptionss = options; }
    );
  }

  InitNewKamEmployee(_event?: unknown): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'newCustomerkamEmployee', {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredinstructedByOptions = options; },
    });
  }

  OnOldKamSelected(selectedEmployee: EmployeeDropDown): void {
    onEmployeeAutocompleteSelected(
      this.advanceTableForm,
      'oldCustomerkamEmployee',
      selectedEmployee,
      (id) => {
        this.oldKAMID = id;
        this.advanceTableForm.patchValue({ oldKAMID: id }, { emitEvent: false });
      }
    );
  }

  OnNewKamSelected(selectedEmployee: EmployeeDropDown): void {
    onEmployeeAutocompleteSelected(
      this.advanceTableForm,
      'newCustomerkamEmployee',
      selectedEmployee,
      (id) => {
        this.newKAMID = id;
        this.advanceTableForm.patchValue({ newKAMID: id }, { emitEvent: false });
      }
    );
  }

  private buildSavePayload(): Record<string, unknown> {
    const raw = { ...this.advanceTableForm.getRawValue() };
    return finalizeChangeKamSavePayload(raw, {
      kamList: this.kamList || [],
      employeeList: this.EmployeeList || [],
      oldKAMID: this.oldKAMID,
      newKAMID: this.newKAMID,
    });
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerKeyAccountManagerID: [this.advanceTable.customerKeyAccountManagerID],
      newKAMActivationFromDate: [this.advanceTable.newKAMActivationFromDate,[Validators.required, this._generalService.dateValidator()]],
      // newKAMActivationToDate: [this.advanceTable.newKAMActivationToDate],
      oldCustomerkamEmployee:[this.advanceTable.oldCustomerkamEmployee, [Validators.required]],
       newCustomerkamEmployee:[this.advanceTable.newCustomerkamEmployee, [Validators.required]],
        oldKAMID: [this.advanceTable.oldKAMID],
        newKAMID: [this.advanceTable.newKAMID],
      newKAMActivationStatus: [this.advanceTable.newKAMActivationStatus],
    });
  }

  //from date
  onBlurFromDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('newKAMActivationFromDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('newKAMActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurFromDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.newKAMActivationFromDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('newKAMActivationFromDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('newKAMActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }
               
  //end date
  onBlurEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('newKAMActivationToDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["newKAMActivationToDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('newKAMActivationToDate')?.setErrors({ invalidDate: true });
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
        this.advanceTable.newKAMActivationToDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('newKAMActivationToDate')?.setValue(formattedDate);
      }    
    } 
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["newKAMActivationToDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('newKAMActivationToDate')?.setErrors({ invalidDate: true });
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
       
      this._generalService.sendUpdate('ChangeKamForCustomersCreate:ChangeKamForCustomersView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
       this._generalService.sendUpdate('ChangeKamForCustomersAll:ChangeKamForCustomersView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.buildSavePayload())  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('ChangeKamForCustomersUpdate:ChangeKamForCustomersView:Success');//To Send Updates 
       this.saveDisabled = true;
         
    },
    error =>
    {
     this._generalService.sendUpdate('ChangeKamForCustomersAll:ChangeKamForCustomersView:Failure');//To Send Updates  
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
          if(this.MessageArray[0]=="ChangeKamForCustomersCreate")
          {
            if(this.MessageArray[1]=="ChangeKamForCustomersView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
          
                this.showNotification(
                'snackbar-success',
                'Do You really want to change the KAM, this will change the Kam for all the related customers!!!!',
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
  Swal.fire({
    title: '',
    icon: 'warning',
    html: `<b>Do You really want to change the KAM, this will change the Kam for all the related customers!!!</b>`,
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false
  }).then((result) => {

    if (result.isConfirmed) {

      this.saveDisabled = false;

      if (this.action === "edit") {
        this.Put();
      } else {
        this.Post();
      }

    }

  });
}


}



