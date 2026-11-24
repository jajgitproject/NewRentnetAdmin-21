// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RoleService } from '../../role.service';
import { AbstractControl, FormControl, ValidationErrors, Validators, FormGroup, FormBuilder} from '@angular/forms';

/** Yes/No mat-select: only empty/unset is invalid; explicit false is allowed. */
function requiredBoolSelect(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  return v === true || v === false ? null : { required: true };
}
import { Role } from '../../role.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/general/general.service';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Role;
  compareBoolean = (a: boolean, b: boolean): boolean => a === b;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: RoleService,
  private fb: FormBuilder,
  public _generalService:GeneralService) 
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Role';       
          this.advanceTable = new Role(data.advanceTable);
        } else 
        {
          this.dialogTitle = 'Role';
          this.advanceTable = new Role({});
        }
        this.advanceTableForm = this.createContactForm();
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  private normalizeBoolForSelect(value: any): boolean | '' {
    if (value === true || value === false) {
      return value;
    }
    if (value === 1 || value === '1' || value === 'true' || value === 'True') {
      return true;
    }
    if (value === 0 || value === '0' || value === 'false' || value === 'False') {
      return false;
    }
    return '';
  }

  private normalizeBoolWithDefault(value: any, defaultValue: boolean): boolean {
    const normalized = this.normalizeBoolForSelect(value);
    return normalized === '' ? defaultValue : normalized;
  }

  /** On edit, unset/null permissions default to No so the form can save with existing data. */
  private boolSelectValue(modelValue: any): boolean | '' {
    if (this.action === 'edit') {
      return this.normalizeBoolWithDefault(modelValue, false);
    }
    return this.normalizeBoolForSelect(modelValue);
  }

  createContactForm(): FormGroup 
  {
    const boolReq = requiredBoolSelect;
    const roleId = this.advanceTable.roleID;
    return this.fb.group(
    {
      roleID: [roleId],
      role: [this.advanceTable.role,Validators.required],
      roleFor: [this.advanceTable.roleFor,Validators.required],
      remark : [this.advanceTable.remark],
      canCreateReservation: [this.boolSelectValue(this.advanceTable.canCreateReservation), boolReq],
      activationStatus: [this.advanceTable.activationStatus ?? true],
      isThisAKeyAccountManagerRole: [this.boolSelectValue(this.advanceTable.isThisAKeyAccountManagerRole), boolReq],
      canThisRoleCreateBackDateBooking: [this.boolSelectValue(this.advanceTable.canThisRoleCreateBackDateBooking), boolReq],
      canThisRoleCreateBillOnClosingScreen: [this.boolSelectValue(this.advanceTable.canThisRoleCreateBillOnClosingScreen), boolReq],
      canThisRoleViewBillOnClosingScreen: [this.boolSelectValue(this.advanceTable.canThisRoleViewBillOnClosingScreen), boolReq],
      canThisRoleDoGoodForBillingOnClosingScreen: [this.boolSelectValue(this.advanceTable.canThisRoleDoGoodForBillingOnClosingScreen), boolReq],
      canThisRoleViewDummyInvoice: [this.boolSelectValue(this.advanceTable.canThisRoleViewDummyInvoice), boolReq],
      canActAsContractTariffAuditor: [this.boolSelectValue(this.advanceTable.canActAsContractTariffAuditor), boolReq],
      canActAsContractTariffVerifier: [this.boolSelectValue(this.advanceTable.canActAsContractTariffVerifier), boolReq],
      canResetOdometer: [this.boolSelectValue(this.advanceTable.canResetOdometer), boolReq],
      canDeleteFuelEntry: [this.boolSelectValue(this.advanceTable.canDeleteFuelEntry), boolReq],
      canFindFuelEntry: [this.boolSelectValue(this.advanceTable.canFindFuelEntry), boolReq],
      canCloseIncident: [this.boolSelectValue(this.advanceTable.canCloseIncident), boolReq],
      canCancelBackDateAllotment: [this.boolSelectValue(this.advanceTable.canCancelBackDateAllotment), boolReq],
      canCancelBackDateReservation: [this.boolSelectValue(this.advanceTable.canCancelBackDateReservation), boolReq],
      canReactivateBackDateReservation: [this.boolSelectValue(this.advanceTable.canReactivateBackDateReservation), boolReq],
      canEditDSAfterGoodForBilling: [this.boolSelectValue(this.advanceTable.canEditDSAfterGoodForBilling), boolReq],
      canEditAutoBilling: [this.normalizeBoolWithDefault(this.advanceTable.canEditAutoBilling, false), boolReq],
      canBypassOTP: [this.normalizeBoolWithDefault(this.advanceTable.canBypassOTP, false), boolReq]
    });
  }
  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  private getRolePayload(): any {
    const raw = this.advanceTableForm.getRawValue();
    const toBool = (v: any) => {
      if (v === false || v === 'false' || v === 0 || v === '0') {
        return false;
      }
      return v === true || v === 'true' || v === 1 || v === '1';
    };
    const roleId = Number(raw.roleID ?? this.advanceTable.roleID);
    return {
      ...raw,
      roleID: roleId,
      RoleID: roleId,
      canCreateReservation: toBool(raw.canCreateReservation),
      activationStatus: toBool(raw.activationStatus),
      isThisAKeyAccountManagerRole: toBool(raw.isThisAKeyAccountManagerRole),
      canThisRoleCreateBackDateBooking: toBool(raw.canThisRoleCreateBackDateBooking),
      canThisRoleCreateBillOnClosingScreen: toBool(raw.canThisRoleCreateBillOnClosingScreen),
      canThisRoleViewBillOnClosingScreen: toBool(raw.canThisRoleViewBillOnClosingScreen),
      canThisRoleDoGoodForBillingOnClosingScreen: toBool(raw.canThisRoleDoGoodForBillingOnClosingScreen),
      canThisRoleViewDummyInvoice: toBool(raw.canThisRoleViewDummyInvoice),
      canActAsContractTariffAuditor: toBool(raw.canActAsContractTariffAuditor),
      canActAsContractTariffVerifier: toBool(raw.canActAsContractTariffVerifier),
      canResetOdometer: toBool(raw.canResetOdometer),
      canDeleteFuelEntry: toBool(raw.canDeleteFuelEntry),
      canFindFuelEntry: toBool(raw.canFindFuelEntry),
      canCloseIncident: toBool(raw.canCloseIncident),
      canCancelBackDateAllotment: toBool(raw.canCancelBackDateAllotment),
      canCancelBackDateReservation: toBool(raw.canCancelBackDateReservation),
      canReactivateBackDateReservation: toBool(raw.canReactivateBackDateReservation),
      canEditDSAfterGoodForBilling: toBool(raw.canEditDSAfterGoodForBilling),
      canEditAutoBilling: toBool(raw.canEditAutoBilling),
      canBypassOTP: toBool(raw.canBypassOTP),
    };
  }

  public Post(): void
  {
    this.advanceTableService.add(this.getRolePayload())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('RoleCreate:RoleView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('RoleAll:RoleView:Failure');//To Send Updates       
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.getRolePayload())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('RoleUpdate:RoleView:Success');//To Send Updates
    },
    error =>
    {
      this._generalService.sendUpdate('RoleAll:RoleView:Failure');//To Send Updates   
    }
  )
  }
  public confirmAdd(): void 
  {
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


