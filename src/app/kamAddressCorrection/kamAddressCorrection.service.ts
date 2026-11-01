import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { KamAddressCorrection, KamAddressCorrectionListResponse } from './kamAddressCorrection.model';

@Injectable()
export class KamAddressCorrectionService {
  private readonly apiUrl: string;

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'kamAddressCorrection';
  }

  getTableData(
    fromDate: string,
    toDate: string,
    bookingNo: string | null,
    customerGroup: string | null,
    customerName: string | null,
    pageNumber: number,
    orderByColumn = 'PickupDate',
    order = 'Ascending'
  ): Observable<KamAddressCorrectionListResponse> {
    let params = new HttpParams()
      .set('userId', String(this.generalService.getUserID() || 0))
      .set('pageNumber', String(pageNumber))
      .set('orderByColumn', orderByColumn)
      .set('order', order);

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }
    if (bookingNo) {
      params = params.set('bookingNo', bookingNo);
    }
    if (customerGroup) {
      params = params.set('customerGroup', customerGroup);
    }
    if (customerName) {
      params = params.set('customerName', customerName);
    }

    return this.httpClient.get<any>(this.apiUrl, { params }).pipe(
      map((response) => this.normalizeResponse(response))
    );
  }

  private normalizeResponse(response: any): KamAddressCorrectionListResponse {
    const rawItems = response?.items ?? response?.Items ?? [];
    const rows = Array.isArray(rawItems) ? rawItems : [];
    const items = rows.map((row) => new KamAddressCorrection({
      reservationID: row.reservationID ?? row.ReservationID ?? 0,
      reservationGroupID: row.reservationGroupID ?? row.ReservationGroupID ?? 0,
      customerID: row.customerID ?? row.CustomerID ?? 0,
      customerGroupID: row.customerGroupID ?? row.CustomerGroupID ?? 0,
      customerName: row.customerName ?? row.CustomerName ?? '',
      customerGroup: row.customerGroup ?? row.CustomerGroup ?? '',
      pickupDate: row.pickupDate ?? row.PickupDate ?? null,
      pickupTime: row.pickupTime ?? row.PickupTime ?? null,
      pickupAddress: row.pickupAddress ?? row.PickupAddress ?? '',
      pickupAddressDetails: row.pickupAddressDetails ?? row.PickupAddressDetails ?? '',
      reservationStatus: row.reservationStatus ?? row.ReservationStatus ?? '',
      reservationCreatedOn: row.reservationCreatedOn ?? row.ReservationCreatedOn ?? null
    }));

    return {
      items,
      totalCount: response?.totalCount ?? response?.TotalCount ?? items.length
    };
  }
}
