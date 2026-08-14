import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { CdpBookingRequest, CdpBookingRequestListResponse } from './cdpBookingRequest.model';

@Injectable()
export class CdpBookingRequestService {
  private readonly apiUrl: string;

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'cdpBookingRequest';
  }

  getTableData(
    fromDate: string,
    toDate: string,
    status: string | null,
    bookingType: string | null,
    pageNumber: number,
    orderByColumn = 'PickupDate',
    order = 'Descending'
  ): Observable<CdpBookingRequestListResponse> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber))
      .set('orderByColumn', orderByColumn)
      .set('order', order);

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (bookingType) {
      params = params.set('bookingType', bookingType);
    }

    return this.httpClient.get<any>(this.apiUrl, { params }).pipe(
      map((response) => this.normalizeResponse(response))
    );
  }

  private normalizeResponse(response: any): CdpBookingRequestListResponse {
    const rawItems = response?.items ?? response?.Items ?? [];
    const rows = Array.isArray(rawItems) ? rawItems : [];
    const items = rows.map((row) => new CdpBookingRequest({
      reservationID: row.reservationID ?? row.ReservationID ?? 0,
      reservationGroupID: row.reservationGroupID ?? row.ReservationGroupID ?? 0,
      customerID: row.customerID ?? row.CustomerID ?? 0,
      customerGroupID: row.customerGroupID ?? row.CustomerGroupID ?? 0,
      customerName: row.customerName ?? row.CustomerName ?? '',
      customerGroup: row.customerGroup ?? row.CustomerGroup ?? '',
      allotmentStatus: row.allotmentStatus ?? row.AllotmentStatus ?? '',
      locationOutDate: row.locationOutDate ?? row.LocationOutDate ?? null,
      pickupDate: row.pickupDate ?? row.PickupDate ?? null,
      pickupTime: row.pickupTime ?? row.PickupTime ?? null,
      reservationCreatedOn: row.reservationCreatedOn ?? row.ReservationCreatedOn ?? null,
      reservationStatus: row.reservationStatus ?? row.ReservationStatus ?? '',
      reservationSource: row.reservationSource ?? row.ReservationSource ?? '',
      bookingTypeLabel: row.bookingTypeLabel ?? row.BookingTypeLabel ?? ''
    }));

    return {
      items,
      totalCount: response?.totalCount ?? response?.TotalCount ?? items.length
    };
  }
}
