// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { ChangeSaleForCustomersService } from '../../changeSaleForCustomers.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { ChangeSaleForCustomers } from '../../changeSaleForCustomers.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import moment from 'moment';
import Swal from 'sweetalert2';


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
  public kamList? : EmployeeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>;
  filteredinstructedByOptions: Observable<EmployeeDropDown[]>;
  filteredCityOptions: Observable<CityDropDown[]>;
  public CityLists?: CityDropDown[] = [];
  searchinstructedBy: FormControl = new FormControl();
  public CityList?: CityDropDown[] = [];
  public StatesList?: StateDropDown[] = [];
  image: any;
  advanceTable: ChangeSaleForCustomers;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  employeesID: any;
  cityID: any;
  saveDisabled:boolean=true;
  oldSalesManagerID: any;
  newKAMID: any;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentHolder>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: ChangeSaleForCustomersService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Update Customer Sales Manager';       
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.newSalesManagerActivationFromDate).format('DD/MM/yyyy');
          let newSalesManagerActivationToDate=moment(this.advanceTable.newSalesManagerActivationToDate).format('DD/MM/yyyy');
          this.onBlurFromDateEdit(startDate);
          this.onBlurEndDateEdit(newSalesManagerActivationToDate);
        } else 
        {
          this.dialogTitle = 'Update Customer Sales Manager';
          this.advanceTable = new ChangeSaleForCustomers({});
          this.advanceTable.newSalesManagerActivationStatus=true;

        }
        this.advanceTableForm = this.createContactForm();    
        this.customerName=data.CustomerName;
        this.CustomerID=data.CustomerID;       
  }

  
  public ngOnInit(): void
  {
    this.InitEmployee();
   this.InitCustomerkamNewEmployee(); 

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

  //--------------- Employee Validator -----------
  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
      return match ? null : { employeeNameInvalid: true };
    };
  }
  
    customerKamEmployeeNameValidator(KamList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = KamList.some(employee => (employee.employeeFirstName + ' ' + employee.employeeLastName).toLowerCase() === value);
      return match ? null : { customerKamNameInvalid: true };
    };
  }
 
  cityNameValidator(CityLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityLists.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityNameInvalid: true };
    };
  }

  InitEmployee()
  {

    this._generalService.GetSalesChangesKam().subscribe
    (
      data =>   
      {
        this.kamList = data;
        this.advanceTableForm.controls['oldCustomerSalesManagerEmployee'].setValidators([Validators.required,
          this.customerKamEmployeeNameValidator(this.kamList)]);
        this.advanceTableForm.controls['oldCustomerSalesManagerEmployee'].updateValueAndValidity(); 
        this.filteredinstructedByOptionss = this.advanceTableForm.controls['oldCustomerSalesManagerEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      }
    );
  }
  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.kamList.filter(
      data => 
      {
        //return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        const fullName = `${data.employeeFirstName} ${data.employeeLastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  }
  OnEmployeeSelect(selectedEmployee: string, type: string)
  {
    const KamName = this.kamList.find(
      data => `${data.employeeFirstName} ${data.employeeLastName}` === selectedEmployee
    );
    if (selectedEmployee && type === 'oldSalesManager') 
    {
      this.getemployeeIDTitles(KamName?.employeeID);
    }
    else if (selectedEmployee && type === 'newSalesManager') {
      this.getkamemployeeIDTitles(KamName?.employeeID);
    }
  }
  getemployeeIDTitles(oldSalesManagerID: any)
  {
    this.oldSalesManagerID=oldSalesManagerID;
         this.advanceTableForm.patchValue({oldSalesManagerID: this.oldSalesManagerID});

  }


///newkamcustomer//


  InitCustomerkamNewEmployee()
  {

    this._generalService.GetEmployees().subscribe
    (
      data =>   
      {
        this.EmployeeList = data;
        this.advanceTableForm.controls['newCustomerSalesManagerEmployee'].setValidators([Validators.required,
          this.employeeNameValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['newCustomerSalesManagerEmployee'].updateValueAndValidity(); 
        this.filteredinstructedByOptions = this.advanceTableForm.controls['newCustomerSalesManagerEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchKam(value || ''))
        );
      }
    );
  }
  private _filtersearchKam(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.EmployeeList.filter(
      data => 
      {
        //return customer.firstName.toLowerCase().indexOf(filterValue)===0;
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  }
  OnKamEmployeeSelect(selectedEmployee: string, type: string)
  {
    const EmployeeName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedEmployee
    );
    if (selectedEmployee && type === 'newSalesManager') 
    {
      this.getkamemployeeIDTitles(EmployeeName.employeeID);
    }
  }
  // getkamemployeeIDTitles(employeeID: any)
  // {
  //   this.employeeID=employeeID;
  //        this.advanceTableForm.patchValue({newKAMID: this.employeeID});

  // }
  getkamemployeeIDTitles(employeeID: any)
{
  this.employeeID = employeeID;

 this.advanceTableForm.patchValue({ newSalesManagerID: this.employeeID });
}

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerSalesManagerID: [this.advanceTable.customerSalesManagerID],
      newSalesManagerActivationFromDate: [this.advanceTable.newSalesManagerActivationFromDate,[Validators.required, this._generalService.dateValidator()]],
      // newSalesManagerActivationToDate: [this.advanceTable.newSalesManagerActivationToDate],
      oldCustomerSalesManagerEmployee:[this.advanceTable.oldCustomerSalesManagerEmployee],
       newCustomerSalesManagerEmployee:[this.advanceTable.newCustomerSalesManagerEmployee],
        oldSalesManagerID: [this.advanceTable.oldSalesManagerID],
        newSalesManagerID: [this.advanceTable.employeeID],
      newSalesManagerActivationStatus: [this.advanceTable.newSalesManagerActivationStatus],
    });
  }

  //from date
  onBlurFromDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('newSalesManagerActivationFromDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('newSalesManagerActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }
               
  onBlurFromDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.newSalesManagerActivationFromDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('newSalesManagerActivationFromDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('newSalesManagerActivationFromDate')?.setErrors({ invalidDate: true });
    }
  }
               
  //end date
  onBlurEndDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);  
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('newSalesManagerActivationToDate')?.setValue(formattedDate);    
    }
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["newSalesManagerActivationToDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('newSalesManagerActivationToDate')?.setErrors({ invalidDate: true });
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
        this.advanceTable.newSalesManagerActivationToDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('newSalesManagerActivationToDate')?.setValue(formattedDate);
      }    
    } 
    else
    {
      if(value === "")
      {
        this.advanceTableForm.controls["newSalesManagerActivationToDate"].setValue('');
      }
      else
      {
        this.advanceTableForm?.get('newSalesManagerActivationToDate')?.setErrors({ invalidDate: true });
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
    

    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       
      this.dialogRef.close();
       
      this._generalService.sendUpdate('ChangeSaleForCustomersCreate:ChangeSaleForCustomersView:Success');//To Send Updates 
      this.saveDisabled = true; 
    },
    error =>
    {
       this._generalService.sendUpdate('ChangeSaleForCustomersAll:ChangeSaleForCustomersView:Failure');//To Send Updates
       this.saveDisabled = true;  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
   
        this.dialogRef.close();
       this._generalService.sendUpdate('ChangeSaleForCustomersUpdate:ChangeSaleForCustomersView:Success');//To Send Updates 
       this.saveDisabled = true;
         
    },
    error =>
    {
     this._generalService.sendUpdate('ChangeSaleForCustomersAll:ChangeSaleForCustomersView:Failure');//To Send Updates  
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
          if(this.MessageArray[0]=="ChangeSaleForCustomersCreate")
          {
            if(this.MessageArray[1]=="ChangeSaleForCustomersView")
            {
              if(this.MessageArray[2]=="Success")
              {
                 
          
                this.showNotification(
                'snackbar-success',
                'Do You really want to change the sales manager, this will change the sales manager for all the related customers!!!!',
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
    html: `<b>Do You really want to change the sales manager, this will change the sales manager for all the related customers!!!</b>`,
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



