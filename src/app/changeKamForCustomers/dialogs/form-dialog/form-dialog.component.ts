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
          this.advanceTable = data.advanceTable;
          let startDate=moment(this.advanceTable.newKAMActivationFromDate).format('DD/MM/yyyy');
          let newKAMActivationToDate=moment(this.advanceTable.newKAMActivationToDate).format('DD/MM/yyyy');
          this.onBlurFromDateEdit(startDate);
          this.onBlurEndDateEdit(newKAMActivationToDate);
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

    this._generalService.GetCustomerChangesKam().subscribe
    (
      data =>   
      {
        this.kamList = data;
        console.log(this.kamList);
        this.advanceTableForm.controls['oldCustomerkamEmployee'].setValidators([Validators.required,
          this.customerKamEmployeeNameValidator(this.kamList)]);
        this.advanceTableForm.controls['oldCustomerkamEmployee'].updateValueAndValidity(); 
        this.filteredinstructedByOptionss = this.advanceTableForm.controls['oldCustomerkamEmployee'].valueChanges.pipe(
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
    if (selectedEmployee && type === 'oldKam') 
    {
      this.getemployeeIDTitles(KamName?.employeeID);
    }
    else if (selectedEmployee && type === 'newKam') {
      this.getkamemployeeIDTitles(KamName?.employeeID);
    }
  }
  getemployeeIDTitles(oldKAMID: any)
  {
    this.oldKAMID=oldKAMID;
         this.advanceTableForm.patchValue({oldKAMID: this.oldKAMID});

  }


///newkamcustomer//


  InitCustomerkamNewEmployee()
  {

    this._generalService.GetEmployees().subscribe
    (
      data =>   
      {
        this.EmployeeList = data;
        console.log(this.EmployeeList);
        this.advanceTableForm.controls['newCustomerkamEmployee'].setValidators([Validators.required,
          this.employeeNameValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['newCustomerkamEmployee'].updateValueAndValidity(); 
        this.filteredinstructedByOptions = this.advanceTableForm.controls['newCustomerkamEmployee'].valueChanges.pipe(
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
    if (selectedEmployee && type === 'newKam') 
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

 this.advanceTableForm.patchValue({ newKAMID: this.employeeID });
}

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerKeyAccountManagerID: [this.advanceTable.customerKeyAccountManagerID],
      newKAMActivationFromDate: [this.advanceTable.newKAMActivationFromDate,[Validators.required, this._generalService.dateValidator()]],
      // newKAMActivationToDate: [this.advanceTable.newKAMActivationToDate],
      oldCustomerkamEmployee:[this.advanceTable.oldCustomerkamEmployee],
       newCustomerkamEmployee:[this.advanceTable.newCustomerkamEmployee],
        oldKAMID: [this.advanceTable.oldKAMID],
        newKAMID: [this.advanceTable.employeeID],
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
    console.log(this.advanceTableForm.value);
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
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
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
    heightAuto: false,
    customClass: {
      container: 'swal2-popup-high-zindex'
    }
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



