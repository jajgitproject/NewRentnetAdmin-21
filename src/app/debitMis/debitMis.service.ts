// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { formatDate } from '@angular/common';

@Injectable()
export class DebitMisService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'debitMIS';
  }

  search(criteria: any): Observable<any> {
    return this.httpClient.post(`${this.API_URL}/search`, this.normalizeCriteria(criteria));
  }

  exportExcel(criteria: any): Observable<HttpResponse<Blob>> {
    return this.httpClient.post(`${this.API_URL}/export`, this.normalizeCriteria(criteria), {
      observe: 'response',
      responseType: 'blob',
    });
  }

  private normalizeCriteria(criteria: any) {
    const c = { ...(criteria || {}) };
    if (c.dateFrom instanceof Date) {
      c.dateFrom = formatDate(c.dateFrom, 'yyyy-MM-dd', 'en-GB');
    }
    if (c.dateTo instanceof Date) {
      c.dateTo = formatDate(c.dateTo, 'yyyy-MM-dd', 'en-GB');
    }
    if (c.pageNumber == null) {
      c.pageNumber = 0;
    }
    if (!c.orderByColumn) {
      c.orderByColumn = 'DebitID';
    }
    if (!c.order) {
      c.order = 'Descending';
    }
    return c;
  }
}