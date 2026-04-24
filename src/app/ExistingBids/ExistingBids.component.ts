// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';

import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { ExistingBids } from './ExistingBids.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
//import { CityDropDown } from 'src/app/general/CityDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CarAndDriverAllotmentService } from '../CarAndDriverAllotment/CarAndDriverAllotment.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { BidDetails, ExistingBidsData, Notification } from '../CarAndDriverAllotment/CarAndDriverAllotment.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
@Component({
  standalone: false,
  selector: 'app-ExistingBids',
  templateUrl: './ExistingBids.component.html',
  styleUrls: ['./ExistingBids.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ExistingBidsComponent
{
  reservationID: any;
  PageNumber: number = 1;
  isLoading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  //dataSource: MatTableDataSource<any> | null;
  dataSource:BidDetails[];
constructor(
  public dialogRef: MatDialogRef<ExistingBidsComponent>, 
  @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private fb: FormBuilder,
    public _carAndDriverAllotmentService:CarAndDriverAllotmentService,
    public _generalService:GeneralService, 
    private changeDetectorRef: ChangeDetectorRef)
  {
    this.reservationID=data.reservationID;
  }

  ngOnInit() 
  {
    this.loadData();
  }

  loadData()
  {
    this.isLoading = true;
    this._carAndDriverAllotmentService.GetExistingBids(this.reservationID, this.PageNumber).subscribe(
      (data:ExistingBidsData)=>
      {
        // this.changeDetectorRef.detectChanges();
        // this.dataSource = new MatTableDataSource(data.driverList);
        // this.dataSource.paginator = this.paginator;
        // this.obs = this.dataSource.connect();
        this.dataSource = Array.isArray(data?.bidDetailsList) ? data.bidDetailsList : [];
        this.isLoading = false;
      }
      ,
      () => {
        this.dataSource = [];
        this.isLoading = false;
      }
    );
  }

  // ngOnDestroy() {
  //   if (this.dataSource) { 
  //     this.dataSource.disconnect(); 
  //   }
  // }
}



