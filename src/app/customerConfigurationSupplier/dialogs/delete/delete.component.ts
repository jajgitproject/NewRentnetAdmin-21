// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationSupplierService } from '../../customerConfigurationSupplier.service';
import { GeneralService } from '../../../general/general.service';
import { AskForDeleteDialogComponent } from '../askForDelete-dialog/askForDelete-dialog.component';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRefrence: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog:MatDialog,
    public advanceTableService: CustomerConfigurationSupplierService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRefrence.close();
  }
  
  ask(){
    const dialogRef = this.dialog.open(AskForDeleteDialogComponent, 
      {
        data:
        {
          CustomerConfigurationSupplierID:this.data.customerConfigurationSupplierID
        } 
      });
  }
}


