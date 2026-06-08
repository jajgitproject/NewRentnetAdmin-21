// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import moment from 'moment';

@Injectable()
export class EmployeeLoginHoursMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'employeeLoginHours';
  }

  getSummary(employeeId: string, fromDate: any, toDate: any, branchId: string, groupBy: string, pageNumber: number): Observable<any> {
    return this.httpClient.get(this.buildUrl('summary', employeeId, fromDate, toDate, branchId, groupBy, pageNumber));
  }

  getSessions(employeeId: string, fromDate: any, toDate: any, pageNumber: number): Observable<any> {
    return this.httpClient.get(this.buildUrl('sessions', employeeId, fromDate, toDate, 'null', 'day', pageNumber));
  }

  getOverlaps(employeeId: string, fromDate: any, toDate: any, pageNumber: number): Observable<any> {
    return this.httpClient.get(this.buildUrl('overlaps', employeeId, fromDate, toDate, 'null', 'day', pageNumber));
  }

  private buildUrl(action: string, employeeId: string, fromDate: any, toDate: any, branchId: string, groupBy: string, pageNumber: number): string {
    const from = this.formatApiDate(fromDate);
    const to = this.formatApiDate(toDate);
    const emp = this.nullToken(employeeId);
    const branch = this.nullToken(branchId);
    if (action === 'summary') {
      return `${this.API_URL}/summary/${emp}/${from}/${to}/${branch}/${groupBy}/${pageNumber}`;
    }
    if (action === 'sessions') {
      return `${this.API_URL}/sessions/${emp}/${from}/${to}/${pageNumber}`;
    }
    return `${this.API_URL}/overlaps/${emp}/${from}/${to}/${pageNumber}`;
  }

  private formatApiDate(value: any): string {
    if (!value) return 'null';
    const m = moment(value).utcOffset('+05:30');
    return m.isValid() ? m.format('YYYY-MM-DD') : 'null';
  }

  private nullToken(value: string): string {
    return value === '' || value == null ? 'null' : value;
  }
}
