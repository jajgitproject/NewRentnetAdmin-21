// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeCarTypeService } from '../../changeCarType.service';
import { ChangeCarTypeModel } from '../../changeCarType.model';
@Component({
  standalone: false,
  selector: 'app-changeCarTypeDetails',
  templateUrl: './changeCarTypeDetails.component.html',
  styleUrls: ['./changeCarTypeDetails.component.sass']
})
export class ChangeCarTypeDetailsComponent
{
  dataSourceForCarType?:ChangeCarTypeModel[] | null;
  dialogTitle:any;
  ReservationID:any;

  constructor(
    public dialogRef: MatDialogRef<ChangeCarTypeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public changeCarTypeService: ChangeCarTypeService,
    public _generalService: GeneralService
  )
  {
    this.dialogTitle = 'Reservation Change Log';
    this.ReservationID = data?.reservationID;
  }

  public ngOnInit(): void
  {
    this.loadDataForVehicle();
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  public loadDataForVehicle() 
  {
    this.changeCarTypeService.getChangeCarTypeData(this.ReservationID).subscribe(
    data => 
    {
      this.dataSourceForCarType = data;
      console.log(this.dataSourceForCarType)
    },
    (error: HttpErrorResponse) => { this.dataSourceForCarType = null; }
    );
  }

}


