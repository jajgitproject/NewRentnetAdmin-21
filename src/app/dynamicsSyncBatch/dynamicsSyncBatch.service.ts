import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { DynamicsSyncBatch, mapDynamicsSyncBatch } from './dynamicsSyncBatch.model';

@Injectable()
export class DynamicsSyncBatchService {
  private apiUrl = '';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.apiUrl = generalService.BaseURL + 'DynamicsSyncBatch';
  }

  listBatches(
    pageNumber = 0,
    pageSize = 20,
    syncSource?: 'invoice' | 'creditNote'
  ): Observable<{ batches: DynamicsSyncBatch[]; totalCount: number }> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber))
      .set('pageSize', String(pageSize));
    if (syncSource === 'invoice' || syncSource === 'creditNote') {
      params = params.set('syncSource', syncSource);
    }
    return this.httpClient.get<any>(this.apiUrl, { params }).pipe(
      map((response) => ({
        batches: (response?.batches || []).map((row) => mapDynamicsSyncBatch(row)),
        totalCount: Number(response?.totalCount ?? response?.TotalCount ?? 0) || 0
      }))
    );
  }

  getBatch(batchId: number): Observable<DynamicsSyncBatch> {
    return this.httpClient.get<any>(`${this.apiUrl}/${batchId}`).pipe(
      map((response) => mapDynamicsSyncBatch(response))
    );
  }
}
