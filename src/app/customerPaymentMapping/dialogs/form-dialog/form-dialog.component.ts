// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerPaymentMapping } from '../../customerPaymentMapping.model';
import { CustomerPaymentMappingService } from '../../customerPaymentMapping.service';
import { ModeOfPaymentDropDown } from 'src/app/modeOfPayment/modeOfPaymentDropDown.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponent {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerPaymentMapping;
  public ModeOfPaymentList?: ModeOfPaymentDropDown[] = [];
  filteredModeOptions: Observable<ModeOfPaymentDropDown[]>;
  customerID: number;
  modeOfPaymentID: number[] = [];
  existPaymentMessage: boolean = false;
  isSaveDisabled: boolean = false;
  saveDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerPaymentMappingService,
    private fb: FormBuilder,
    public _generalService: GeneralService
  ) {
    this.action = data.action;
    this.advanceTable = data.advanceTable;
    this.advanceTableForm = this.createContactForm();
    if (this.action === 'edit') {
      this.dialogTitle = 'Customer Payment Mapping';
      this.advanceTableForm.patchValue({ modeOfPayment: this.advanceTable?.modeOfPayment });
    } else {
      this.dialogTitle = 'Customer Payment Mapping';
      this.advanceTable = new CustomerPaymentMapping({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    this.customerID = Number(data.CustomerID);
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      customerPaymentMappingID: [this.advanceTable?.customerPaymentMappingID],
      modeOfPaymentID: [[], Validators.required],
      customerID: [this.advanceTable?.customerID],
      modeOfPayment: [this.advanceTable?.modeOfPayment],
      activationStatus: [this.advanceTable?.activationStatus]
    });
  }

  ngOnInit() {
    this.InitModeOfPayment();
    if (this.action === 'edit') {
      this.InitModeOfPaymentEdit();
    }
  }

  InitModeOfPayment() {
    this._generalService.getPaymentModeByCustomerID(this.customerID).subscribe(data => {
      if (data) {
        this.ModeOfPaymentList = data;
        this.existPaymentMessage = false;
      } else {
        this.existPaymentMessage = true;
        this.advanceTableForm.controls['modeOfPaymentID'].disable();
        this.isSaveDisabled = true;
      }
    });
  }

  modeOfPaymentValidator(ModeOfPaymentList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = ModeOfPaymentList.some(group => group.modeOfPayment.toLowerCase() === value);
      return match ? null : { invalidModeOfPaymentSelection: true };
    };
  }

  InitModeOfPaymentEdit() {
    this._generalService.getPaymentModeByCustomerID(this.customerID).subscribe(data => {
      if (data) {
        this.ModeOfPaymentList = data;
        this.advanceTableForm.controls['modeOfPayment'].setValidators([
          Validators.required,
          this.modeOfPaymentValidator(this.ModeOfPaymentList)
        ]);
        this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
        this.filteredModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterMode(value || ''))
        );
      } else {
        this.existPaymentMessage = true;
        this.advanceTableForm.controls['modeOfPayment'].disable();
      }
    });
  }

  private _filterMode(value: string): any {
    const filterValue = value.toLowerCase();
    return this.ModeOfPaymentList.filter(customer => {
      return customer.modeOfPayment.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  getModeID(modeOfPaymentID: any) {
    this.modeOfPaymentID = modeOfPaymentID;
    this.advanceTableForm.patchValue({ modeOfPaymentID: this.modeOfPaymentID || this.advanceTable.modeOfPaymentID });
  }

  submit() {}

  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();
    } else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }

  public Post(): void {
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerPaymentMappingCreate:CustomerPaymentMappingView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('CustomerPaymentMappingAll:CustomerPaymentMappingView:Failure');
        this.saveDisabled = true;
      }
    );
  }

  public Put(): void {
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue()).subscribe(
      () => {
        this.dialogRef.close();
        this._generalService.sendUpdate('CustomerPaymentMappingUpdate:CustomerPaymentMappingView:Success');
        this.saveDisabled = true;
      },
      () => {
        this._generalService.sendUpdate('CustomerPaymentMappingAll:CustomerPaymentMappingView:Failure');
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
