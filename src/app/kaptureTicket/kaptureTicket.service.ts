import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { KaptureTicket } from './kaptureTicket.model';

@Injectable()
export class KaptureTicketService {
  private readonly apiUrl: string;

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'emailBookingAI/kaptureTickets';
  }

  getTableData(
    fromDate: string,
    toDate: string,
    ticketId: string,
    customerEmail: string,
    pageNumber: number
  ): Observable<KaptureTicket[]> {
    let params = new HttpParams().set('pageNumber', String(pageNumber || 1));
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }
    if (ticketId) {
      params = params.set('ticketId', ticketId);
    }
    if (customerEmail) {
      params = params.set('customerEmail', customerEmail);
    }

    return this.httpClient.get<any>(this.apiUrl, { params }).pipe(
      map((response) => {
        const rows = Array.isArray(response) ? response : (response?.items || response?.Items || []);
        return rows.map((row) => new KaptureTicket(row));
      })
    );
  }
}
