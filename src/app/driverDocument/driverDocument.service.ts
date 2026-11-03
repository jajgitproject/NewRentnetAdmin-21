// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DriverDocument } from './driverDocument.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { DocumentDropDown } from '../general/documentDropDown.model';
@Injectable()
export class DriverDocumentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverDocument";
  }
  /** CRUD METHODS */
  getTableData(
    driverID: number,
    searchAddressCity: string,
    searchDocumentNumber: string,
    searchDocumentIssuingAuthority: string,
    searchAddress: string,
    SearchActivationStatus: boolean,
    searchDocumentID: string,
    searchDocumentStartDateFrom: string,
    searchDocumentStartDateTo: string,
    searchDocumentExpiryFrom: string,
    searchDocumentExpiryTo: string,
    searchQcStatus: string,
    PageNumber: number
  ): Observable<any> {
    return this.httpClient.get(
      this.buildTableDataUrl(
        driverID,
        searchAddressCity,
        searchDocumentNumber,
        searchDocumentIssuingAuthority,
        searchAddress,
        SearchActivationStatus,
        searchDocumentID,
        searchDocumentStartDateFrom,
        searchDocumentStartDateTo,
        searchDocumentExpiryFrom,
        searchDocumentExpiryTo,
        searchQcStatus,
        PageNumber,
        'DriverDocumentID',
        'Ascending'
      )
    );
  }

  getTableDataSort(
    driverID: number,
    searchAddressCity: string,
    searchDocumentNumber: string,
    searchDocumentIssuingAuthority: string,
    searchAddress: string,
    SearchActivationStatus: boolean,
    searchDocumentID: string,
    searchDocumentStartDateFrom: string,
    searchDocumentStartDateTo: string,
    searchDocumentExpiryFrom: string,
    searchDocumentExpiryTo: string,
    searchQcStatus: string,
    PageNumber: number,
    coloumName: string,
    sortType: string
  ): Observable<any> {
    return this.httpClient.get(
      this.buildTableDataUrl(
        driverID,
        searchAddressCity,
        searchDocumentNumber,
        searchDocumentIssuingAuthority,
        searchAddress,
        SearchActivationStatus,
        searchDocumentID,
        searchDocumentStartDateFrom,
        searchDocumentStartDateTo,
        searchDocumentExpiryFrom,
        searchDocumentExpiryTo,
        searchQcStatus,
        PageNumber,
        coloumName,
        sortType
      )
    );
  }

  private buildTableDataUrl(
    driverID: number,
    searchAddressCity: string,
    searchDocumentNumber: string,
    searchDocumentIssuingAuthority: string,
    searchAddress: string,
    SearchActivationStatus: boolean,
    searchDocumentID: string,
    searchDocumentStartDateFrom: string,
    searchDocumentStartDateTo: string,
    searchDocumentExpiryFrom: string,
    searchDocumentExpiryTo: string,
    searchQcStatus: string,
    PageNumber: number,
    orderByColumn: string,
    order: string
  ): string {
    const segments = [
      driverID ?? 0,
      this.nullIfEmpty(searchAddressCity),
      this.nullIfEmpty(searchDocumentNumber),
      this.nullIfEmpty(searchDocumentIssuingAuthority),
      this.nullIfEmpty(searchAddress),
      SearchActivationStatus === null ? 'null' : SearchActivationStatus,
      this.nullIfEmpty(searchDocumentID),
      this.nullIfEmpty(searchDocumentStartDateFrom),
      this.nullIfEmpty(searchDocumentStartDateTo),
      this.nullIfEmpty(searchDocumentExpiryFrom),
      this.nullIfEmpty(searchDocumentExpiryTo),
      this.nullIfEmpty(searchQcStatus),
      PageNumber,
      orderByColumn,
      order,
    ];
    return (
      this.API_URL +
      '/' +
      segments.map((segment) => encodeURIComponent(String(segment))).join('/')
    );
  }

  private nullIfEmpty(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return String(value);
  }

  getById(driverDocumentID: number): Observable<DriverDocument> {
    return this.httpClient.get<DriverDocument>(this.API_URL + '/' + driverDocumentID);
  }

  add(advanceTable: DriverDocument) 
  {
    advanceTable.driverDocumentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    this.applyDriverDocumentDates(advanceTable);
    this.normalizeOptionalTextFields(advanceTable);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: DriverDocument)
  {
    advanceTable.userID=this.generalService.getUserID();
    this.applyDriverDocumentDates(advanceTable);
    this.normalizeOptionalTextFields(advanceTable);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  private applyDriverDocumentDates(advanceTable: DriverDocument): void {
    advanceTable.documentExpiryString = this.generalService.getTimeApplicable(advanceTable.documentExpiry);
    if (advanceTable.documentStartDate) {
      advanceTable.documentStartDateString = this.generalService.getTimeApplicable(advanceTable.documentStartDate);
    } else {
      advanceTable.documentStartDate = null;
      advanceTable.documentStartDateString = null;
    }
  }

  private normalizeOptionalTextFields(advanceTable: DriverDocument): void {
    if (!advanceTable.documentNumber?.trim()) {
      advanceTable.documentNumber = null;
    }
    if (!advanceTable.documentIssuingAuthority?.trim()) {
      advanceTable.documentIssuingAuthority = null;
    }
    if (advanceTable.documentImage?.trim()) {
      advanceTable.documentImageNonAvailabilityReason = null;
    } else if (!advanceTable.documentImageNonAvailabilityReason?.trim()) {
      advanceTable.documentImageNonAvailabilityReason = null;
    }
  }

  delete(driverDocumentID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverDocumentID  + '/'+ userID) ;
  }

  GetDocumentForDriver(): Observable<DocumentDropDown[]> 
  {
    return this.generalService.getDocumentRequiredforDriver();
  }
}
