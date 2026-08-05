import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  private toRouteSegment(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return encodeURIComponent(String(value));
  }

  private buildListUrl(
    fromDate: string | null,
    toDate: string | null,
    status: string | null,
    bookingType: string | null,
    pageNumber: number,
    orderByColumn: string,
    order: string
  ): string {
    return [
      this.apiUrl,
      this.toRouteSegment(fromDate),
      this.toRouteSegment(toDate),
      this.toRouteSegment(status),
      this.toRouteSegment(bookingType),
      pageNumber,
      orderByColumn,
      order
    ].join('/');
  }

  getTableData(
    fromDate: string | null,
    toDate: string | null,
    status: string | null,
    bookingType: string | null,
    pageNumber: number,
    orderByColumn = 'PickupDate',
    order = 'Descending'
  ): Observable<CdpBookingRequestListResponse> {
    const url = this.buildListUrl(fromDate, toDate, status, bookingType, pageNumber, orderByColumn, order);
    return this.httpClient.get<any>(url).pipe(
      map((response) => this.normalizeResponse(response))
    );
  }

  private normalizeResponse(response: any): CdpBookingRequestListResponse {
    const rawItems = response?.items ?? response?.Items ?? [];
    const items = (rawItems as any[]).map((row) => new CdpBookingRequest({
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
