// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ContractTariffVerificationService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'contractTariffVerification';
  }

  getContractsForAutocomplete(searchText: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/contractsForAutocomplete', {
      params: { searchText: searchText || '' },
    });
  }

  getDutyTypes(customerContractId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + '/dutyTypes/' + customerContractId);
  }

  search(customerContractId: number, packageTypeId: number, roleName: string): Observable<any> {
    return this.httpClient.get(this.API_URL + '/search/' + customerContractId + '/' + packageTypeId, {
      params: { roleName: roleName || '' },
    });
  }

  verify(body: any): Observable<any> {
    return this.httpClient.put(this.API_URL + '/verify', body);
  }

  reject(body: any): Observable<any> {
    return this.httpClient.put(this.API_URL + '/reject', body);
  }

  getLog(rateTableName: string, rateRowId: number): Observable<any[]> {
    const table = encodeURIComponent(rateTableName || '');
    return this.httpClient.get<any[]>(this.API_URL + '/log/' + table + '/' + rateRowId);
  }

  getRowDetails(rateTableName: string, rateRowId: number): Observable<any> {
    const table = encodeURIComponent(rateTableName || '');
    return this.httpClient.get(this.API_URL + '/rowDetails/' + table + '/' + rateRowId);
  }
}
