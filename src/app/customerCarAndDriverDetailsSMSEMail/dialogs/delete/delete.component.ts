// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerCarAndDriverDetailsSMSEMailService } from '../../customerCarAndDriverDetailsSMSEMail.service';
import { GeneralService } from '../../../general/general.service';
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
    public advanceTableService: CustomerCarAndDriverDetailsSMSEMailService,
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
    this.advanceTableService.delete(this.data.customerCarAndDriverDetailsSMSEMailID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('CustomerCarAndDriverDetailsSMSEMailDelete:CustomerCarAndDriverDetailsSMSEMailView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('CustomerCarAndDriverDetailsSMSEMailAll:CustomerCarAndDriverDetailsSMSEMailView:Failure');//To Send Updates  
    }
    )
  }
}


