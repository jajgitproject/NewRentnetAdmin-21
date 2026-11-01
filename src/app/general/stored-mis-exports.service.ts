// @ts-nocheck
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from './general.service';

@Injectable({ providedIn: 'root' })
export class StoredMisExportsService {
  constructor(private httpClient: HttpClient, private generalService: GeneralService) {}

  private get baseUrl(): string {
    return this.generalService.BaseURL + 'misExportJobs';
  }

  private userParams() {
    return { params: { userId: String(this.generalService.getUserID() || 0) } };
  }

  listStored(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/stored`, this.userParams());
  }

  listQueued(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/queued`);
  }

  download(jobId: string): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}/Download/${jobId}`, { responseType: 'blob' });
  }

  delete(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/Delete/${jobId}`, {}, this.userParams());
  }

  cancel(jobId: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/Cancel/${jobId}`, {}, this.userParams());
  }
}
