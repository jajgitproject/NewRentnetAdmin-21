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

  public Put(): void
  {
    this.dialogRef.close();
    this.data.advanceTableForm.patchValue({customerID:this.data.advanceTable.customerID});
    this.data.advanceTableForm.patchValue({ecoCompanyID:0});
    if(this.data.fixBillingBranchID)
    {
      this.data.advanceTableForm.patchValue({fixBillingBranchID:this.data.fixBillingBranchID});
    }
    else{
      this.data.advanceTableForm.patchValue({fixBillingBranchID:0});
    }
    
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
    this.data.advanceTableForm.patchValue({customerID:this.data.customerID});
    this.data.advanceTableForm.patchValue({ecoCompanyID:0});
    if(this.data.fixBillingBranchID)
    {
      this.data.advanceTableForm.patchValue({fixBillingBranchID:this.data.fixBillingBranchID});
    }
    else{
      this.data.advanceTableForm.patchValue({fixBillingBranchID:0});
    }
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


