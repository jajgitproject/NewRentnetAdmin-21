// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { BillingInstructionsDetailsService } from '../../billingInstructionsDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { BillingInstructionsDetails } from '../../billingInstructionsDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-billing-instruction-dialog',
  templateUrl: './billing-instruction-dialog.component.html',
  styleUrls: ['./billing-instruction-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class BillingInstructionDialogComponent 
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: BillingInstructionsDetails;
  employeeID: any;
  reservationBillingInstructionByEmployeesID: any;
  ReservationID: any;

  constructor(
  public dialogRef: MatDialogRef<BillingInstructionDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: BillingInstructionsDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Billing Instruction';       
          this.advanceTable = data.advanceTable;
          this.advanceTable.reservationBillingInstructionByEmployee = data.advanceTable.firstName +" "+ data.advanceTable.lastName;
          this.ImagePath = this.advanceTable.reservationBillingInstructionAttachment;
      
        } else 
        {
          this.dialogTitle = 'Billing Instruction';
          this.advanceTable = new BillingInstructionsDetails({});
          this.advanceTable.activationStatus=true;
          this.ReservationID = data.reservationID;
        }
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
          if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}
        this.advanceTableForm = this.createContactForm();
  }
  
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;
  public ngOnInit(): void
  {
   this.InitEmployee(); 
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationBillingInstructionID: [this.advanceTable.reservationBillingInstructionID],
      reservationID: [this.advanceTable.reservationID],
      activationStatus: [this.advanceTable.activationStatus],
      reservationBillingInstruction: [this.advanceTable.reservationBillingInstruction],
      reservationBillingInstructionAttachment: [this.advanceTable.reservationBillingInstructionAttachment],
      reservationBillingInstructionByEmployeeID: [this.advanceTable.reservationBillingInstructionByEmployeeID],
      reservationBillingInstructionByEmployee:[this.advanceTable.reservationBillingInstructionByEmployee],
      
    });
  }
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
        this.advanceTableForm.controls['reservationBillingInstructionByEmployee'].setValidators([Validators.required,this.BillingInstructionByEmployeeValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['reservationBillingInstructionByEmployee'].updateValueAndValidity();
        this.filteredCreatedByOptionss = this.advanceTableForm.controls['reservationBillingInstructionByEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      }
    );
  }
  BillingInstructionByEmployeeValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(data => ((data.firstName + ' ' + data.lastName).toLowerCase()) === value );
        return match ? null : { reservationBillingInstructionByEmployeeInvalid: true };
      };
    }

  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.EmployeeList.filter(
      customer => 
      {
        return customer.firstName.toLowerCase().includes(filterValue);
      }
    );
  }

  onEmployeeSelected(selectedStateName: string) {
    const selectedState = this.EmployeeList.find(
      data => data.firstName +' '+ data.lastName === selectedStateName
    );
  
    if (selectedState) {
      this.getemployee(selectedState.employeeID);
    }
  }
  
  getemployee(employeeID: any) 
  {
    this.reservationBillingInstructionByEmployeesID=employeeID;
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
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    this.advanceTableForm.patchValue({reservationBillingInstructionByEmployeeID:this.reservationBillingInstructionByEmployeesID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
      this.showNotification(
        'snackbar-success',
        'Billing Instructions Details Created Successfully...!!!',
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
    this.advanceTableForm.patchValue({reservationBillingInstructionByEmployeeID:this.advanceTable.reservationBillingInstructionByEmployeeID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
     this.showNotification(
        'snackbar-success',
        'Billing Instructions Details Update...!!!',
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
        'Opertion Failed...!!!',
        'bottom',
        'center'
      ); 
      this.saveDisabled=true;
    }
  )
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({ reservationBillingInstructionAttachment: this.ImagePath })
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


