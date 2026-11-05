// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerContractMappingService } from '../../customerContractMapping.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CustomerContractMapping } from '../../customerContractMapping.model';
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
import { SaveDialogComponent } from 'src/app/customerConfigurationMessaging/dialogs/saveDialog/saveDialog.component';
import { SearchDialogComponent } from '../searchDialog/searchDialog.component';
import { map, startWith } from 'rxjs/operators';
import { CustomerContractDropDown } from 'src/app/customerContract/customerContractDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import {
  coerceEmployeeFieldToApiString,
  createDisplayEmployeeFn,
  findEmployeeByDropdownInput,
  formatEmployeeDropdownLabel,
  initEmployeeNamePrefixSearch,
  isEmployeeExited,
  isSelectedEmployeeExitedFromForm,
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
  displayNegotiatedFn = createDisplayEmployeeFn();
  displayApprovedFn = createDisplayEmployeeFn();
  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public EmployeesList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]> = of([]);
  searchCreatedBy: FormControl = new FormControl();
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]> = of([]);
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerContractMapping;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  customerID:any;
  dialogCustomerContractData: any;
  customerContractName: string;
  employeesID: any;
  public CustomerList?: CustomerContractDropDown[] = [];
  filteredOptions: Observable<CustomerContractDropDown[]>;
  customerConID: any;
  search: FormControl = new FormControl();
  customerContractID: any;
  dataSource: any;
  EndDate: any;
  minEndDate: Date = new Date();
  hideDate: boolean | false;
  saveDisabled:boolean = true; 
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public SearchDialog: MatDialog,
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerContractMappingService,
  private fb: FormBuilder,
  public customerContractMappingService: CustomerContractMappingService,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.customerName=data.CustomerName;
        this.customerID=data.customerID;   
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Contract Mapping for ';       
          this.advanceTable = data.advanceTable;

          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurStartDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Contract Mapping for ';
          this.advanceTable = new CustomerContractMapping({});
          this.advanceTable.activationStatus=true;
          this.advanceTable.customerName= this.customerName;
         // this.dialogCustomerContractData.customerContractName =this.customerContractName
        }
        this.advanceTableForm = this.createContactForm();          
  }
  public ngOnInit(): void
  {
   if (this.action === 'edit') {
     this.patchNegotiatedForEdit();
     this.patchApprovedForEdit();
   }
   this.InitCustomerContract();
  }

  isSelectedNegotiatedExited(): boolean {
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'negotiatedBy', this.EmployeesList || []);
  }

  isSelectedApprovedExited(): boolean {
    return isSelectedEmployeeExitedFromForm(this.advanceTableForm, 'approvedBy', this.EmployeeList || []);
  }

  private patchNegotiatedForEdit(): void {
    patchEmployeeNameForEditById(
      this._generalService,
      this.advanceTable?.negotiatedByID,
      this.advanceTableForm,
      'negotiatedBy',
      {
        getEmployeeList: () => this.EmployeesList || [],
        setEmployeeList: (list) => { this.EmployeesList = list; },
        setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
        onEmployeeId: (id) => {
          this.employeeID = id;
          this.advanceTableForm.patchValue({ negotiatedByID: id }, { emitEvent: false });
        },
      }
    );
  }

  private patchApprovedForEdit(): void {
    patchEmployeeNameForEditById(
      this._generalService,
      this.advanceTable?.approvedByID,
      this.advanceTableForm,
      'approvedBy',
      {
        getEmployeeList: () => this.EmployeeList || [],
        setEmployeeList: (list) => { this.EmployeeList = list; },
        setFilteredOptions: (options) => { this.filteredinstructedByOptionss = options; },
        onEmployeeId: (id) => {
          this.employeesID = id;
          this.advanceTableForm.patchValue({ approvedByID: id }, { emitEvent: false });
        },
      }
    );
  }

  InitNegotiatedPrefix(): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'negotiatedBy', {
      getEmployeeList: () => this.EmployeesList || [],
      setEmployeeList: (list) => { this.EmployeesList = list; },
      setFilteredOptions: (options) => { this.filteredCreatedByOptionss = options; },
    });
  }

  InitApprovedPrefix(): void {
    initEmployeeNamePrefixSearch(this._generalService, this.advanceTableForm, 'approvedBy', {
      getEmployeeList: () => this.EmployeeList || [],
      setEmployeeList: (list) => { this.EmployeeList = list; },
      setFilteredOptions: (options) => { this.filteredinstructedByOptionss = options; },
    });
  }

  onNegotiatedSelected(selected: EmployeeDropDown): void {
    onEmployeeAutocompleteSelected(this.advanceTableForm, 'negotiatedBy', selected, (id) => {
      this.employeeID = id;
      this.advanceTableForm.patchValue({ negotiatedByID: id }, { emitEvent: false });
    });
  }

  onApprovedSelected(selected: EmployeeDropDown): void {
    onEmployeeAutocompleteSelected(this.advanceTableForm, 'approvedBy', selected, (id) => {
      this.employeesID = id;
      this.advanceTableForm.patchValue({ approvedByID: id }, { emitEvent: false });
    });
  }

  private prepareEmployeeFieldsForSave(raw: Record<string, unknown>): void {
    coerceEmployeeFieldToApiString(raw, 'negotiatedBy', this.EmployeesList || []);
    coerceEmployeeFieldToApiString(raw, 'approvedBy', this.EmployeeList || []);
    const negotiated = findEmployeeByDropdownInput(
      this.advanceTableForm.get('negotiatedBy')?.value,
      this.EmployeesList || []
    );
    const approved = findEmployeeByDropdownInput(
      this.advanceTableForm.get('approvedBy')?.value,
      this.EmployeeList || []
    );
    if (negotiated?.employeeID) {
      raw.negotiatedByID = negotiated.employeeID;
      this.employeeID = negotiated.employeeID;
    }
    if (approved?.employeeID) {
      raw.approvedByID = approved.employeeID;
      this.employeesID = approved.employeeID;
    }
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
 
  public onStartDateChange(endDate:any) 
  {
    this.customerContractMappingService.GetDateBasedOnEndDate(this.customerID,endDate).subscribe(
    data =>   
    {
      if(this.action === 'add')
      {
        this.advanceTableForm.patchValue({startDate:this.advanceTable.startDate});
      }
      else
      {
        var nextDate = data.nextDate;
        this.advanceTableForm.patchValue({startDate:nextDate});
      }
    }, 
    (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  
  public loadLastDateForCustomer() 
  {
    this.customerContractMappingService.GetLastDateOfCustomer(this.customerID).subscribe(
    data =>   
    {
      this.EndDate = data.endDate;
      if(this.EndDate === null)
      {
        this.hideDate = false;
      }
      else
      {
        this.hideDate = true;
        this.onStartDateChange(this.EndDate);
      }
    },
    (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  //------------- Contract --------------


  customerContractValidator(CustomerList : any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = this.CustomerList.some(customer => customer.customerContractName.toLowerCase() === value);
      return match ? null : { customerContractNameInvalid: true };
    };
  }
  InitCustomerContract(){
    this._generalService.GetCustomerContract().subscribe
    (
      data =>   
      {
        this.CustomerList = data; 
        this.advanceTableForm.controls['customerContractName'].setValidators([Validators.required,this.customerContractValidator(this.CustomerList)]);
        this.advanceTableForm.controls['customerContractName'].updateValueAndValidity();
        this.filteredOptions = this.advanceTableForm.controls['customerContractName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );      
      }
     
    );
  }
  private _filter(value: any): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerList.filter(
      customer =>
      {
        return customer.customerContractName.toLowerCase().includes(filterValue);
      });
  }
  OnCustomerContractNameSelect(selectedCustomerContract: string)
  {
    const CustomerContractName = this.CustomerList.find(
      data => data.customerContractName === selectedCustomerContract
    );
    if (selectedCustomerContract) 
    {
      this.GetID(CustomerContractName.customerContractID);
    }
  }
  GetID(customerContractID :any)
  {
    this.customerContractID=customerContractID;
  }
  

  openSearchDialog(){

    const dialogRef = this.SearchDialog.open(SearchDialogComponent, 
    {
      data: 
        {
           actions:this.data.action,
           advanceTableForm:this.advanceTableForm,
           dialogRef:this.dialogRef
        }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        this.dialogCustomerContractData = data;
        this.advanceTableForm.patchValue({customerContractName: this.dialogCustomerContractData.customerContractName});
        this.advanceTableForm.patchValue({customerContractID: this.dialogCustomerContractData.customerContractID});
      });

  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerContractMappingID: [this.advanceTable?.customerContractMappingID],
      customerID: [this.advanceTable?.customerID],
      customerContractID: [this.advanceTable?.customerContractID,],
      negotiatedByID : [this.advanceTable?.negotiatedByID,],
      negotiatedBy:[this.advanceTable?.negotiatedBy,],
      customerName :[this.advanceTable?.customerName],
      customerContractName:[this.advanceTable?.customerContractName],
      approvedByID: [this.advanceTable?.approvedByID,],
      customerApproverName: [this.advanceTable?.customerApproverName],
      customerApproverDesignation: [this.advanceTable?.customerApproverDesignation,],
      referenceNote:[this.advanceTable?.referenceNote],
      startDate: [this.advanceTable?.startDate,[Validators.required, this._generalService.dateValidator()]],
      endDate: [this.advanceTable?.endDate,[Validators.required, this._generalService.dateValidator()]],
      approvedBy:[this.advanceTable?.approvedBy,],
      activationStatus: [this.advanceTable?.activationStatus],
    });
  }

  //start date
  onBlurStartDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
    }
  }
              
  onBlurStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.startDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('startDate')?.setValue(formattedDate);
      }    
    } else {
        this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
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
      this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
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
    } else {
        this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
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
    this.advanceTableForm.patchValue({customerID:this.customerID});
    this.advanceTableForm.patchValue({customerContractID: this.customerContractID});
    const requestObject = this.advanceTableForm.getRawValue();
    this.prepareEmployeeFieldsForSave(requestObject);
    this.advanceTableService.add(requestObject)  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerContractMappingCreate:CustomerContractMappingView:Success');//To Send Updates  
      //this.advanceTableForm.patchValue({customerContractID: this.dialogCustomerContractData.customerContractName});
      this.saveDisabled = true; 
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerContractMappingAll:CustomerContractMappingView:Failure');//To Send Updates  
       //this.advanceTableForm.patchValue({customerContractID: this.dialogCustomerContractData.customerContractName});
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.data.customerID});
    this.advanceTableForm.patchValue({customerContractID: this.customerContractID || this.advanceTable.customerContractID});
    const requestObject = this.advanceTableForm.getRawValue();
    this.prepareEmployeeFieldsForSave(requestObject);
    if (!requestObject.negotiatedByID) {
      requestObject.negotiatedByID = this.employeeID || this.advanceTable.negotiatedByID;
    }
    if (!requestObject.approvedByID) {
      requestObject.approvedByID = this.employeesID || this.advanceTable.approvedByID;
    }
    this.advanceTableService.update(requestObject)  
    .subscribe(
    response => 
    {  
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerContractMappingUpdate:CustomerContractMappingView:Success');//To Send Updates 
       //this.advanceTableForm.patchValue({customerContractID: this.dialogCustomerContractData?.customerContractName});
       this.saveDisabled = true; 
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerContractMappingAll:CustomerContractMappingView:Failure');//To Send Updates  
      //this.advanceTableForm.patchValue({customerContractID: this.dialogCustomerContractData.customerContractName});
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



