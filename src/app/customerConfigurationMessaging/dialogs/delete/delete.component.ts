// @ts-nocheck
import { MAT_DIALOG_DATA,MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerConfigurationMessagingService } from '../../customerConfigurationMessaging.service';
import { GeneralService } from '../../../general/general.service';
import { AskForDeleteDialogComponent } from '../askForDeleteDialog/askForDeleteDialog.component';
@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  customerConfigurationMessagingID:any;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    public askForDeleteDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerConfigurationMessagingService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  openDeleteDialog(){
    this.askForDeleteDialog.open(AskForDeleteDialogComponent, 
    {
      data: 
        {
          actions:this.data.action,
          CustomerConfigurationMessagingID:this.data.customerConfigurationMessagingID,
          //advanceTableForm:this.advanceTableForm,
          dialogRef:this.dialogRef
        }
    });

  }
  confirmDelete()
  {
    this.advanceTableService.delete(this.data.customerConfigurationMessagingID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerConfigurationMessagingDelete:CustomerConfigurationMessagingView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerConfigurationMessagingAll:CustomerConfigurationMessagingView:Failure');//To Send Updates  
    }
    )
  }
}


