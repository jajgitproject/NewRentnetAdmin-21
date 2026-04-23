// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Reservation } from 'src/app/reservation/reservation.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InternalNote } from '../../internalNoteDetails.model';
import { InternalNoteDetailsService } from '../../internalNoteDetails.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  standalone: false,
    selector: 'app-internal-note-dialog',
    templateUrl: './internal-note-dialog.component.html',
    styleUrls: ['./internal-note-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class InternalNoteDialogComponent {
  saveDisabled:boolean=true;
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: InternalNote;
  ReservationID: any;
  reservationBillingInstructionByEmployeesID: any;
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredCreatedByOptionss: Observable<EmployeeDropDown[]>;

  constructor(
    public dialogRef: MatDialogRef<InternalNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: InternalNoteDetailsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit')
    {
      //this.dialogTitle = 'Edit Internal Note';
      this.dialogTitle = 'Internal Note';
      this.advanceTable = data.advanceTable;
      this.ImagePath = this.advanceTable.reservationInternalNoteAttachment;
      this.advanceTable.reservationInternalNoteByEmployee=this.advanceTable.firstName+" "+this.advanceTable.lastName;
      //this.advanceTableForm.patchValue({reservationInternalNote:data.reservationInternalNote});
    } 
    else
    {
      this.dialogTitle = 'Internal Note';
      this.advanceTable = new InternalNote({});
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
  public ngOnInit(): void
  {
   this.InitEmployee(); 
  }
 
  createContactForm(): FormGroup {
    return this.fb.group(
      {
        reservationInternalNoteID: [this.advanceTable.reservationInternalNoteID],
        reservationID:[this.advanceTable.reservationID],
        reservationInternalNote: [this.advanceTable.reservationInternalNote],
        reservationInternalNoteAttachment: [this.advanceTable.reservationInternalNoteAttachment],
        reservationInternalNoteByEmployeeID: [this.advanceTable.reservationInternalNoteByEmployeeID],
        activationStatus: [this.advanceTable.activationStatus],
        reservationInternalNoteByEmployee:[this.advanceTable.reservationInternalNoteByEmployee],
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
    this.advanceTableForm.patchValue({reservationInternalNoteByEmployeeID:this.reservationBillingInstructionByEmployeesID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {


          this.showNotification(
            'snackbar-success',
            'Internal Note Created...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled=true; 
          //this._generalService.sendUpdate('InternalNoteCreate:InternalNoteView:Success');//To Send Updates  
          this.dialogRef.close();

        },
        error => {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled=true; 
          //this._generalService.sendUpdate('InternalNoteAll:InternalNoteView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.advanceTableForm.patchValue({reservationID:this.advanceTable.reservationID});
    this.advanceTableForm.patchValue({reservationInternalNoteByEmployeeID:this.reservationBillingInstructionByEmployeesID || this.advanceTable.reservationInternalNoteByEmployeeID});

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          
           this.showNotification(
            'snackbar-success',
            'Internal Note Updated...!!!',
            'bottom',
            'center'
          );//To Send Updates 
          this.saveDisabled=true; 
          this.dialogRef.close(); 
        },
        error => {
          //this._generalService.sendUpdate('InternalNoteAll:InternalNoteView:Failure');//To Send Updates  
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
   public confirmAdd(): void {
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
   InitEmployee(){

    this._generalService.GetEmployeesForVehicleCategory().subscribe
    (
      data =>   
      {
        this.EmployeeList = data; 
        this.advanceTableForm.controls['reservationInternalNoteByEmployee'].setValidators([Validators.required,this.InternalNoteByEmployeeValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['reservationInternalNoteByEmployee'].updateValueAndValidity();
        this.filteredCreatedByOptionss = this.advanceTableForm.controls['reservationInternalNoteByEmployee'].valueChanges.pipe(
          startWith(""),
          map(value => this._filtersearchinstructed(value || ''))
        );
      }
    );
  }

  InternalNoteByEmployeeValidator(EmployeeList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = EmployeeList.some(data => ((data.firstName + ' ' + data.lastName).toLowerCase()) === value );
        return match ? null : { reservationInternalNoteByEmployeeInvalid: true };
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
    this.reservationBillingInstructionByEmployeesID=employeeID;
  }
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";


  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ reservationInternalNoteAttachment: this.ImagePath })
  }
}


