// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { SingleDutySingleBill } from './singleDutySingleBill.model';

@Injectable()
export class SingleDutySingleBillService {
  private API_URL: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'invoicecalculation/';
  }

  BillInfo(dutySlipID: number): Observable<any> 
  {
    console.log(this.API_URL + 'getinvoice/' + dutySlipID);
    return this.httpClient.get(this.API_URL + 'getinvoice/' + dutySlipID);
  }
  
}

