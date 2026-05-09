// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { AllotmentLogDetails } from './allotmentLogDetails.model';
import { AllotmentLogDetailsService } from './allotmentLogDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-allotmentLogDetails',
  templateUrl: './allotmentLogDetails.component.html',
  styleUrls: ['./allotmentLogDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AllotmentLogDetailsComponent {
  dialogTitle: string;
  dutySlipID: number;
  dataSource: AllotmentLogDetails[] = [];
  viewAddress: any = 'N/A';
  viewKM: any = 'N/A';
  viewDate: any = null;
  viewTime: any = null;
  reservationID: number;

  constructor(
    public dialogRef: MatDialogRef<AllotmentLogDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:any,
    //public advanceTable:AllotmentLogDetails,
    public allotmentLogDetailsService: AllotmentLogDetailsService,
    private httpClient: HttpClient,
    public _generalService: GeneralService,
    private cdr: ChangeDetectorRef
  ) 
  {
    // Set the defaults
    this.dialogTitle = 'Allotment Log Details';
    this.dutySlipID = data.dutySlipID;
    this.reservationID = data.row.reservationID;
    console.log("Allotment Log Details Dialog Data:", data);
  }

  ngOnInit() {
    this.getAllotmentHistory();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

public getAllotmentHistory() {

  this.allotmentLogDetailsService
    .getAllotmentHistory(this.reservationID)
    .subscribe(
      (data: AllotmentLogDetails[]) => {

        setTimeout(() => {

          this.dataSource = data || [];

          this.cdr.detectChanges();

          console.log(this.dataSource);

        }, 0);

      },
      (error: HttpErrorResponse) => {

        this.dataSource = [];

      }
    );
}
  

}


