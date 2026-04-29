// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DriverService } from '../../driver.service';
import { GeneralService } from '../../../general/general.service';
@Component({
  standalone: false,
  selector: 'app-clearIMEI',
  templateUrl: './clearIMEI.component.html',
  styleUrls: ['./clearIMEI.component.sass']
})
export class ClearIMEIDialogComponent
{
  constructor(
    public dialogRef: MatDialogRef<ClearIMEIDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DriverService,
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
       this._generalService.sendUpdate('DriverClearIMEI:DriverView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('DriverAll:DriverView:Failure');//To Send Updates  
    }
    )
  }
}
