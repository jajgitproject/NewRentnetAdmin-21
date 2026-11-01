// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';

@Injectable()
export class TicketService {
  private API_URL = '';

  constructor(private http: HttpClient, private general: GeneralService) {
    this.API_URL = general.BaseURL + 'ticket';
  }

  employeeId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const employee = user.employee || user.Employee || {};
      return Number(employee.EmployeeID || employee.employeeID || 0);
    } catch {
      return 0;
    }
  }

  context(): Observable<any> {
    return this.shape(this.http.get(this.API_URL + '/context/' + this.employeeId()));
  }

  list(filters: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters || {}).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value);
      }
    });
    return this.shape(this.http.get(this.API_URL + '/list/' + this.employeeId(), { params }));
  }

  detail(ticketId: number): Observable<any> {
    return this.shape(this.http.get(this.API_URL + '/detail/' + ticketId + '/' + this.employeeId()));
  }

  create(body: any): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/create', {
      ...body,
      employeeID: this.employeeId(),
      ticketApplicationID: Number(body.ticketApplicationID)
    }));
  }

  assign(body: any): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/assign', { ...body, employeeID: this.employeeId() }));
  }

  status(body: any): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/status', { ...body, employeeID: this.employeeId() }));
  }

  remark(remark: string, ticketId: number): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/remark', { ticketID: ticketId, remark, employeeID: this.employeeId() }));
  }

  priority(body: any): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/priority', { ...body, employeeID: this.employeeId() }));
  }

  assignees(ticketId: number): Observable<any> {
    const params = new HttpParams().set('ticketId', String(ticketId));
    return this.shape(this.http.get(this.API_URL + '/assignees/' + this.employeeId(), { params }));
  }

  masters(): Observable<any> {
    return this.shape(this.http.get(this.API_URL + '/masters/' + this.employeeId()));
  }

  saveApplication(name: string): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/application', { name, employeeID: this.employeeId() }));
  }

  saveDeveloper(name: string): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/developer', { name, employeeID: this.employeeId() }));
  }

  saveLead(name: string): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/lead', { name, employeeID: this.employeeId() }));
  }

  saveTarget(priorityName: string, resolutionMinutes: number): Observable<any> {
    return this.shape(this.http.post(this.API_URL + '/target', { priorityName, resolutionMinutes, employeeID: this.employeeId() }));
  }

  performance(fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.shape(this.http.get(this.API_URL + '/performance/' + this.employeeId(), { params }));
  }

  dashboard(): Observable<any> {
    return this.shape(this.http.get(this.API_URL + '/dashboard/' + this.employeeId()));
  }

  notifications(): Observable<any> {
    return this.shape(this.http.get(this.API_URL + '/notifications/' + this.employeeId()));
  }

  upload(ticketId: number, file: File): Observable<any> {
    const data = new FormData();
    data.append('ticketId', String(ticketId));
    data.append('employeeId', String(this.employeeId()));
    data.append('file', file);
    return this.shape(this.http.post(this.API_URL + '/attachment', data));
  }

  attachmentUrl(attachmentId: number): string {
    return this.API_URL + '/attachment/' + attachmentId + '/' + this.employeeId();
  }

  isActive(item: any): boolean {
    const status = item?.activationStatus;
    if (status === true || status === 1 || status === '1') {
      return true;
    }
    return String(status ?? '').toLowerCase() === 'true';
  }

  errorMessage(error: any): string {
    if (typeof error === 'string' && error.trim()) {
      return error.trim();
    }
    return error?.error?.message || error?.error?.Message || 'Request failed.';
  }

  private shape(source: Observable<any>): Observable<any> {
    return source.pipe(map((data) => this.camel(data)));
  }

  private camel(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.camel(item));
    }
    if (value && typeof value === 'object') {
      const shaped = {};
      Object.keys(value).forEach((key) => {
        const next = key ? key.charAt(0).toLowerCase() + key.slice(1) : key;
        shaped[next] = this.camel(value[key]);
      });
      return shaped;
    }
    return value;
  }
}
