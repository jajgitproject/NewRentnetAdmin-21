// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';


@Injectable()
export class DutySlipAccentureService 
{
  private API_URL: string = '';
  private API_URL_invoiceDuty: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'DutySlipPrinting';
  }

  printDutySlipInfo(DutySlipID: number): Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/"+'GetDutySlipDataForPrinting'+ "/" + DutySlipID);
  }

}

