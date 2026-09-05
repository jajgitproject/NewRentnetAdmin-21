// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { RejectedQCDriverPhotoSearchCriteria } from './rejectedQCDriverPhoto.model';

@Injectable()
export class RejectedQCDriverPhotoService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'rejectedQCDriverPhoto';
  }

  downloadRejectedDriverPhotos(criteria: RejectedQCDriverPhotoSearchCriteria): Observable<HttpResponse<Blob>> {
    return this.httpClient.post(`${this.API_URL}/download`, {
      qcDateFrom: criteria.qcDateFrom,
      qcDateTo: criteria.qcDateTo,
      imageCount: criteria.imageCount
    }, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
