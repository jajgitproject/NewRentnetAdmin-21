// @ts-nocheck
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { KamAddressCorrection } from '../../kamAddressCorrection.model';
import { ReservationService } from '../../../reservation/reservation.service';

export interface KamAddressCorrectionDialogData {
  row: KamAddressCorrection;
}

@Component({
  standalone: false,
  selector: 'app-kam-address-correction-dialog',
  templateUrl: './kam-address-correction-dialog.component.html',
  styleUrls: ['./kam-address-correction-dialog.component.sass']
})
export class KamAddressCorrectionDialogComponent implements OnInit {
  IsKAMRole = false;
  loadingDetails = false;
  bookingDetails: any = null;
  detailsError = '';
  pickupFormLoading = true;

  constructor(
    public dialogRef: MatDialogRef<KamAddressCorrectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KamAddressCorrectionDialogData,
    private reservationService: ReservationService
  ) {
    this.IsKAMRole = localStorage.getItem('isThisAKeyAccountManagerRole') === 'true';
  }

  get row(): KamAddressCorrection {
    return this.data?.row;
  }

  get bookingLabel(): string {
    const groupId = this.row?.reservationGroupID;
    const reservationId = this.row?.reservationID;
    if (!reservationId) {
      return '';
    }
    return groupId ? `${groupId}.${reservationId}` : String(reservationId);
  }

  ngOnInit(): void {
    const reservationId = this.row?.reservationID;
    if (!reservationId) {
      this.detailsError = 'Invalid reservation.';
      this.pickupFormLoading = false;
      return;
    }

    this.loadingDetails = true;
    this.reservationService.getBookingDetails(reservationId).subscribe({
      next: (data) => {
        const booking = this.normalizeBookingDetails(data);
        if (booking) {
          this.bookingDetails = booking;
        } else {
          this.bookingDetails = this.buildFallbackDetailsFromRow();
          this.detailsError = 'Full reservation details could not be loaded. Showing list data.';
        }
        this.loadingDetails = false;
      },
      error: () => {
        this.bookingDetails = this.buildFallbackDetailsFromRow();
        this.detailsError = 'Could not load full reservation details. Showing list data.';
        this.loadingDetails = false;
      }
    });
  }

  onPickupFormReady(): void {
    this.pickupFormLoading = false;
  }

  private normalizeBookingDetails(data: any): any {
    if (data == null) {
      return null;
    }
    if (Array.isArray(data)) {
      return data.length > 0 ? data[0] : null;
    }
    if (Array.isArray(data?.data)) {
      return data.data.length > 0 ? data.data[0] : null;
    }
    if (data?.reservationID || data?.ReservationID) {
      return data;
    }
    return null;
  }

  private buildFallbackDetailsFromRow(): any {
    const row = this.row;
    return {
      reservationID: row?.reservationID,
      reservationGroupID: row?.reservationGroupID,
      customerName: row?.customerName,
      customerGroup: row?.customerGroup,
      reservationStatus: row?.reservationStatus,
      pickupDate: row?.pickupDate,
      pickupTime: row?.pickupTime,
      pickupAddress: row?.pickupAddress,
      pickupAddressDetails: row?.pickupAddressDetails
    };
  }

  formatDateTime(dateValue: any, timeValue?: any): string {
    const parts: string[] = [];
    const datePart = moment(dateValue);
    if (dateValue && datePart.isValid()) {
      parts.push(datePart.format('DD/MM/YYYY'));
    }
    const timePart = moment(timeValue, [moment.ISO_8601, 'HH:mm:ss', 'HH:mm'], true);
    const resolvedTime = timePart.isValid() ? timePart : moment(timeValue);
    if (timeValue && resolvedTime.isValid()) {
      parts.push(resolvedTime.format('h:mm A'));
    }
    return parts.join(' ').trim() || 'N/A';
  }

  field(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return String(value);
  }

  displayCustomer(): string {
    const customer = this.bookingDetails?.customer ?? this.bookingDetails?.customerName ?? this.row?.customerName;
    const group = this.bookingDetails?.customerGroup ?? this.row?.customerGroup;
    if (customer && group) {
      return `${customer} - ${group}`;
    }
    return this.field(customer || group);
  }

  onCorrectionSaved(): void {
    this.dialogRef.close(true);
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
