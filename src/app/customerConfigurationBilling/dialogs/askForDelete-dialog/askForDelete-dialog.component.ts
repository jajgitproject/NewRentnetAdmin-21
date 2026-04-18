// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationBillingService } from '../../customerConfigurationBilling.service';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-askForDelete-dialog',
  templateUrl: './askForDelete-dialog.component.html',
  styleUrls: ['./askForDelete-dialog.component.sass']
})
export class AskForDeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<AskForDeleteDialogComponent>,
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

  confirmDelete()
  {
    
    this.advanceTableService.delete(this.data.CustomerConfigurationBillingID)  
    .subscribe(
    data => 
    {
      this.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationBillingDelete:CustomerConfigurationBillingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerConfigurationBillingAll:CustomerConfigurationBillingView:Failure');//To Send Updates  
    }
    )
  }
  
}


