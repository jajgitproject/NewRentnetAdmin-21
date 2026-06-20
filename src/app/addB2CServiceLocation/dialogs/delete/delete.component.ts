
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AddB2CServiceLocationService } from '../../addB2CServiceLocation.service';
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
    public advanceTableService: AddB2CServiceLocationService,
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
    this.advanceTableService.delete(this.data.b2cServiceLocationID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('AddB2CServiceLocationDelete:AddB2CServiceLocationView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('AddB2CServiceLocationAll:AddB2CServiceLocationView:Failure');//To Send Updates  
    }
    )
  }
}


