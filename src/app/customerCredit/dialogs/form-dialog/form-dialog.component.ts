// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerCreditService } from '../../customerCredit.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerCredit } from '../../customerCredit.model';
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
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';

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
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: CustomerCredit;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerContractMappingID:any;
  saveDisabled:boolean=true;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: CustomerCreditService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Credit for ';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Credit for ';
          this.advanceTable = new CustomerCredit({});
          this.advanceTable.activationStatus=true;

         
        
        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;

        this.CustomerContractMappingID=data.CustomerContractMappingID;
        this.applicableFrom=data.ApplicableFrom;
        this.applicableTo=data.ApplicableTo;
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
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
       
      }
    );
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerCreditID: [this.advanceTable.customerCreditID],
      customerContractMappingID: [this.advanceTable.customerContractMappingID],
      creditPeriodInDays: [this.advanceTable.creditPeriodInDays,],
      creditLimitAmount: [this.advanceTable.creditLimitAmount],
      customerCreditStartDate: [this.advanceTable.customerCreditStartDate],
      customerCreditEndDate: [this.advanceTable.customerCreditEndDate,],
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
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    
    this.advanceTableForm.patchValue({customerContractMappingID:this.data.CustomerContractMappingID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('CustomerCreditCreate:CustomerCreditView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerCreditAll:CustomerCreditView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerContractMappingID:this.data.CustomerContractMappingID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
   
    
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerCreditUpdate:CustomerCreditView:Success');//To Send Updates
       this.saveDisabled = true; 
         
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerCreditAll:CustomerCreditView:Failure');//To Send Updates
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


