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

  listBatches(take = 25): Observable<DynamicsSyncBatch[]> {
    const params = new HttpParams().set('take', String(take));
    return this.httpClient.get<any>(this.apiUrl, { params }).pipe(
      map((response) => (response?.batches || []).map((row) => mapDynamicsSyncBatch(row)))
    );
  }

  getBatch(batchId: number): Observable<DynamicsSyncBatch> {
    return this.httpClient.get<any>(`${this.apiUrl}/${batchId}`).pipe(
      map((response) => mapDynamicsSyncBatch(response))
    );
  }
}
