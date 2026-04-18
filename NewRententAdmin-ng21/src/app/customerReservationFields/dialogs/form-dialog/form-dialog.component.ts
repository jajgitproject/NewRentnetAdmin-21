// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerReservationFieldsService } from '../../customerReservationFields.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerReservationFields } from '../../customerReservationFields.model';
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
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerReservationFields;
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
  public advanceTableService: CustomerReservationFieldsService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Reservation Field For ';       
          this.advanceTable = data.advanceTable;
          //this.searchinstructedBy.setValue(this.advanceTable.employeeName)
        } else 
        {
          this.dialogTitle = 'Reservation Field For ';
          this.advanceTable = new CustomerReservationFields({});
          this.advanceTable.activationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;
       
  }
  public ngOnInit(): void
  {
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

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerReservationFieldID: [this.advanceTable.customerReservationFieldID],
      customerID: [this.advanceTable.customerID],
      fieldName: [this.advanceTable.fieldName,],
      fieldDataType: [this.advanceTable.fieldDataType,],
      fieldControlType: [this.advanceTable.fieldControlType,],
      formForField: [this.advanceTable.formForField,],
      isMandatory: [this.advanceTable.isMandatory],
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
    //this.advanceTableForm.patchValue({employeeID:this.employeesID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerReservationFieldsCreate:CustomerReservationFieldsView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerReservationFieldsAll:CustomerReservationFieldsView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.data.CustomerID});
    //this.advanceTableForm.patchValue({employeeID:this.employeesID || this.advanceTable.employeeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerReservationFieldsUpdate:CustomerReservationFieldsView:Success');//To Send Updates
       this.saveDisabled = true; 
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerReservationFieldsAll:CustomerReservationFieldsView:Failure');//To Send Updates  
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


