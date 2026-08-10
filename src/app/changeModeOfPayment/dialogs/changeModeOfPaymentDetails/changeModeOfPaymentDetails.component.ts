// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { ChangeModeOfPaymentService } from '../../changeModeOfPayment.service';
import { ChangeModeOfPaymentModel } from '../../changeModeOfPayment.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-changeModeOfPaymentDetails',
  templateUrl: './changeModeOfPaymentDetails.component.html',
  styleUrls: ['./changeModeOfPaymentDetails.component.sass']
})
export class ChangeModeOfPaymentDetailsComponent {
  dataSourceForMOP?: ChangeModeOfPaymentModel[] | null;
  dialogTitle: any;
  ReservationID: any;

  constructor(
    public dialogRef: MatDialogRef<ChangeModeOfPaymentDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public changeModeOfPaymentService: ChangeModeOfPaymentService,
    public _generalService: GeneralService
  ) {
    this.dialogTitle = 'Mode Of Payment Change Log';
    this.ReservationID = data?.reservationID;
  }

  public ngOnInit(): void {
    this.loadDataForMOP();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public loadDataForMOP() {
    this.changeModeOfPaymentService.getChangeModeOfPaymentData(this.ReservationID).subscribe(
      (data) => {
        this.dataSourceForMOP = data;
      },
      (error: HttpErrorResponse) => {
        this.dataSourceForMOP = null;
      }
    );
  }
}
