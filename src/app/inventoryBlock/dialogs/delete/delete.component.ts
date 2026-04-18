// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InventoryBlockService } from '../../inventoryBlock.service';
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
    public advanceTableService: InventoryBlockService,
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
    this.advanceTableService.delete(this.data.inventoryBlockID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('InventoryBlockDelete:InventoryBlockView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('InventoryBlockAll:InventoryBlockView:Failure');//To Send Updates  
    }
    )
  }
}


