// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationReservationService } from '../../customerConfigurationReservation.service';
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
  
  constructor(
    public dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerConfigurationReservationService,
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
    this.data.saveDisabled=false;
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
    this.advanceTableService.update(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.data.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationReservationUpdate:CustomerConfigurationReservationView:Success');//To Send Updates  
       this.data.saveDisabled=true;
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerConfigurationReservationAll:CustomerConfigurationReservationView:Failure');//To Send Updates
     this.data.saveDisabled=true;  
    }
  )
  }

  public Post(): void
  {
    this.dialogRef.close();
    this.data.advanceTableForm.patchValue({customerID:this.data.customerID});
    this.advanceTableService.add(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.data.dialogRef.close();
       this._generalService.sendUpdate('CustomerConfigurationReservationCreate:CustomerConfigurationReservationView:Success');//To Send Updates
       this.data.saveDisabled=true;  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerConfigurationReservationAll:CustomerConfigurationReservationView:Failure');//To Send Updates
       this.data.saveDisabled=true;  
    }
  )
  
  }
  
}


