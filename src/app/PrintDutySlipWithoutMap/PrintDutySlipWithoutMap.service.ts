// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { PrintDutySlipWithoutMap } from './PrintDutySlipWithoutMap.model';

@Injectable()
export class PrintDutySlipWithoutMapService {
  private API_URL: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) 
  {
    this.API_URL = generalService.BaseURL + 'controlPanel/';
  }

  printDutySlipInfo(ReservationID: number): Observable<any> 
  {
    return this.httpClient.get(this.API_URL + 'printDutySlipInfo/' + ReservationID);
  }
}

