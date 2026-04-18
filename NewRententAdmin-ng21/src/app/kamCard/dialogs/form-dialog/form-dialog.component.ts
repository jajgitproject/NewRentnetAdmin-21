// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { KamCardService } from '../../kamCard.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { KamCard } from '../../kamCard.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
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

export class FormDialogKCComponent implements OnInit
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: KamCard;
  public KAMEmployeeList?: EmployeeDropDown[] = [];
  filteredKAMEmployeeOptions: Observable<EmployeeDropDown[]>;
  employeeID: any;
  reservationID: any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogKCComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: KamCardService,
    private fb: FormBuilder,
    
   private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit KamCard';
          this.dialogTitle ='KAM';
          this.advanceTable = data.advanceTable;
          this.advanceTable.kamEmployee=this.advanceTable.firstName+" "+this.advanceTable.lastName;
        } else 
        {
          //this.dialogTitle = 'Create KamCard';
          this.dialogTitle = 'KAM';
          this.advanceTable = new KamCard({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
                   if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}
  }

  ngOnInit(): void 
  {
    this.InitKAMEmployee();
  }

  //-----------KAM Employee---------------

  InitKAMEmployee(){
    this._generalService.GetEmployees().subscribe(
      data=>
      {
        this.KAMEmployeeList=data;
        this.advanceTableForm.controls['kamEmployee'].setValidators([Validators.required,this.KAMEmployeeeeValidator(this.KAMEmployeeList)]);
        this.advanceTableForm.controls['kamEmployee'].updateValueAndValidity();
        this.filteredKAMEmployeeOptions = this.advanceTableForm.controls['kamEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.KAMEmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().includes(filterValue);
      }
    );
  }
  
  KAMEmployeeeeValidator(KAMEmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = KAMEmployeeList.some(data => ((data.firstName + ' ' + data.lastName).toLowerCase()) === value );
        return match ? null : { kamEmployeeInvalid: true };
      };
    }

  onEmployeeSelected(selectedStateName: string) {
    const selectedState = this.KAMEmployeeList.find(
      data => data.firstName +' '+ data.lastName === selectedStateName
    );
  
    if (selectedState) {
      this.getEmployeeID(selectedState.employeeID);
    }
  }

  getEmployeeID(employeeID: any) {
    this.employeeID=employeeID;
    this.advanceTableForm.patchValue({kamEmployeeID:this.employeeID});
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationKAMID: [this.advanceTable.reservationKAMID],
      reservationID: [this.advanceTable.reservationID],
      kamEmployeeID: [this.advanceTable.kamEmployeeID],
      kamEmployee: [this.advanceTable.kamEmployee],
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
    console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Kam Card Created ...!!!',
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
  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      { 
        this.showNotification(
          'snackbar-success',
          'Kam Card Update ...!!!',
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}


