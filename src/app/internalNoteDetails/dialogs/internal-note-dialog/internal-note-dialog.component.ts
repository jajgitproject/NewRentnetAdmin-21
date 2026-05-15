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
  isSaving = false;
  buttonDisabled = false;
  status = '';
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
    
    this.status = this.resolveStatus(data);
    this.buttonDisabled = !this.isChangesAllowed();
    this.advanceTableForm = this.createContactForm();
  }

  get statusMessage(): string {
    return this.status || '';
  }

  private resolveStatus(data: any): string {
    try {
      const raw = data?.status?.status ?? data?.status ?? data ?? '';
      if (typeof raw === 'string') {
        return raw.trim();
      }
      if (raw && typeof raw.status === 'string') {
        return raw.status.trim();
      }
      if (raw && typeof raw.message === 'string') {
        return raw.message.trim();
      }
      return '';
    } catch {
      return '';
    }
  }

  private isChangesAllowed(): boolean {
    return (this.status || '').toLowerCase().trim() === 'changes allow';
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
  private resolveEmployeeIdForSave(): number | null {
    const selected = Number(this.reservationBillingInstructionByEmployeesID);
    if (selected > 0) {
      return selected;
    }
    const existing = Number(this.advanceTable?.reservationInternalNoteByEmployeeID);
    if (existing > 0) {
      return existing;
    }
    const loggedIn = Number(this._generalService.getUserID());
    return loggedIn > 0 ? loggedIn : null;
  }

  private patchEmployeeIdForSave(): boolean {
    const employeeId = this.resolveEmployeeIdForSave();
    if (!employeeId) {
      this.showNotification(
        'snackbar-danger',
        'Unable to resolve employee for Internal Note By. Please select an employee or sign in again.',
        'bottom',
        'center'
      );
      return false;
    }
    this.advanceTableForm.patchValue({ reservationInternalNoteByEmployeeID: employeeId });
    return true;
  }

  public Post(): void {
    if (!this.patchEmployeeIdForSave()) {
      this.isSaving = false;
      return;
    }
    this.advanceTableForm.patchValue({ reservationID: this.ReservationID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.showNotification(
            'snackbar-success',
            'Internal Note Created...!!!',
            'bottom',
            'center'
          );
          this.isSaving = false;
          this.dialogRef.close(true);
        },
        error => {
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            'Operation Failed...!!!';
          this.showNotification('snackbar-danger', msg, 'bottom', 'center');
          this.isSaving = false;
        }
      );
  }
  public Put(): void {
    if (!this.patchEmployeeIdForSave()) {
      this.isSaving = false;
      return;
    }
    this.advanceTableForm.patchValue({ reservationID: this.advanceTable.reservationID });

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
           this.showNotification(
            'snackbar-success',
            'Internal Note Updated...!!!',
            'bottom',
            'center'
          );
          this.isSaving = false;
          this.dialogRef.close(true);
        },
        error => {
          const msg =
            error?.error?.message ||
            (typeof error?.error === 'string' ? error.error : null) ||
            'Operation Failed...!!!';
          this.showNotification('snackbar-danger', msg, 'bottom', 'center');
          this.isSaving = false;
        }
      );
  }
  onSaveClick(): void {
    if (this.buttonDisabled) {
      this.showNotification(
        'snackbar-warning',
        this.statusMessage || 'Changes are not allowed for this reservation.',
        'bottom',
        'center'
      );
      return;
    }
    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.showNotification(
        'snackbar-warning',
        'Please complete required fields.',
        'bottom',
        'center'
      );
      return;
    }
    this.confirmAdd();
  }

   public confirmAdd(): void {
    this.isSaving = true;
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
        this.advanceTableForm.controls['reservationInternalNoteByEmployee'].setValidators([
          this.InternalNoteByEmployeeValidator(this.EmployeeList),
        ]);
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
        const raw = control.value;
        if (!raw || String(raw).trim() === '') {
          return null;
        }
        const value = String(raw).toLowerCase();
        const match = EmployeeList.some(
          (data) => ((data.firstName + ' ' + data.lastName).toLowerCase()) === value
        );
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


