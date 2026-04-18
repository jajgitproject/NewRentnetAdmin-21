// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelDetails } from '../controlPanelDesign/controlPanelDesign.model';
import { LocationDetails } from './locationDetails.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationDetailsService } from './locationDetails.service';
@Component({
  standalone: false,
  selector: 'app-locationDetails',
  templateUrl: './locationDetails.component.html',
  styleUrls: ['./locationDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LocationDetailsComponent {
  public transferLocation: LocationDetails;
  dialogTitle: string;
   dataSource: LocationDetails | any;
  organizationalEntityID: number;

  constructor(
    public dialogRef: MatDialogRef<LocationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: LocationDetails },
    public _generalService: GeneralService,public locationDetailsService:LocationDetailsService,
  ) {
    // Set the defaults
    this.dialogTitle = 'Location Info';
    this.transferLocation = new LocationDetails({});
    this.transferLocation = this.data.advanceTable;
    this.organizationalEntityID =  this.transferLocation.transferedLocationID;
    this.loadData();
  }
 public loadData() 
       {
      this.locationDetailsService.GetAllotmentLocation(this.organizationalEntityID).subscribe
        (
          data =>   
          {
    
            this.dataSource = data;
            console.log(this.dataSource)
           
          },
          (error: HttpErrorResponse) => { this.dataSource = null;}
        );
      }


  onNoClick(): void {
    this.dialogRef.close();
  }
}


