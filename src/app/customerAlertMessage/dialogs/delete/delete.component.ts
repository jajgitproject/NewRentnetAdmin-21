// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerAlertMessageService } from '../../customerAlertMessage.service';

@Component({
  standalone: false,
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerAlertMessageService,
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
    this.advanceTableService.delete(this.data.customerAlertMessageID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerAlertMessageDelete:CustomerAlertMessageView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerAlertMessageAll:CustomerAlertMessageView:Failure');//To Send Updates  
    }
    )
  }
}


