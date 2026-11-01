// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { LocationCityMappingService } from '../../../locationCityMapping/locationCityMapping.service';
import { LocationCityMappingModel } from '../../../locationCityMapping/locationCityMapping.model';

@Component({
  standalone: false,
  selector: 'app-unmap',
  templateUrl: './unmap.component.html',
  styleUrls: ['./unmap.component.sass']
})
export class UnmapDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UnmapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: LocationCityMappingService,
    public _generalService: GeneralService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmUnmap() {
    const payload = new LocationCityMappingModel({
      locationID: Number(this.data.locationID),
      locationCityMappingIDs: (this.data.selectedRows || [])
        .map(row => Number(row.locationCityMappingID ?? row.LocationCityMappingID))
        .filter(id => id > 0),
      cityIDs: (this.data.selectedRows || [])
        .map(row => Number(row.cityID ?? row.CityID))
        .filter(id => id > 0)
    });
    this.advanceTableService.unmapCities(payload).subscribe(
      data => {
        this._generalService.sendUpdate('LocationCityMappingUnmap:LocationCityMappingView:Success');
      },
      error => {
        this._generalService.sendUpdate('LocationCityMappingAll:LocationCityMappingView:Failure');
      }
    );
  }
}
