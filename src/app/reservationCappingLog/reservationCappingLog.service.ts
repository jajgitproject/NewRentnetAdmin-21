// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ReservationCappingLogService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'reservationCappingLog';
  }

  getTableData(
    customerGroup: string,
    city: string,
    packageType: string,
    vehicle: string,
    cappingType: string,
    fromPickUpDate: string,
    toPickUpDate: string,
    fromAttemptDate: string,
    toAttemptDate: string,
    pageNumber: number,
    orderByColumn: string,
    order: string
  ): Observable<any> {
    const n = (v) => (v === '' || v === undefined || v === null ? 'null' : v);
    return this.httpClient.get(
      `${this.API_URL}/${n(customerGroup)}/${n(city)}/${n(packageType)}/${n(vehicle)}/${n(cappingType)}/${n(fromPickUpDate)}/${n(toPickUpDate)}/${n(fromAttemptDate)}/${n(toAttemptDate)}/${pageNumber}/${orderByColumn}/${order}`
    );
  }
}
