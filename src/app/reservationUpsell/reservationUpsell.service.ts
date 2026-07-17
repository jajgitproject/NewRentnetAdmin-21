// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ReservationUpsellService {
  private readonly API_URL: string;

  constructor(private http: HttpClient, private generalService: GeneralService) {
    this.API_URL = this.generalService.BaseURL + 'reservation';
  }

  getUpsellStatus(reservationId: number, userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${reservationId}/upsell-status/${userId}`);
  }

  getEligibleCategories(reservationId: number, userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${reservationId}/eligible-upsell-categories/${userId}`);
  }

  getDeclineReasons(reservationId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${reservationId}/upsell-decline-reasons`);
  }

  getCancelOptions(reservationId: number, userId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${reservationId}/cancel-upsell-options/${userId}`);
  }

  processUpsell(reservationId: number, payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${reservationId}/upsell`, payload);
  }

  cancelUpsell(reservationId: number, payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${reservationId}/cancel-upsell`, payload);
  }

  recordDecline(reservationId: number, payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${reservationId}/upsell-declined`, payload);
  }
}
