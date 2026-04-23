// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { OrganizationalEntityStakeHoldersService } from '../../organizationalEntityStakeHolders.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { OrganizationalEntityStakeHolders } from '../../organizationalEntityStakeHolders.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { ThemeService } from 'ng2-charts';
import { Employee } from 'src/app/employee/employee.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public DepartmentList?: DepartmentDropDown[] = [];
  public DesginationList?: DesignationDropDown[] = [];
  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  searchEmployee: FormControl = new FormControl();
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  searchOrganizationalEntity: FormControl = new FormControl();
  filteredDepartmentOptions: Observable<DepartmentDropDown[]>;
  searchDepartmentEntity: FormControl = new FormControl();
  filteredDesginationOptions: Observable<DesignationDropDown[]>;
  searchDesgination: FormControl = new FormControl();

  image: any;
  advanceTable: OrganizationalEntityStakeHolders;
  organizationalEntityID: any;
  departmentID: any;
  designationID: any;
  OrganizationalEntityID: any;
  OrganizationalEntityName: any;
  isLoading: boolean = false;  
  // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: OrganizationalEntityStakeHoldersService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    this.OrganizationalEntityID = data.organizationalEntityID || null;
    this.OrganizationalEntityName = data.organizationalEntityName || '';
    if (this.action === 'edit') {
      //this.dialogTitle = 'Edit Organizational Entity Stake Holders';
      this.dialogTitle = 'Stake Holders';
      this.advanceTable = data.advanceTable;
      this.searchEmployee.setValue(this.advanceTable.firstName+" "+this.advanceTable.lastName);
      this.searchOrganizationalEntity.setValue(this.advanceTable.organizationalEntityName);
      this.searchDepartmentEntity.setValue(this.advanceTable.department);
      this.searchDesgination.setValue(this.advanceTable.designation);
      let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
    let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
      this.onBlurUpdateStartDateEdit(startDate);
     this.onBlurUpdateEndDateEdit(endDate);

    } else {
      //this.dialogTitle = 'Create Organizational Entity Stake Holders';
      this.dialogTitle = 'Stake Holders';
      this.advanceTable = new OrganizationalEntityStakeHolders({});
      this.advanceTable.activationStatus = true;
      this.employeeID = data.lastid;

    }
    
    this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
   {
    this.InitEmployee();
   // this.InitOrganizationalEntity();
    this.Initdepartment();
    this.InitDesignations();
    if (this.data.lastid) {
      this.advanceTableForm.patchValue({ employeeID: this.data.lastid });
    }
  
  }

  InitEmployee() {
    this._generalService.GetEmployee().subscribe(
      data => {
        this.EmployeeList = data;
        this.advanceTableForm.controls['employee'].setValidators([Validators.required,
          this.employeeValidator(this.EmployeeList)
        ]);
        this.advanceTableForm.controls['employee'].updateValueAndValidity();

        this.filteredEmployeeOptions = this.advanceTableForm.controls['employee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.EmployeeList.filter(
      customer => {
        return customer.firstName.toLowerCase().includes(filterValue);
      }
    );
  }

  onEmployeeSelected(selectedEmployeeName: string) {
    const selectedEmployee = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedEmployeeName
    );
  
    if (selectedEmployee) {
      this.getTitles(selectedEmployee.employeeID);
    }
  }

  getTitles(employeeID: any) {
    this.employeeID = employeeID;
    // this.searchEmployee.setValue(this.employeeID);
  }
  employeeValidator(EmployeesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeesList.some(employee => (employee.firstName + ' '+ employee.lastName).toLowerCase() === value);
      return match ? null : { employeeInvalid: true };
    };
  }
  
  InitOrganizationalEntity() {
    this._generalService.GetOrganizationalEntity().subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.advanceTableForm.controls['organizationalEntityName'].setValidators([Validators.required,
          this.organizationalEntityTypeValidator(this.OrganizationalEntityList)
        ]);
        this.advanceTableForm.controls['organizationalEntityName'].updateValueAndValidity();

        this.filteredOrganizationalEntityOptions =  this.advanceTableForm.controls['organizationalEntityName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizational(value || ''))
        );
      });
  }

  private _filterOrganizational(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.OrganizationalEntityList.filter(
      customer => {
        return customer.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }

  onEnitySelected(selectedorganizationalEntityName: string) {
    const selectedOrganizationalEntity = this.OrganizationalEntityList.find(
      state => state.organizationalEntityName === selectedorganizationalEntityName
    );
  
    if (selectedOrganizationalEntity) {
      this.getorganizationalEntityID(selectedOrganizationalEntity.organizationalEntityID);
    }
  }

  getorganizationalEntityID(organizationalEntityID: any) {
    this.organizationalEntityID = organizationalEntityID;
  }

  organizationalEntityTypeValidator(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { organizationalEntityNameInvalid: true };
    };
  }

  Initdepartment() {
    this._generalService.GetDepartments().subscribe(
      data => {
        this.DepartmentList = data;
        this.advanceTableForm.controls['department'].setValidators([Validators.required,
          this.departmentTypeValidator(this.DepartmentList)
        ]);
        this.advanceTableForm.controls['department'].updateValueAndValidity();
        this.filteredDepartmentOptions =  this.advanceTableForm.controls['department'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDepartment(value || ''))
        );
      });
  }

  private _filterDepartment(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.DepartmentList.filter(
      customer => {
        return customer.department.toLowerCase().includes(filterValue);
      }
    );
  }

  onDepartment(selectedDepartment: string) {
    const selectdepartment = this.DepartmentList.find(
      department => department.department === selectedDepartment
    );
  
    if (selectdepartment) {
      this.getdepartmentID(selectdepartment.departmentID);
    }
  }

  getdepartmentID(departmentID: any) {
    this.departmentID = departmentID;
  }

  departmentTypeValidator(DepartmentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DepartmentList.some(group => group.department.toLowerCase() === value);
      return match ? null : { departmentInvalid: true };
    };
  }

  InitDesignations() {
    this._generalService.GetDesignations().subscribe(
      data => {
        this.DesginationList = data;
        this.advanceTableForm.controls['designation'].setValidators([Validators.required,
          this.designationsTypeValidator(this.DesginationList)
        ]);
        this.advanceTableForm.controls['designation'].updateValueAndValidity();
        this.filteredDesginationOptions =  this.advanceTableForm.controls['designation'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDesgination(value || ''))
        );
      });
  }

  private _filterDesgination(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.DesginationList.filter(
      customer => {
        return customer.designation.toLowerCase().includes(filterValue);
      }
    );
  }

  ondesignation(selectedDesignation: string) {
    const selectdesgination = this.DesginationList.find(
      desgination => desgination.designation === selectedDesignation
    );
  
    if (selectdesgination) {
      this.getdesignationID(selectdesgination.designationID);
    }
  }

  getdesignationID(designationID: any) {
    this.designationID = designationID;
  }

  designationsTypeValidator(DesginationList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DesginationList.some(group => group.designation.toLowerCase() === value);
      return match ? null : { desginationInvalid: true };
    };
  }
  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        organizationalEntityStakeHoldersID: [this.advanceTable.organizationalEntityStakeHoldersID],
        employeeID: [this.advanceTable.employeeID],
        designationID: [this.advanceTable.designationID,],
        departmentID: [this.advanceTable.departmentID],
        organizationalEntityID: [this.advanceTable.organizationalEntityID || this.OrganizationalEntityID],
        startDate: [this.advanceTable.startDate,[Validators.required, this._generalService.dateValidator()]],
        endDate: [this.advanceTable.endDate,[Validators.required, this._generalService.dateValidator()]],
        isHOD: [this.advanceTable.isHOD,],
        isResponsibleForChildEntities: [this.advanceTable.isResponsibleForChildEntities],
        activationStatus: [this.advanceTable.activationStatus],
        positionType: [this.advanceTable.positionType],
        employee: [this.advanceTable.firstName+" "+this.advanceTable.lastName],
        organizationalEntityName:[this.advanceTable.organizationalEntityName],
        department:[this.advanceTable.department],
        designation:[this.advanceTable.designation]
      });
  }
//start date
onBlurUpdateStartDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateStartDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.startDate=formattedDate
  }
  else{
    this.advanceTableForm.get('startDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
}
}

//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.endDate=formattedDate
}
else{
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

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
    
  }
  public Post(): void {
    this.isLoading = true;  // Start loading spinner

    const formData = this.advanceTableForm.getRawValue();
    formData.employeeID = this.employeeID;
    formData.organizationalEntityID = this.OrganizationalEntityID || this.advanceTable.organizationalEntityID;
    formData.departmentID = this.departmentID;
    formData.designationID = this.designationID;


    this.advanceTableService.add(formData)
      .subscribe(
        response => {
          this.isLoading = false;  // Stop loading spinner
          this.dialogRef.close();
          this._generalService.sendUpdate('OrganizationalEntityStakeHoldersCreate:OrganizationalEntityStakeHoldersView:Success');
          
          if (this.data.lastid) {
            this.showNotification(
              'snackbar-success',
              'Organizational Entity Stake Holders Created Successfully...!!!',
              'bottom',
              'center'
            );
          }
        },
        error => {
          this.isLoading = false;  // Stop loading spinner in case of error
          this._generalService.sendUpdate('OrganizationalEntityStakeHoldersAll:OrganizationalEntityStakeHoldersView:Failure');
        }
      );
  }

  // Put method
  public Put(): void {
    this.isLoading = true;  // Start loading spinner

    this.advanceTableForm.patchValue({ 
      employeeID: this.employeeID || this.advanceTable.employeeID, 
      organizationalEntityID: this.OrganizationalEntityID || this.advanceTable.organizationalEntityID, 
      departmentID: this.departmentID || this.advanceTable.departmentID, 
      designationID: this.designationID || this.advanceTable.designationID 
    });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop loading spinner
          this.dialogRef.close();
          this._generalService.sendUpdate('OrganizationalEntityStakeHoldersUpdate:OrganizationalEntityStakeHoldersView:Success');
        },
        error => {
          this.isLoading = false;  // Stop loading spinner in case of error
          this._generalService.sendUpdate('OrganizationalEntityStakeHoldersAll:OrganizationalEntityStakeHoldersView:Failure');
        }
      );
  }

  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");

          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "OrganizationalEntityStakeHoldersCreate") {
              if (this.MessageArray[1] == "OrganizationalEntityStakeHoldersView") {
                if (this.MessageArray[2] == "Success") {
                  this.showNotification(
                    'snackbar-success',
                    'Organizational Entity Stake Holders Created Successfully...!!!',
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
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
}



