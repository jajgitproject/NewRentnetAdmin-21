// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { InterstateTaxEntryService } from '../../interstateTaxEntry.service';
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
    public advanceTableService: InterstateTaxEntryService,
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
    debugger;
    this.advanceTableService.delete(this.data.interstateTaxID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('InterstateTaxEntryDelete:InterstateTaxEntryView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('InterstateTaxEntryAll:InterstateTaxEntryView:Failure');//To Send Updates  
    }
    )
  }
}


