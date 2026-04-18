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
          this.searchinstructedBy.setValue(this.advanceTable.employeeName)
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
   this.InitEmployee(); 
   //this.InitgrowthPersonManager();
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
  //--------------- Employee Validator -----------
  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
      return match ? null : { employeeNameInvalid: true };
    };
  }

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
      employeeName: [this.advanceTable.employeeName],
      growthPersonCode: [this.advanceTable.growthPersonCode],
      growthPersonManageCode: [this.advanceTable.growthPersonManageCode],
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
    
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({employeeID:this.employeesID});

    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
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
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({employeeID:this.employeesID || this.advanceTable.employeeID});
    //this.advanceTableForm.patchValue({growthPersonManagerID: this.growthPersonManagerID || this.advanceTable.growthPersonManagerID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
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



