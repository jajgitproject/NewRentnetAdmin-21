// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerServiceExecutiveService } from '../../customerServiceExecutive.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerServiceExecutive } from '../../customerServiceExecutive.model';
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
  public EmployeesList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  searchCreatedBy: FormControl = new FormControl();
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();

  public EmployeesLists?: EmployeeDropDown[] = [];
  filteredExecutiveOptionss: Observable<EmployeeDropDown[]>;
  searchExecutiveBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerServiceExecutive;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  employeeExecutiveID: any;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerServiceExecutiveService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Service Executive for ';       
          this.advanceTable = data.advanceTable;
          this.searchCreatedBy.setValue(this.advanceTable.salesPerson);
          this.searchinstructedBy.setValue(this.advanceTable.reservationExecutive);
          this.searchExecutiveBy.setValue(this.advanceTable.collectionExecutive);
        } else 
        {
          this.dialogTitle = 'Service Executive for ';
          this.advanceTable = new CustomerServiceExecutive({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
       
  }
  public ngOnInit(): void
  {
   this.InitEmployee(); 
   this.InitEmployees();
   this.InitEmployeeExecutive();
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
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeesList=data;
        this.filteredCreatedByOptionss = this.advanceTableForm.controls['salesPerson'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCreatedBy(value || ''))
        ); 
      });
  }
  
  private _filterCreatedBy(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeesList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getemployee(employeeID: any) {
     
    this.employeeID=employeeID;
  }

  InitEmployees(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeeList=data;
        this.filteredinstructedByOptionss = this.advanceTableForm.controls['reservationExecutive'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        ); 
      });
  }
  
  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getemployeeIDTitles(employeeID: any) {
    this.employeesID=employeeID;
  }

  InitEmployeeExecutive(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe(
      data=>
      {
        this.EmployeesLists=data;
        this.filteredExecutiveOptionss = this.advanceTableForm.controls['collectionExecutive'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterExecutive(value || ''))
        ); 
      });
  }
  
  private _filterExecutive(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeesLists.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        // return customer.lastName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  
  getemployeeExecutive(employeeID: any) {
     
    this.employeeExecutiveID=employeeID;
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerServiceExecutiveID: [this.advanceTable.customerServiceExecutiveID],
      customerID: [this.advanceTable.customerID],
      salesPersonID: [this.advanceTable.salesPersonID],
      reservationExecutiveID:[this.advanceTable.reservationExecutiveID],
      reservationExecutive:[this.advanceTable.reservationExecutive],
      collectionExecutiveID:[this.advanceTable.collectionExecutiveID],
      collectionExecutive:[this.advanceTable.collectionExecutive],
      salesPerson:[this.advanceTable.salesPerson],
      startDate: [this.advanceTable.startDate,],
      endDate: [this.advanceTable.endDate],
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
    
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});

    this.advanceTableForm.patchValue({salesPersonID:this.employeeID});
    this.advanceTableForm.patchValue({reservationExecutiveID:this.employeesID});
    this.advanceTableForm.patchValue({collectionExecutiveID:this.employeeExecutiveID});

    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerServiceExecutiveCreate:CustomerServiceExecutiveView:Success');//To Send Updates  
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerServiceExecutiveAll:CustomerServiceExecutiveView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    this.advanceTableForm.patchValue({salesPersonID:this.employeeID || this.advanceTable.salesPersonID});
    this.advanceTableForm.patchValue({reservationExecutiveID:this.employeesID || this.advanceTable.reservationExecutiveID});
    this.advanceTableForm.patchValue({collectionExecutiveID:this.employeeExecutiveID || this.advanceTable.collectionExecutiveID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerServiceExecutiveUpdate:CustomerServiceExecutiveView:Success');//To Send Updates 
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerServiceExecutiveAll:CustomerServiceExecutiveView:Failure');//To Send Updates  
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


