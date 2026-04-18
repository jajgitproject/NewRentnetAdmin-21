// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DutyGSTPercentageService } from '../../dutyGSTPercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import { DutyGSTPercentage } from '../../dutyGSTPercentage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GSTPercentageDropDown } from '../../gSTPercentageDropDownModel';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyGSTPercentage;
  gstPercentageID: number;
  filteredGSTPercentageOptions:Observable<GSTPercentageDropDown[]>;
  public GSTPercentageList:GSTPercentageDropDown[]=[];
  //GSTPercentageList: any[] = [];

  public EmployeesList?: EmployeeDropDown[] = [];
  filteredEmployeesOptions: Observable<EmployeeDropDown[]>;
  changedByID: any;
  //dutySlipID: number=133;

  employeeDataSource:EmployeeDropDown[] | [];
  DutySlipID: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutyGSTPercentageService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;

        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty GST Percentage';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Duty GST Percentage';
          this.advanceTable = new DutyGSTPercentage({});
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
    this.InitGSTPercentage();
    this.InitEmployee();
    this.advanceTableForm.get('changeDateTime')?.disable();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutyGSTPercentageID: [this.advanceTable.dutyGSTPercentageID],
      dutySlipID: [this.advanceTable.dutySlipID],
      gstPercentageID: [this.advanceTable.gstPercentageID],
      gstPercentage: [this.advanceTable.gstPercentage],
      changedByID: [this.advanceTable.changedByID],
      changedByName: [this.advanceTable.changedByName],
      reasonOfChange: [this.advanceTable.reasonOfChange],
      changeDateTime: [this.advanceTable.changeDateTime],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }

  //---------GST Percentage Name-----------------

  GSTPercentageValidator(GSTPercentageList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = GSTPercentageList.some(group => group.gstPercentage.toLowerCase() === value);
      return match ? null : { gstPercentageInvalid: true };
    };
  }
InitGSTPercentage(){
  this._generalService.GetGSTPercentage().subscribe(
    data=>
    {
      this.GSTPercentageList=data;
      this.advanceTableForm.controls['gstPercentage'].setValidators([Validators.required,
          this.GSTPercentageValidator(this.GSTPercentageList)]);
      console.log(this.GSTPercentageList)
      this.filteredGSTPercentageOptions = this.advanceTableForm.controls['gstPercentage'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterGST(value || ''))
      ); 
    });
}

private _filterGST(value: string): any {
  const filterValue = (value).toLowerCase();
  return this.GSTPercentageList.filter(
    data => 
      {
        return data.gstPercentage.toLowerCase().includes(filterValue);
      });
}

OnGSTPercentageSelect(selectedGSTPercentage: string)
{
  const GSTPercentageName = this.GSTPercentageList.find(
  data => data.gstPercentage === selectedGSTPercentage
  );
  if (selectedGSTPercentage) 
  {
    this.getGSTPercentageID(GSTPercentageName.gstPercentageID);
  }
}

getGSTPercentageID(gstPercentageID:any) {
  this.gstPercentageID=gstPercentageID;
  this.advanceTableForm.patchValue({gstPercentageID:this.gstPercentageID});
}

//----------- Employee -----------
InitEmployee()
{
  this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
    data=>
    {
      this.employeeDataSource=data;
      console.log(this.employeeDataSource)
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
    debugger
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
    this.advanceTableForm.patchValue({changedByID:this.employeeDataSource[0].employeeID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
      
          this.dialogRef.close();
          this.showNotification(
            'snackbar-success',
            'Duty GST Percentage Create...!!!',
            'bottom',
            'center'
          );
         
      },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
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
          this.showNotification(
            'snackbar-success',
            'Duty GST Percentage Update...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled=true;
          this.dialogRef.close();
      },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
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


