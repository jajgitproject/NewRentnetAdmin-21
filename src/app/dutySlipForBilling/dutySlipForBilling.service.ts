// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { BillingHistory } from './dutySlipForBilling.model';
import { ClosingDutySlipForBillingModel } from '../clossingOne/closingDutySlipForBilling.model';

@Injectable()
export class DutySlipForBillingService 
{
  private API_URL:string = '';
  private API_URL_GPS:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "closing";
    this.API_URL_GPS=generalService.BaseURL+ "dutySlipByGPS";
  }

  addBillingHistory(advanceTable: BillingHistory)
  {
    return this.httpClient.post<any>(this.API_URL + '/SaveBillingHistory', advanceTable);
  }

  update(advanceTable: ClosingDutySlipForBillingModel)
  {
    this.applyReportingFromPickupFallback(advanceTable);

    if (this.isValidDate(advanceTable.locationOutDateForBilling)) {
      this.applyBillingDateString(
        advanceTable,
        'locationOutDateForBilling',
        'locationOutDateForBillingString',
        (value) => this.generalService.getTimeApplicable(value)
      );
      this.applyBillingDateString(
        advanceTable,
        'locationOutTimeForBilling',
        'locationOutTimeForBillingString',
        (value) => this.generalService.getTimeApplicableTO(value)
      );

      this.applyBillingDateString(
        advanceTable,
        'reportingToGuestDateForBilling',
        'reportingToGuestDateForBillingString',
        (value) => this.generalService.getTimeApplicable(value)
      );
      this.applyBillingDateString(
        advanceTable,
        'reportingToGuestTimeForBilling',
        'reportingToGuestTimeForBillingString',
        (value) => this.generalService.getTimeApplicableTO(value)
      );

      this.applyBillingDateString(
        advanceTable,
        'pickUpDateForBilling',
        'pickUpDateForBillingString',
        (value) => this.generalService.getTimeApplicable(value)
      );
      this.applyBillingDateString(
        advanceTable,
        'pickUpTimeForBilling',
        'pickUpTimeForBillingString',
        (value) => this.generalService.getTimeApplicableTO(value)
      );

      this.applyBillingDateString(
        advanceTable,
        'dropOffDateForBilling',
        'dropOffDateForBillingString',
        (value) => this.generalService.getTimeApplicable(value)
      );
      this.applyBillingDateString(
        advanceTable,
        'dropOffTimeForBilling',
        'dropOffTimeForBillingString',
        (value) => this.generalService.getTimeApplicableTO(value)
      );

      this.applyBillingDateString(
        advanceTable,
        'locationInDateForBilling',
        'locationInDateForBillingString',
        (value) => this.generalService.getTimeApplicable(value)
      );
      this.applyBillingDateString(
        advanceTable,
        'locationInTimeForBilling',
        'locationInTimeForBillingString',
        (value) => this.generalService.getTimeApplicableTO(value)
      );
    }

    if (advanceTable.reportingToGuestKMForBilling === null) {
      advanceTable.reportingToGuestKMForBilling = 0;
    }
    this.sanitizeClosingUpdatePayload(advanceTable);
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  private applyBillingDateString(
    payload: any,
    dateField: string,
    stringField: string,
    format: (value: Date) => string
  ): void {
    if (this.isValidDate(payload[dateField])) {
      payload[stringField] = format(payload[dateField]);
      return;
    }

    payload[dateField] = null;
    payload[stringField] = null;
  }

  /** When reporting leg was never captured, use pickup (business rule: pickup = reporting). */
  private applyReportingFromPickupFallback(payload: any): void {
    if (!payload) {
      return;
    }

    if (this.isValidDate(payload.reportingToGuestDateForBilling)) {
      return;
    }

    if (!this.isValidDate(payload.pickUpDateForBilling)) {
      return;
    }

    payload.reportingToGuestDateForBilling = payload.pickUpDateForBilling;
    payload.reportingToGuestTimeForBilling = this.isValidDate(payload.pickUpTimeForBilling)
      ? payload.pickUpTimeForBilling
      : payload.pickUpDateForBilling;

    if (!payload.reportingToGuestKMForBilling && payload.pickUpKMForBilling) {
      payload.reportingToGuestKMForBilling = payload.pickUpKMForBilling;
    }

    if (!payload.reportingToGuestAddressStringForBilling && payload.pickUpAddressStringForBilling) {
      payload.reportingToGuestAddressStringForBilling = payload.pickUpAddressStringForBilling;
    }

    if (!payload.reportingToGuestLatLongForBilling && payload.pickUpLatLongForBilling) {
      payload.reportingToGuestLatLongForBilling = payload.pickUpLatLongForBilling;
    }
  }

  /** Empty strings cannot bind to int/int? on the API — coerce before PUT. */
  private sanitizeClosingUpdatePayload(payload: any): void {
    if (!payload) {
      return;
    }

    // Nullable int on API (DutySlipForBillingModel.LocationOutLocationOrHubID)
    payload.locationOutLocationOrHubID = this.toNullableInt(payload.locationOutLocationOrHubID);

    // Non-nullable ints — use 0 when missing (repository treats 0 as DBNull for hub)
    payload.locationInLocationOrHubID = this.toNullableInt(payload.locationInLocationOrHubID) ?? 0;
    payload.dutySlipForBillingID = this.toNullableInt(payload.dutySlipForBillingID) ?? 0;
    payload.dutySlipID = this.toNullableInt(payload.dutySlipID) ?? 0;
    payload.reservationID = this.toNullableInt(payload.reservationID) ?? 0;
    payload.allotmentID = this.toNullableInt(payload.allotmentID) ?? 0;
    payload.userID = this.toNullableInt(payload.userID) ?? 0;
    payload.dutyTypeID = this.toNullableInt(payload.dutyTypeID) ?? 0;
    payload.packageID = this.toNullableInt(payload.packageID) ?? 0;
    payload.disputeTypeID = this.toNullableInt(payload.disputeTypeID) ?? 0;
    payload.disputeApprovedByID = this.toNullableInt(payload.disputeApprovedByID) ?? 0;
    payload.dutySlipForBillingCreatedByID = this.toNullableInt(payload.dutySlipForBillingCreatedByID) ?? 0;

    // Numeric amounts that may arrive as ''
    const numericZeroFields = [
      'locationOutKMForBilling',
      'reportingToGuestKMForBilling',
      'pickUpKMForBilling',
      'dropOffKMForBilling',
      'locationInKMForBilling',
      'disputeKMs',
      'disputeMinutes',
      'additionalKMs',
      'additionalMinutes',
      'driverConveyanceKMsFrom',
      'driverConveyanceKMsTo',
      'totalCustomerAdvance',
      'discountPercentage',
      'discountApplicableAmount',
      'discountAmount',
    ];
    for (const field of numericZeroFields) {
      if (payload[field] === '' || payload[field] === undefined) {
        payload[field] = this.toNullableInt(payload[field]) ?? 0;
      }
    }

    const billingDateFields = [
      'locationOutDateForBilling',
      'locationOutTimeForBilling',
      'reportingToGuestDateForBilling',
      'reportingToGuestTimeForBilling',
      'pickUpDateForBilling',
      'pickUpTimeForBilling',
      'dropOffDateForBilling',
      'dropOffTimeForBilling',
      'locationInDateForBilling',
      'locationInTimeForBilling',
      'dutySlipForBillingCreatedOn',
    ];
    for (const field of billingDateFields) {
      payload[field] = this.toNullableDate(payload[field]);
    }

    const billingDateStringFields = [
      'locationOutDateForBillingString',
      'locationOutTimeForBillingString',
      'reportingToGuestDateForBillingString',
      'reportingToGuestTimeForBillingString',
      'pickUpDateForBillingString',
      'pickUpTimeForBillingString',
      'dropOffDateForBillingString',
      'dropOffTimeForBillingString',
      'locationInDateForBillingString',
      'locationInTimeForBillingString',
    ];
    for (const field of billingDateStringFields) {
      if (payload[field] === '' || payload[field] === 'Invalid Date') {
        payload[field] = null;
      }
    }
  }

  private isValidDate(value: any): boolean {
    return this.toNullableDate(value) !== null;
  }

  private toNullableDate(value: any): Date | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private toNullableInt(value: any): number | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

 PostDataGPS(dutySlipID:any,RegistrationNumber:any):  Observable<any> 
  { 
    let userID=this.generalService.getUserID();
    return this.httpClient.get(this.API_URL_GPS+'/'+dutySlipID + '/'+RegistrationNumber);
  }
}
