// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TotalBookingCountDetails } from './totalBookingCountDetails.model';
import { TotalBookingCountDetailsService } from './totalBookingCountDetails.service';

@Component({
  standalone: false,
  selector: 'app-totalBookingCountDetails',
  templateUrl: './totalBookingCountDetails.component.html',
  styleUrls: ['./totalBookingCountDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TotalBookingCountDetailsComponent {
  public transferLocation: TotalBookingCountDetails;
  dialogTitle: string;
   dataSource: TotalBookingCountDetails | any;
  

  constructor(
    public dialogRef: MatDialogRef<TotalBookingCountDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: TotalBookingCountDetails },
    public _generalService: GeneralService,public totalBookingCountDetailsService:TotalBookingCountDetailsService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // Set the defaults
    this.dialogTitle = 'Over View';
    this.transferLocation = new TotalBookingCountDetails({});
    this.loadData();
  }
 public loadData() 
       {
      this.totalBookingCountDetailsService.GetBookingCount().subscribe
        (
          data =>   
          {
    
            this.dataSource = data;
            this.ngZone.run(() => {
              this.cdr.detectChanges();
            });
          },
          (error: HttpErrorResponse) => {
            this.dataSource = null;
          }
        );
      }


  onNoClick(): void {
    this.dialogRef.close();
  }
}


