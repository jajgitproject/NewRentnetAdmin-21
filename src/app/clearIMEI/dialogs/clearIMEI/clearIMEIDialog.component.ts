
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ClearIMEIService } from '../../clearIMEI.service';
@Component({
  standalone: false,
  selector: 'app-clearIMEIDialog',
  templateUrl: './clearIMEIDialog.component.html',
  styleUrls: ['./clearIMEIDialog.component.scss']
})
export class ClearIMEIDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<ClearIMEIDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ClearIMEIService,
    public _generalService: GeneralService
  )
  {
    
  }
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmClearIMEI()
  {
    this.advanceTableService.clearIMEI(this.data.driverID)  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('ClearIMEIClearIMEI:ClearIMEIView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('ClearIMEIAll:ClearIMEIView:Failure');//To Send Updates  
    }
    )
  }
}
