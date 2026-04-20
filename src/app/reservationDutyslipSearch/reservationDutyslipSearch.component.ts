// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ReservationDutyslipSearchModel } from './reservationDutyslipSearch.model';
import { ReservationDutyslipSearchService } from './reservationDutyslipSearch.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  standalone: false,
  selector: 'app-reservationDutyslipSearch',
  templateUrl: './reservationDutyslipSearch.component.html',
  styleUrls: ['./reservationDutyslipSearch.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ReservationDutyslipSearchComponent implements OnInit {

  dataSource: ReservationDutyslipSearchModel[] | null;
  reservationID: number;
  dutyslipID: number;

  isReservationDisabled:boolean = false;
  isDutySlipDisabled:boolean = false;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public reservationDutyslipSearchService: ReservationDutyslipSearchService,
    public router: Router,
    public route: ActivatedRoute,
    public _generalService: GeneralService,
    //private dialogRef: MatDialogRef<ReservationDutyslipSearchComponent>
  ) {}

  ngOnInit() {}

  openModal() 
  {
    const modalElement = document.getElementById('exampleModalCenter');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  
  public SearchData()
  {
    this.loadData();
  }
  
  public loadData() 
  {
    debugger
    this.reservationDutyslipSearchService.getTableData(this.reservationID,this.dutyslipID).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        if (!data || data.length === 0) 
        {
          Swal.fire({
            title: '',
            text: 'No duty found.',
            icon: 'warning',
          });
          return;
        }
        this.openClosingScreen(this.dataSource)
        },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  openClosingScreen(item: any) 
  { 
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedAllotmentID = encodeURIComponent(this._generalService.encrypt(item.allotmentID.toString()));
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedDutySlipID = encodeURIComponent(this._generalService.encrypt(item.dutySlipID.toString()));
    const encryptedDutySlipForBillingID = encodeURIComponent(this._generalService.encrypt(item.dutySlipForBillingID.toString()));
    const encryptedPackageID = encodeURIComponent(this._generalService.encrypt(item.packageID.toString()));
    const encryptedInventoryID = encodeURIComponent(this._generalService.encrypt(item.inventoryID.toString()));
    const encryptedClosureStatus = encodeURIComponent(this._generalService.encrypt(item.closureStatus));
    const encryptedPackageTypeID = encodeURIComponent(this._generalService.encrypt(item.packageTypeID.toString()));
    const encryptedRegistrationNumber = encodeURIComponent(this._generalService.encrypt(item.registrationNumber));
    const encryptedPickupDate = encodeURIComponent(this._generalService.encrypt(item.pickupDate));
    const encryptedPickupTime = encodeURIComponent(this._generalService.encrypt(item.pickupTime));
    const encryptedDropOffDate = encodeURIComponent(this._generalService.encrypt(item.dropOffDate));
    const encryptedDropOffTime = encodeURIComponent(this._generalService.encrypt(item.dropOffTime));
    const encryptedLocationOutDate = encodeURIComponent(this._generalService.encrypt(item.locationOutDate));
    const encryptedLocationOutTime = encodeURIComponent(this._generalService.encrypt(item.locationOutTime));
    const encryptedPickupAddress = encodeURIComponent(this._generalService.encrypt(item.pickupAddress));
    const encryptedDropOffAddress = encodeURIComponent(this._generalService.encrypt(item.dropOffAddress));
    const encryptedLocationOutAddress = encodeURIComponent(this._generalService.encrypt(item.organizationalEntityName));
  
      // Create URL with encrypted query parameters
     const url = this.router.serializeUrl(
      this.router.createUrlTree(['/closingOne'], {
        queryParams: {
          reservationID: encryptedReservationID,
          allotmentID: encryptedAllotmentID,
          customerID: encryptedCustomerID,
          dutySlipID: encryptedDutySlipID,
          dutySlipForBillingID: encryptedDutySlipForBillingID,
          packageID: encryptedPackageID,
          inventoryID: encryptedInventoryID,
          closureStatus: encryptedClosureStatus,
          packageTypeID: encryptedPackageTypeID,
          registrationNumber: encryptedRegistrationNumber,
          pickupDate: encryptedPickupDate,
          pickupTime: encryptedPickupTime,
          dropOffDate: encryptedDropOffDate,
          dropOffTime: encryptedDropOffTime,
          locationOutDate: encryptedLocationOutDate,
          locationOutTime: encryptedLocationOutTime,
          pickupAddress: encryptedPickupAddress,
          dropOffAddress: encryptedDropOffAddress,
          locationOutAddress: encryptedLocationOutAddress
        }
      }));
    window.location.href = this._generalService.FormURL + url;
  }

  onInputChange() 
  {
    const hasReservation = this.reservationID;
    const hasDutySlip = this.dutyslipID;

    this.isReservationDisabled = !!hasDutySlip;
    this.isDutySlipDisabled = !!hasReservation;
  }



}

