// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationBillingService } from '../../customerConfigurationBilling.service';
import { GeneralService } from '../../../general/general.service';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.sass']
})
export class SaveDialogComponent
{
  // advanceTableForm: any;
  ecoCompanyID: any;
  fixBillingBranchID: any;
  constructor(
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerConfigurationBillingService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }

  public confirmAdd(): void 
  {
    this.data.saveDisabled = false;
       if(this.data.action=="edit")
       {
          this.Put();
       }
       else{
        this.Post();
       }
  }

  private coerceBoolean(value: any, defaultValue = false): boolean {
    if (value === true || value === false) {
      return value;
    }
    if (value === 'true' || value === 'True') {
      return true;
    }
    if (value === 'false' || value === 'False') {
      return false;
    }
    return defaultValue;
  }

  /** Hidden fields were removed from the UI; API/stored proc still requires valid bit/string values. */
  private prepareFormForSave(customerID: number): void {
    const form = this.data.advanceTableForm;
    const raw = form.getRawValue();
    const fixBillingBranchID = Number(raw.fixBillingBranchID || this.data.fixBillingBranchID) || 0;

    form.patchValue({
      customerID: Number(customerID) || 0,
      ecoCompanyID: 0,
      fixBillingBranchID,
      misRequired: this.coerceBoolean(raw.misRequired, false),
      useOnlyAppDataForBilling: this.coerceBoolean(raw.useOnlyAppDataForBilling, false),
      mapMandatoryWithDutySlip: this.coerceBoolean(raw.mapMandatoryWithDutySlip, false),
      runningDetailsMandatoryWithDutySlip: this.coerceBoolean(raw.runningDetailsMandatoryWithDutySlip, false),
      useDataFromAppToPrintOnDutySlip: this.coerceBoolean(raw.useDataFromAppToPrintOnDutySlip, false),
      runningDetailsSource: raw.runningDetailsSource || 'App',
      activationStatus: this.coerceBoolean(raw.activationStatus, true),
    });
  }

  public Put(): void
  {
    this.dialogRef.close();
    this.prepareFormForSave(this.data.advanceTable.customerID);
    
    this.advanceTableService.update(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.data.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationBillingUpdate:CustomerConfigurationBillingView:Success');//To Send Updates  
       this.data.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerConfigurationBillingAll:CustomerConfigurationBillingView:Failure');//To Send Updates
     this.data.saveDisabled = true;  
    }
  )
  }

  public Post(): void
  {
    this.dialogRef.close();
    this.prepareFormForSave(this.data.customerID);
    this.advanceTableService.add(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.data.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationBillingCreate:CustomerConfigurationBillingView:Success');//To Send Updates 
       this.data.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerConfigurationBillingAll:CustomerConfigurationBillingView:Failure');//To Send Updates 
       this.data.saveDisabled = true; 
    }
  )
  
  }
  
}


