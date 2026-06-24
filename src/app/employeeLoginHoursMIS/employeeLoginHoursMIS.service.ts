// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import moment from 'moment';

@Injectable()
export class EmployeeLoginHoursMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'employeeLoginHours';
  }

  getSummary(employeeId: string, fromDate: any, toDate: any, groupBy: string, pageNumber: number, employeeName: string, employeeMobile: string, locationId: string, locationName: string, loginStatus: string, forExport = false): Observable<any> {
    return this.httpClient.get(this.buildUrl('summary', employeeId, fromDate, toDate, groupBy, pageNumber), {
      params: this.buildSearchParams(employeeName, employeeMobile, locationId, locationName, loginStatus, forExport),
    });
  }

  getSessions(employeeId: string, fromDate: any, toDate: any, pageNumber: number, employeeName: string, employeeMobile: string, locationId: string, locationName: string, loginStatus: string, forExport = false): Observable<any> {
    return this.httpClient.get(this.buildUrl('sessions', employeeId, fromDate, toDate, 'day', pageNumber), {
      params: this.buildSearchParams(employeeName, employeeMobile, locationId, locationName, loginStatus, forExport),
    });
  }

  getDaily(employeeId: string, fromDate: any, toDate: any, pageNumber: number, employeeName: string, employeeMobile: string, locationId: string, locationName: string, loginStatus: string, forExport = false): Observable<any> {
    return this.httpClient.get(this.buildUrl('daily', employeeId, fromDate, toDate, 'day', pageNumber), {
      params: this.buildSearchParams(employeeName, employeeMobile, locationId, locationName, loginStatus, forExport),
    });
  }

  private buildUrl(action: string, employeeId: string, fromDate: any, toDate: any, groupBy: string, pageNumber: number): string {
    const from = this.formatApiDate(fromDate);
    const to = this.formatApiDate(toDate);
    const emp = this.nullToken(employeeId);
    if (action === 'summary') {
      return `${this.API_URL}/summary/${emp}/${from}/${to}/null/${groupBy}/${pageNumber}`;
    }
    if (action === 'daily') {
      return `${this.API_URL}/daily/${emp}/${from}/${to}/${pageNumber}`;
    }
    return `${this.API_URL}/sessions/${emp}/${from}/${to}/${pageNumber}`;
  }

  private buildSearchParams(employeeName: string, employeeMobile: string, locationId: string, locationName: string, loginStatus: string, forExport: boolean): HttpParams {
    let params = new HttpParams();
    const name = (employeeName || '').trim();
    const mobile = (employeeMobile || '').trim();
    const locId = (locationId || '').trim();
    const locName = (locationName || '').trim();
    const status = (loginStatus || '').trim();
    if (name) params = params.set('employeeName', name);
    if (mobile) params = params.set('employeeMobile', mobile);
    if (locId) params = params.set('locationId', locId);
    if (locName) params = params.set('locationName', locName);
    if (status && status !== 'all') params = params.set('loginStatus', status);
    if (forExport) params = params.set('forExport', 'true');
    return params;
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
