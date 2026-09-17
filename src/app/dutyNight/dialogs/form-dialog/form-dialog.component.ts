// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { DutyNight } from '../../dutyNight.model';
import { DutyNightService } from '../../dutyNight.service';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-duty-night-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutyNightFormDialogComponent {
  saveDisabled: boolean = true;
  employeeDataSource: EmployeeDropDown[] | [];
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyNight;
  dutySlipID: number;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DutyNightFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DutyNightService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    if (this.action === 'edit') {
      this.dialogTitle = 'Duty Night';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'Duty Night';
      this.advanceTable = new DutyNight({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    this.dutySlipID = data.dutySlipID;
    if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') {
      this.isSaveAllowed = true;
    } else {
      this.isSaveAllowed = false;
    }
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      dutyNightID: [this.advanceTable.dutyNightID || ''],
      dutySlipID: [this.advanceTable.dutySlipID || ''],
      numberOnNights: [this.advanceTable.numberOnNights || '', [Validators.required, Validators.min(0)]],
      changedByID: [this.advanceTable.changedByID || ''],
      firstName: [this.advanceTable.firstName || ''],
      lastName: [this.advanceTable.lastName || ''],
      executive: [this.advanceTable.firstName + '' + this.advanceTable.lastName],
      changeDateTime: [this.advanceTable.changeDateTime || ''],
      reasonOfChange: [this.advanceTable.reasonOfChange || ''],
      activationStatus: [this.advanceTable.activationStatus || ''],
    });
  }

  ngOnInit() {
    this.getEmployee();
    this.advanceTableForm.get('changeDateTime')?.disable();
  }

  getEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = data;
        this.advanceTableForm.controls['executive'].disable();
        this.advanceTableForm.patchValue({ executive: this.employeeDataSource[0].firstName + ' ' + this.employeeDataSource[0].lastName });
        this.advanceTableForm.patchValue({ changedByID: this.employeeDataSource[0].employeeID });
      }
    );
  }

  submit() { }

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();
    } else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.advanceTableForm.patchValue({ dutySlipID: this.dutySlipID });
    this.advanceTableForm.patchValue({ changedByID: this.employeeDataSource[0].employeeID });
    this.advanceTableForm.patchValue({ activationStatus: true });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.showNotification('snackbar-success', 'Duty Night Created...!!!', 'bottom', 'center');
          this.saveDisabled = true;
          this.dialogRef.close(true);
        },
        error => {
          const message = error?.error?.message || 'Unable to create Duty Night record.';
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          this._generalService.sendUpdate('DutyNightAll:DutyNightView:Failure');
          this.saveDisabled = true;
        }
      );
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void {
    this.advanceTableForm.patchValue({ dutySlipID: this.dutySlipID || this.advanceTable.dutySlipID });
    this.advanceTableForm.patchValue({ activationStatus: true });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this._generalService.sendUpdate('DutyNightUpdate:DutyNightView:Success');
          this.saveDisabled = true;
          this.dialogRef.close(true);
        },
        error => {
          const message = error?.error?.message || 'Unable to update Duty Night record.';
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          this._generalService.sendUpdate('DutyNightAll:DutyNightView:Failure');
          this.saveDisabled = true;
        }
      );
  }

  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }
}
