// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { CustomerCustomerGroupDropDown } from 'src/app/customer/customerCustomerGroupDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { ChangeBookerModel } from 'src/app/changeBooker/changeBooker.model';
import { ChangeBookerService } from 'src/app/changeBooker/changeBooker.service';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ChangeBookerFormDialogComponent 
{
  showError?:string;
  action?:string;
  dialogTitle:string;
  advanceTableForm:FormGroup;
  advanceTable?:ChangeBookerModel;
  saveDisabled:boolean=true;

  public PassengerList?:CustomerPersonDropDown[] = [];
  filteredPassengerOptions?:Observable<CustomerPersonDropDown[]>;
  NewRecordID:any;
  PreviousRecordID:any;
  PreviousRecordName:string;
  CustomerGroupID:any;
  ReservationID:any;

    constructor(
      public dialogRef: MatDialogRef<ChangeBookerFormDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data:any,
      public advanceTableService:ChangeBookerService,
      private fb:FormBuilder,
      public _generalService:GeneralService,
      private snackBar:MatSnackBar,)
    {
      // Set the defaults
      this.dialogTitle = 'Change Booker';
      this.ReservationID = data?.reservationID;
      this.CustomerGroupID = data?.customerGroupID;
      this.PreviousRecordID = data?.primaryBookerID;
      this.PreviousRecordName = data?.primaryBooker;
      this.advanceTableForm = this.createContactForm();
    }

    public ngOnInit(): void
    {
      this.advanceTableForm.get('previousRecordName')?.disable();
      this.InitPassenger();
    }
  
    createContactForm(): FormGroup 
    {
      return this.fb.group(
      {
        //reservationChangeLogID:[this.advanceTable?.reservationChangeLogID],
        reservationID:[this.ReservationID],
        changeType:['Booker'],
        previousRecordID:[this.PreviousRecordID],
        previousRecordName:[this.PreviousRecordName],
        newRecordID:[this.advanceTable?.newRecordID],
        newRecordName:[this.advanceTable?.newRecordName],
        reason:[this.advanceTable?.reason || ''],
      });
    }


    submit(){}
  
    showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) 
    {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName
      });
    }

    public Post(): void
    {    
      this.saveDisabled = false;
      this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => 
      {
        this.dialogRef.close();
        this.showNotification(
          'snackbar-success',
          'Passenger Changed Successfully...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(true); 
        this.saveDisabled = true;        
      },
      error =>
      {
       this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true; 
      })
    }
  

    InitPassenger()
    {
      this._generalService.GetCPForPassenger(this.CustomerGroupID).subscribe(
      data=>
      {
        this.PassengerList=data;
        this.advanceTableForm.controls['newRecordName'].setValidators([Validators.required,this.PassengerEmployeeValidator(this.PassengerList)]);
        this.advanceTableForm.controls['newRecordName'].updateValueAndValidity();
        this.filteredPassengerOptions = this.advanceTableForm.controls['newRecordName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPassenger(value || ''))
        ); 
      });
    }

    private _filterPassenger(value: string): any {
      const filterValue = value.toLowerCase();
      return this.PassengerList?.filter(
        data => 
        {
          return data.customerPersonName.toLowerCase().includes(filterValue);
        }
      );
    }

    PassengerEmployeeValidator(PassengerList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PassengerList.some(data => ((data.customerPersonName + '-' + data.gender + '-' + data.importance + '-' + data.phone + '-' + data.customerDepartment + '-' + data.customerDesignation + '-' + data.customerName).toLowerCase()) === value);
        return match ? null : { newRecordNameInvalid: true };
      };
    }  
    onPassengerSelected(selectedStateName: string) 
    {
      const selectedState = this.PassengerList?.find(
        data => data.customerPersonName +'-'+ data.gender +'-'+ data.importance +'-'+ data.phone +'-'+
                data.customerDepartment +'-'+ data.customerDesignation +'-'+ data.customerName === selectedStateName);
      if (selectedState) 
      {
        this.getPassengerID(selectedState.customerPersonID);
      }
    }
    getPassengerID(customerPersonID:any)
    {
      this.NewRecordID = customerPersonID;
      this.advanceTableForm.patchValue({newRecordID:this.NewRecordID})
    }
      
}


