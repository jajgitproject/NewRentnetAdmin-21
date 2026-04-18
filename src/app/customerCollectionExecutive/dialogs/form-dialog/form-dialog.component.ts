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
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
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
  employeeID:number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
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
          this.searchinstructedBy.setValue(this.advanceTable.employeeName)
          let startDate=moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.toDate).format('DD/MM/yyyy');
          this.onBlurFromEdit(startDate);
          this.onBlurToDateEdit(endDate);
        } else 
        {
          this.dialogTitle = ' Collection Executive For ';
          this.advanceTable = new CustomerCollectionExecutive({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
       
  }
  public ngOnInit(): void
  {
   this.InitEmployee(); 
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

  //--------------- Employee Validator -----------
  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
      return match ? null : { employeeNameInvalid: true };
    };
  }
  
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data;
        this.advanceTableForm.controls['employeeName'].setValidators([Validators.required,this.employeeNameValidator(this.EmployeeList)
        ]);
        this.advanceTableForm.controls['employeeName'].updateValueAndValidity();
        this.filteredinstructedByOptionss = this.advanceTableForm.controls['employeeName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      });
  }
  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.EmployeeList.filter(
      data => 
      {
        //return data.firstName.toLowerCase().includes(filterValue);
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  }
  OnEmployeeSelect(selectedEmployee: string)
  {
    const EmployeeName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedEmployee
    );
    if (selectedEmployee) 
    {
      this.getemployeeIDTitles(EmployeeName.employeeID);
    }
  }
  getemployeeIDTitles(employeeID: any) 
  {   
    this.employeesID=employeeID;
  }


  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerCollectionExecutiveID: [this.advanceTable.customerCollectionExecutiveID],
      customerID: [this.advanceTable.customerID],
      employeeID: [this.advanceTable.employeeID,],
      employeeName: [this.advanceTable.employeeName],
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
    
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({employeeID:this.employeesID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
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
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({employeeID:this.employeesID || this.advanceTable.employeeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
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



