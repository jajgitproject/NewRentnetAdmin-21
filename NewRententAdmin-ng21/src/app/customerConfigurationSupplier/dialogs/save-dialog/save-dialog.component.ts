// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationSupplierService } from '../../customerConfigurationSupplier.service';
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
    public advanceTableService: CustomerConfigurationSupplierService,
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
       this._generalService.sendUpdate('CustomerConfigurationSupplierUpdate:CustomerConfigurationSupplierView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerConfigurationSupplierAll:CustomerConfigurationSupplierView:Failure');//To Send Updates  
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
       this._generalService.sendUpdate('CustomerConfigurationSupplierCreate:CustomerConfigurationSupplierView:Success');//To Send Updates  
    
    },
    error =>
    {
       this._generalService.sendUpdate('CustomerConfigurationSupplierAll:CustomerConfigurationSupplierView:Failure');//To Send Updates  
    }
  )
  
  }
  
}


