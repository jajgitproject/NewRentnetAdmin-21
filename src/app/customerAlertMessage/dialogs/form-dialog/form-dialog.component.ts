// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CustomerAlertMessage, CustomerAlertMessageTypeForDropDown } from '../../customerAlertMessage.model';
import { CustomerAlertMessageService } from '../../customerAlertMessage.service';
import { CustomerDropDown } from 'src/app/supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerAlertMessage;

  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  customerID: any;
  
  public CustomerAlertMessageTypeList?: CustomerAlertMessageTypeForDropDown[] = [];
  filteredCustomerAlertMessageTypeOptions: Observable<CustomerAlertMessageTypeForDropDown[]>;
  customerAlertMessageTypeID: any;

  public EmployeeList?: EmployeeDropDown[] = [];
  filteredinstructedByOptions: Observable<EmployeeDropDown[]>;
  employeeID: any;
  customerName: any;
  //CustomerID: any;
  saveDisabled:boolean = true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerAlertMessageService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    // this.employeeName=data.CustomerName;
    // this.customerID=data.CustomerID;
    
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Alert Message For';       
          this.advanceTable = data.advanceTable;
          this.ImagePath=this.advanceTable.customerAlertMessageDocument;
          let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
          let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
          this.onBlurStartDateEdit(startDate);
          this.onBlurEndDateEdit(endDate);
        } else 
        {
          this.dialogTitle = 'Customer Alert Message For';
          this.advanceTable = new CustomerAlertMessage({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.customerName=data.CustomerName;
        this.customerID=data.CustomerID;
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerAlertMessageID: [this.advanceTable.customerAlertMessageID],
      customerAlertMessage: [this.advanceTable.customerAlertMessage],
      customerID:[this.advanceTable.customerID],
      customerName: [this.advanceTable.customerName],
      customerAlertMessageTypeID: [this.advanceTable.customerAlertMessageTypeID],
      customerAlertMessageType: [this.advanceTable.customerAlertMessageType],
      instructedBy: [this.advanceTable.instructedBy],
      employeeName: [this.advanceTable.employeeName],
      startDate: [this.advanceTable.startDate,[Validators.required, this._generalService.dateValidator()]],
      endDate: [this.advanceTable.endDate,[Validators.required, this._generalService.dateValidator()]],
      customerAlertMessageDocument:[this.advanceTable.customerAlertMessageDocument],
      activationStatus: [this.advanceTable.activationStatus],
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
      } 
    else 
    {
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

ngOnInit()
{
  this.advanceTableForm.patchValue({customerName:this.customerName});
  //this.InitCustomer();
  this.InitCustomerAlertMessageType();
  this.InitEmployee();
}

//---------- Customer ----------
// InitCustomer(){
//   this._generalService.getCustomer().subscribe(
//     data=>
//     {
//       this.CustomerList=data;
//       this.advanceTableForm.controls['customerName'].updateValueAndValidity();
//       this.filteredCustomerOptions =this.advanceTableForm.controls['customerName'].valueChanges.pipe(
//         startWith(""),
//         map(value => this._filterCustomer(value || ''))
//       ); 
//     });
// }

// private _filterCustomer(value: string): any {
// const filterValue = value.toLowerCase();
// return this.CustomerList.filter(
//   data => 
//   {
//     return data.customerName.toLowerCase().indexOf(filterValue)===0;
//   });
// }

// getCustomerID(customerID: any)
// {
//   this.customerID=customerID;
// }


//----------- Instructed By ----------
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
      this.advanceTableForm.controls['employeeName'].setValidators([Validators.required,
        this.employeeNameValidator(this.EmployeeList)
      ]);
      this.advanceTableForm.controls['employeeName'].updateValueAndValidity();
      this.filteredinstructedByOptions = this.advanceTableForm.controls['employeeName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filtersearchinstructed(value || ''))
      );
    });
}
private _filtersearchinstructed(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.EmployeeList.filter(
    data => 
    {
      //return customer.firstName.toLowerCase().includes(filterValue);
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      return fullName.includes(filterValue);
    });
}
OnInstructedBySelect(selectedInstructedBy: string)
{
  const InstructedByName = this.EmployeeList.find(
    data => `${data.firstName} ${data.lastName}` === selectedInstructedBy
  );
  if (selectedInstructedBy) 
  {
    this.getEmployeeID(InstructedByName.employeeID);
  }
}
getEmployeeID(employeeID: any) 
{   
  this.employeeID=employeeID;
}

/////////////////for Image Upload////////////////////////////
public response: { dbPath: '' };
public ImagePath: string = "";

public uploadFinished = (event) => 
{
  this.response = event;
  this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  this.advanceTableForm.patchValue({customerAlertMessageDocument:this.ImagePath})
}

//---------- Customer Alert Message Type ----------
InitCustomerAlertMessageType(){
  this._generalService.getCustomerAlertMessgaeType().subscribe(
    data=>
    {
      this.CustomerAlertMessageTypeList=data;
      this.filteredCustomerAlertMessageTypeOptions =this.advanceTableForm.controls['customerAlertMessageType'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterCustomerAlertMessageType(value || ''))
      ); 
    });
}

private _filterCustomerAlertMessageType(value: string): any {
const filterValue = value.toLowerCase();
// if (!value || value.length < 3) {
//       return [];   
//     }
return this.CustomerAlertMessageTypeList.filter(
  data => 
  {
    return data.customerAlertMessageType.toLowerCase().includes(filterValue);
  });
}
OnMsgTypeSelect(selectedMsgType: string)
{
  const MsgTypeName = this.CustomerAlertMessageTypeList.find(
    data => data.customerAlertMessageType === selectedMsgType
  );
  if (selectedMsgType) 
  {
    this.getCustomerAlertMessageTypeID(MsgTypeName.customerAlertMessageTypeID);
  }
}
getCustomerAlertMessageTypeID(customerAlertMessageTypeID: any)
{
  this.customerAlertMessageTypeID=customerAlertMessageTypeID;
}

submit() {}

  onNoClick(): void 
  {
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({customerID:this.customerID});
    this.advanceTableForm.patchValue({customerAlertMessageTypeID:this.customerAlertMessageTypeID});
    this.advanceTableForm.patchValue({instructedBy:this.employeeID});
    this.advanceTableForm.patchValue({customerAlertMessageTypeID:this.customerAlertMessageTypeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('CustomerAlertMessageCreate:CustomerAlertMessageView:Success');//To Send Updates 
      this.saveDisabled = true; 
    
  },
    error =>
    {
       this._generalService.sendUpdate('CustomerAlertMessageAll:CustomerAlertMessageView:Failure');//To Send Updates  
       this.saveDisabled = true;
    })
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({customerID:this.customerID || this.advanceTable.customerID});
    this.advanceTableForm.patchValue({customerAlertMessageTypeID:this.customerAlertMessageTypeID || this.advanceTable.customerAlertMessageTypeID});
    this.advanceTableForm.patchValue({instructedBy:this.employeeID || this.advanceTable.instructedBy});
    this.advanceTableForm.patchValue({customerAlertMessageTypeID:this.customerAlertMessageTypeID || this.advanceTable.customerAlertMessageTypeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('CustomerAlertMessageUpdate:CustomerAlertMessageView:Success');//To Send Updates  
      this.saveDisabled = true; 
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerAlertMessageAll:CustomerAlertMessageView:Failure');//To Send Updates 
     this.saveDisabled = true; 
    })
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



