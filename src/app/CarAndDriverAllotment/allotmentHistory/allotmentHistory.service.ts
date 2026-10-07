// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../../general/general.service';

@Injectable()
export class AllotmentHistoryService {
  private allotmentUrl = '';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.allotmentUrl = generalService.BaseURL + 'allotment';
  }

  getAllotmentHistoryByReservation(reservationID: number) {
    return this.httpClient.get(
      this.allotmentUrl + '/allotmentHistoryByReservation/' + reservationID
    );
  }
}
