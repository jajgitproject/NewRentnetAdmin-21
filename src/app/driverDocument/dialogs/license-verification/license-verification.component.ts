// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component,Inject } from '@angular/core';
import { DriverDocumentService } from '../../driverDocument.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-license-verification',
  templateUrl: './license-verification.component.html',
  styleUrls: ['./license-verification.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class LicenseVerificationComponent 
{
  constructor(
  public dialogRef: MatDialogRef<LicenseVerificationComponent>,  
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverDocumentService,
  public _generalService:GeneralService)
  {
       
  }
  public ngOnInit(): void
  {

  }

  onNoClick(): void
  {
    this.dialogRef.close();
  }

  public Put(): void
  {
    this.data.advanceTableForm.patchValue({addressCityID:this.data.addressGeoPointID || this.data.advanceTable.addressCityID});
    //this.data.advanceTableForm.patchValue({licenseIssueCityID:this.data.issuingGeoPointID || this.data.advanceTable.licenseIssueCityID});
    this.data.advanceTableForm.patchValue({driverID:this.data.advanceTable.driverID});
    this.advanceTableService.update(this.data.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.data.dialogRefrence.close();
       this._generalService.sendUpdate('DriverDocumentUpdate:DriverDocumentView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('DriverDocumentAll:DriverDocumentView:Failure');//To Send Updates  
    }
  )
  }
}


