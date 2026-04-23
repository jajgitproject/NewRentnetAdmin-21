// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { VendorDetailsService } from './vendorDetails.service';
import { VendorDetails } from './vendorDetails.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-vendorDetails',
  templateUrl: './vendorDetails.component.html',
  styleUrls: ['./vendorDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class VendorDetailsComponent {
  public vendorDetails: VendorDetails;
  dialogTitle: string;
 dataSource: VendorDetails | any;
  allotmentID: number;
  allotmentNotDone:boolean=false;
  constructor(
    public dialogRef: MatDialogRef< VendorDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { advanceTable: VendorDetails },
    public _generalService: GeneralService,
    public vendorDetailsService:VendorDetailsService,
  ) {
    // Set the defaults
    
    this.vendorDetails = new VendorDetails({});
    this.vendorDetails = this.data.advanceTable;
    this.allotmentID =  this.vendorDetails.allotmentID;
    if(!this.vendorDetails.allotmentID)
      {
        this.dialogTitle = 'Vendor Info';
        this.allotmentNotDone = true;
      }
      else{
        this.dialogTitle = 'Vendor Info';
        this.allotmentNotDone = false;
      }
    this.loadData();
  }


  public loadData() 
     {
    this.vendorDetailsService.GetVendorForAllotment(this.allotmentID).subscribe
      (
        data =>   
        {
  
          this.dataSource = data;
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


