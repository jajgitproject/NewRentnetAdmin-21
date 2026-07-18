// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { IndividualCustomerModel } from './individualCustomer.model';

@Injectable()
export class IndividualCustomerService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerIndividual';
  }

  add(advanceTable: IndividualCustomerModel): Observable<any> {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }
}
