// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DutySACService } from '../../dutySAC.service';
import { FormControl, Validators, FormGroup, FormBuilder,ValidationErrors,AbstractControl,ValidatorFn} from '@angular/forms';
import { DutySACModel } from '../../dutySAC.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DutySACCDropDown } from '../../dutySACDropDownModel';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  standalone: true,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutySACModel;
  gstPercentageID: number;
  filteredSACNumberOptions:Observable<DutySACCDropDown[]>;
  public SACList:DutySACCDropDown[]=[];
  saveDisabled:boolean=true;

  public EmployeesList?: EmployeeDropDown[] = [];
  filteredEmployeesOptions: Observable<EmployeeDropDown[]>;
  changedByID: any;
  //dutySlipID: number=133;

  employeeDataSource:EmployeeDropDown[] | [];
  DutySlipID: any;
  sacid: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySACService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty SAC';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Duty SAC';
          this.advanceTable = new DutySACModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.DutySlipID=data.dutySlipID;
        if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        {
          this.isSaveAllowed = true;
        } 
        else
        {
          this.isSaveAllowed = false;
        }
  }
  
  ngOnInit()
  {
    if(this.action === 'edit' )
      {
        this.advanceTableForm.controls['reasonOfChange'].disable();
      }
    this.InitSAC();
    this.InitEmployee();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySACID: [this.advanceTable.dutySACID],
      dutySlipID: [this.advanceTable.dutySlipID],
      sacid: [this.advanceTable.sacid],
      sacNumber: [this.advanceTable.sacNumber],
      changedByID: [this.advanceTable.changedByID],
      changedByName: [this.advanceTable.changedByName],
      reasonOfChange: [this.advanceTable.reasonOfChange],
      changeDateTime: [this.advanceTable.changeDateTime],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  //---------SAC Number-----------------

 SACValidator(SACList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = SACList.some(group => group.sacNumber.toLowerCase() === value);
      return match ? null : { sacNumberInvalid: true };
    };
  }
InitSAC(){
  this._generalService.GetSAC().subscribe(
    data=>
    {
      this.SACList=data;      
     this.advanceTableForm.controls['sacNumber'].setValidators([Validators.required,
          this.SACValidator(this.SACList)]);
        this.advanceTableForm.controls['sacNumber'].updateValueAndValidity();
      this.filteredSACNumberOptions = this.advanceTableForm.controls['sacNumber'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterSAC(value || ''))
      ); 
    });
}

private _filterSAC(value: string): any {
  const filterValue = (value).toLowerCase();
  return this.SACList.filter(
    data => 
      {
        return data.sacNumber.toLowerCase().includes(filterValue);
      });
}

OnSACSelect(selectedSAC: string)
{
  const SACName = this.SACList.find(
  data => data.sacNumber === selectedSAC
  );
  if (selectedSAC) 
  {
    this.getSACID(SACName.sacid);
  }
}

getSACID(sacid:any)
{
  this.sacid=sacid;
  this.advanceTableForm.patchValue({sacid:this.sacid});
}

//----------- Employee -----------
InitEmployee()
{
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>
    {
      this.employeeDataSource=data;
      this.advanceTableForm.controls["changedByName"].disable();
      this.advanceTableForm.patchValue({changedByName:this.employeeDataSource[0].firstName+" "+this.employeeDataSource[0].lastName});
      this.advanceTableForm.patchValue({changedByID:this.employeeDataSource[0].employeeID});
    }
  );
}

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
    this.advanceTableForm.patchValue({changedByID:this.employeeDataSource[0].employeeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
      this.showNotification(
        'snackbar-success',
        'Duty SAC Created...!!!',
        'bottom',
        'center'
      );  
      this.saveDisabled=true;
      this.dialogRef.close(true);
    },
    error =>
    {
      this._generalService.sendUpdate('DutySACAll:DutySACView:Failure');//To Send Updates  
      this.saveDisabled=true;
    }
    )
  }

  public Put(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID || this.advanceTable.dutySlipID});
    this.advanceTableForm.patchValue({changedByID:this.employeeDataSource[0].employeeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
      this._generalService.sendUpdate('DutySACUpdate:DutySACView:Success');//To Send Updates  
      this.saveDisabled=true;
      this.dialogRef.close(true);
    },
    error =>
    {
     this._generalService.sendUpdate('DutySACAll:DutySACView:Failure');//To Send Updates  
     this.saveDisabled=true;
    }
    )
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


