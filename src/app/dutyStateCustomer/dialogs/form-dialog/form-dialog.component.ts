// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder,ValidationErrors,ValidatorFn,AbstractControl} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { DutyStateCustomer } from '../../dutyStateCustomer.model';
import { DutyStateCustomerService } from '../../dutyStateCustomer.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DutyStateCustomerFormDialogComponent 
{
  saveDisabled:boolean=true;
  showError: string;
  employeeDataSource:EmployeeDropDown[] | [];
  public StateList?: StatesDropDown[] = [];
  filteredStateOptions: Observable<StatesDropDown[]>;
  searchStateTerm: FormControl = new FormControl();
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable:  DutyStateCustomer;
  geoPointID: number;
  geoPointStateID: any;
  dutySlipID: number;
  tableRecord: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;
  customerID: number;
  gstNumber: string;
  StateName: string;
  constructor(
  public dialogRef: MatDialogRef<DutyStateCustomerFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService:  DutyStateCustomerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        this.customerID=data.CustomerID;
        if (this.action === 'edit') 
        {
          this.dialogTitle =' Duty State Customer'; 
          // this.tableRecord = data?.record[0];
          this.advanceTable = data.advanceTable;
          this.InitStates();
        } else 
        {
          this.dialogTitle = ' Duty State Customer';
          this.advanceTable = new  DutyStateCustomer({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.dutySlipID=data.dutySlipID;
        if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        {
          this.isSaveAllowed = true;
        } 
        else
        {
          this.isSaveAllowed = false;
        }
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyStateCustomerID: [this.advanceTable.dutyStateCustomerID || ''],
      dutySlipID: [this.advanceTable.dutySlipID || ''],
      stateID: [this.advanceTable.stateID || ''],
      changedByID: [this.advanceTable.changedByID || ''],
      firstName: [this.advanceTable.firstName || ''],
      lastName: [this.advanceTable.lastName || ''],
      executive:[this.advanceTable.firstName+''+this.advanceTable.lastName],
      state: [this.advanceTable.state || ''],
      changeDateTime: [this.advanceTable.changeDateTime || ''],
      reasonOfChange: [this.advanceTable.reasonOfChange || ''],
      activationStatus: [this.advanceTable.activationStatus || ''],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
ngOnInit() {
  this.getEmployee();
  this.InitStates();
  this.advanceTableForm.get('changeDateTime')?.disable();
  //  if(this.action === 'edit' )
  //   {
  //     this.advanceTableForm.controls["changeDateTime"].disable();
  //   }
}
stateValidator(StateList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = StateList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { stateInvalid: true };
    };
  }

InitStates() {
  this.advanceTableService.GetCustomerDutyStateForClosing(this.customerID).subscribe(
    data => {
      this.StateList = data;
      this.advanceTableForm.controls['state'].setValidators([Validators.required,
          this.stateValidator(this.StateList)]);
        this.advanceTableForm.controls['state'].updateValueAndValidity();
      this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterState(value || ''))
      );
    },
    error => {

    }
  );
}
private _filterState(value: string): any {
  const filterValue = value.toLowerCase();
  return this.StateList.filter(
    customer => 
    {
      return customer.geoPointName.toLowerCase().includes(filterValue);
    }
  );
}

OnStateSelect(selectedState: string)
{
  const StateName = this.StateList.find(
  data => data.geoPointName === selectedState
  );
  if (selectedState) 
  {
    this.getStateID(StateName.geoPointID);
     this.gstNumber = StateName.gstNumber;
     this.StateName= StateName.geoPointName;
  }
}

getStateID(geoPointID: any)
{
  this.geoPointStateID=geoPointID;
}
getEmployee()
{
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>
    {
      this.employeeDataSource=data;
      this.advanceTableForm.controls["executive"].disable();
      this.advanceTableForm.patchValue({executive:this.employeeDataSource[0].firstName+" "+this.employeeDataSource[0].lastName});
      this.advanceTableForm.patchValue({changedByID:this.employeeDataSource[0].employeeID});
    }
  );
}
  submit() 
  {
  }
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
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableForm.patchValue({changedByID:this.employeeDataSource[0].employeeID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      this.showNotification(
        'snackbar-success',
        'Duty State Customer Created...!!!',
        'bottom',
        'center'
      );  
      this.saveDisabled=true;
      this.dialogRef.close();
  },
    error =>
    {
       this._generalService.sendUpdate('DutyStateCustomerAll:DutyStateCustomerView:Failure');//To Send Updates 
       this.saveDisabled=true; 
    }
  )
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID || this.advanceTable.dutySlipID});
    this.advanceTableForm.patchValue({stateID:this.geoPointStateID || this.advanceTable.stateID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
      {
     
       this._generalService.sendUpdate('DutyStateCustomerUpdate:DutyStateCustomerView:Success');//To Send Updates  
       this.saveDisabled=true;
       this.dialogRef.close();
    
  },
    error =>
    {
       this._generalService.sendUpdate('DutyStateCustomerAll:DutyStateCustomerView:Failure');//To Send Updates  
       this.saveDisabled=true;
    }
  )
  }
  public confirmAdd(): void 
  {
    this.saveDisabled=false;
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


