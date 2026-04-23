// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LumpsumRateDetailsService } from '../../lumpsumRateDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { LumpsumRateDetails} from '../../lumpsumRateDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  // Rename to avoid NG0300 collision with the embedded LumpsumRateDetailsComponent
  // (same selector registered in two different components inside the newForm
  // module scope -> "Multiple components match node with tagname").
  selector: 'app-lumpsumRateDetails-dialog',
  templateUrl: './lumpsumRateDetails.component.html',
  styleUrls: ['./lumpsumRateDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class LumpsumRateDetailsDialogComponent 
{
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: LumpsumRateDetails;
  employeesID: any;
  reservationDiscountDetailsByEmployeesID: any;
  ReservationID: any;

  constructor(
  public dialogRef: MatDialogRef<LumpsumRateDetailsDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: LumpsumRateDetailsService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit lumpsum Rate';       
          this.dialogTitle ='Lumpsum Rate';
          this.advanceTable = data.advanceTable;
          this.advanceTable.lumpsumRateApprovedByEmployee = data.advanceTable.firstName +" "+ data.advanceTable.lastName;
          this.ImagePath = this.advanceTable.attachment;
      
        } else 
        {
          //this.dialogTitle = 'Create lumpsum Rate';
          this.dialogTitle = 'Lumpsum Rate';
          this.advanceTable = new LumpsumRateDetails({});
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
      reservationLumpsumRateID: [this.advanceTable.reservationLumpsumRateID],
      reservationID: [this.advanceTable.reservationID],
      activationStatus: [this.advanceTable.activationStatus],
      lumpsumRatePercentage: [this.advanceTable.lumpsumRatePercentage],
      lumpsumRateApprovedByEmployeeID: [this.advanceTable.lumpsumRateApprovedByEmployeeID],
      attachment:[this.advanceTable.attachment],
      lumpsumRateApprovedByEmployee:[this.advanceTable.lumpsumRateApprovedByEmployee],
      
    });
  }
  InitEmployee(){
    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
        this.advanceTableForm.controls['lumpsumRateApprovedByEmployee'].setValidators([Validators.required,this.ApprovedByEmployeeValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['lumpsumRateApprovedByEmployee'].updateValueAndValidity();
        this.filteredCreatedByOptionss = this.advanceTableForm.controls['lumpsumRateApprovedByEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      }
    );
  }

  ApprovedByEmployeeValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(data => ((data.firstName + ' ' + data.lastName).toLowerCase()) === value );
        return match ? null : { lumpsumRateApprovedByEmployeeInvalid: true };
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
  
  getemployee(employeeID: any) {
    
    this.reservationDiscountDetailsByEmployeesID=employeeID;
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
    debugger;
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    this.advanceTableForm.patchValue({lumpsumRateApprovedByEmployeeID:this.reservationDiscountDetailsByEmployeesID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
      this.showNotification(
        'snackbar-success',
        'Lumpsum Rate Details Created...!!!',
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
  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    this.advanceTableForm.patchValue({lumpsumRateApprovedByEmployeeID:this.advanceTable.lumpsumRateApprovedByEmployeeID  });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
     this.showNotification(
        'snackbar-success',
        'Lumpsum Rate Details Update...!!!',
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
     this.advanceTableForm.patchValue({ attachment: this.ImagePath })
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


