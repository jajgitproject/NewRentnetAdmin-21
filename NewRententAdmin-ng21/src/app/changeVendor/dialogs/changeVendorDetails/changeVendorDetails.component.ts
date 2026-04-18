// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ChangeVendorService } from '../../changeVendor.service';
import { ChangeVendorModel } from '../../changeVendor.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  standalone: false,
  selector: 'app-changeVendorDetails',
  templateUrl: './changeVendorDetails.component.html',
  styleUrls: ['./changeVendorDetails.component.sass']
})
export class ChangeVendorDetailsComponent
{
  dataSourceForVendor?:ChangeVendorModel[] | null;
  dialogTitle:any;
  ReservationID:any;

  constructor(
    public dialogRef: MatDialogRef<ChangeVendorDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public changeVendorService: ChangeVendorService,
    public _generalService: GeneralService
  )
  {
    this.dialogTitle = 'Reservation Change Log';
    this.ReservationID = data?.reservationID;
  }

  public ngOnInit(): void
  {
    this.loadDataForVendor();
  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  public loadDataForVendor() 
  {
    this.changeVendorService.getChangeVendorData(this.ReservationID).subscribe(
    data => 
    {
      this.dataSourceForVendor = data;
      console.log(this.dataSourceForVendor)
    },
    (error: HttpErrorResponse) => { this.dataSourceForVendor = null; }
    );
  }

}


