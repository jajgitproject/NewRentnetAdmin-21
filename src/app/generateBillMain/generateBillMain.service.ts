// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe, formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { GenerateBillMainModel } from './generateBillMain.model';
@Injectable()
export class GenerateBillMainService 
{
  private API_URL:string = '';
  private API_URL_GetData:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "InvoiceGeneral";
    this.API_URL_GetData=generalService.BaseURL+ "generalBill";
  }

  private toRouteParam(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    const text = String(value).trim();
    if (text === '' || text === 'null') {
      return 'null';
    }
    if (text.startsWith('#')) {
      return encodeURIComponent(text);
    }
    let normalized = text;
    while (normalized.endsWith('.')) {
      normalized = normalized.slice(0, -1);
    }
    return encodeURIComponent(normalized).replace(/\./g, '%2E');
  }

  /** Invoice numbers use '/' in DB; route segments use '-' instead. */
  private toInvoiceRouteParam(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    const text = String(value).trim();
    if (text === '' || text === 'null') {
      return 'null';
    }
    // Use '~' in the URL path; commas can break ASP.NET route matching even when encoded.
    const withTildeSeparators = text.replace(/,/g, '~');
    return this.toRouteParam(withTildeSeparators.replace(/\//g, '-'));
  }

  private buildSearchUrl(
    SearchCustomer: string,
    SearchInvoiceNumberWithPrefix: string,
    SearchGuset: string,
    SearchBillDate: string,
    SearchStartDate: string,
    SearchEndDate: string,
    SearchActivationStatus: boolean,
    PageNumber: number,
    orderByColumn: string,
    sortType: string
  ): string {
    return (
      this.API_URL_GetData +
      '/GetAllGeneralBillMain/' +
      this.toRouteParam(SearchCustomer) +
      '/' +
      this.toInvoiceRouteParam(SearchInvoiceNumberWithPrefix) +
      '/' +
      this.toRouteParam(SearchGuset) +
      '/' +
      this.toRouteParam(SearchBillDate) +
      '/' +
      this.toRouteParam(SearchStartDate) +
      '/' +
      this.toRouteParam(SearchEndDate) +
      '/' +
      this.toRouteParam(SearchActivationStatus) +
      '/' +
      PageNumber +
      '/' +
      encodeURIComponent(orderByColumn) +
      '/' +
      encodeURIComponent(sortType)
    );
  }

  // Alternative method to get customer address from general customer API
  getCustomerAddressFromGeneral(customerID: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + "generalBillMain/ForCustomerBehalfDataDetails/" + customerID);
  }

  /** IsSEZ from CustomerConfigurationInvoicing for Customer + State + Bill Date within StartDate/EndDate */
  getIsSEZByCustomerStateAndDate(customerID: number, stateID: number, effectiveDate: string): Observable<{ isSEZ: boolean | null }> {
    return this.httpClient.get<{ isSEZ: boolean | null }>(
      this.generalService.BaseURL + "customerConfigurationInvoicing/GetIsSEZ/" + customerID + "/" + stateID + "/" + effectiveDate
    );
  }

  getBillToShipToForCustomer(customerID: number): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${this.generalService.BaseURL}customerBillToShipTo/0/${customerID}/true/0/CustomerConfigurationBillToShipToID/Ascending`
    );
  }

  getBillToShipToById(customerConfigurationBillToShipToID: number): Observable<any> {
    return this.httpClient.get<any>(
      `${this.generalService.BaseURL}customerBillToShipTo/${customerConfigurationBillToShipToID}`
    );
  }
  
  /** CRUD METHODS */
  getTableData(SearchCustomer:string, SearchInvoiceNumberWithPrefix:string,SearchGuset:string,SearchBillDate:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    if(SearchCustomer==="")
    {
      SearchCustomer=null;
    }
    if(SearchInvoiceNumberWithPrefix==="")
    {
      SearchInvoiceNumberWithPrefix=null;
    }
    if(SearchGuset==="")
    {
      SearchGuset=null;
    }
    if(SearchBillDate==="")
    {
      SearchBillDate=null;
    }
    if(SearchStartDate==="")
    {
      SearchStartDate=null;
    }
    if(SearchEndDate==="")
    {
      SearchEndDate=null;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(
      this.buildSearchUrl(
        SearchCustomer,
        SearchInvoiceNumberWithPrefix,
        SearchGuset,
        SearchBillDate,
        SearchStartDate,
        SearchEndDate,
        SearchActivationStatus,
        PageNumber,
        'InvoiceID',
        'Ascending'
      )
    );
  }
  getTableDataSort(SearchCustomer:string,SearchInvoiceNumberWithPrefix:string, SearchGuset:string,SearchBillDate:string,SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
   
    if(SearchCustomer==="")
    {
      SearchCustomer=null;
    }
     if(SearchInvoiceNumberWithPrefix==="")
    {
      SearchInvoiceNumberWithPrefix=null;
    }
    if(SearchGuset==="")
    {
      SearchGuset=null;
    }
    if(SearchBillDate==="")
    {
      SearchBillDate=null;
    }
    if(SearchStartDate==="")
    {
      SearchStartDate=null;
    }
    if(SearchEndDate==="")
    {
      SearchEndDate=null;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(
      this.buildSearchUrl(
        SearchCustomer,
        SearchInvoiceNumberWithPrefix,
        SearchGuset,
        SearchBillDate,
        SearchStartDate,
        SearchEndDate,
        SearchActivationStatus,
        PageNumber,
        coloumName,
        sortType
      )
    );
  }

  add(advanceTable: GenerateBillMainModel) 
  {
    advanceTable.invoiceID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.invoiceNumberIssuedByID=this.generalService.getUserID();
    advanceTable.customerID = Number(advanceTable.customerID) || 0;
    advanceTable.cityID = Number(advanceTable.cityID) || 0;
    advanceTable.passengerID = Number(advanceTable.passengerID || advanceTable.customerPersonNameID) || 0;
    advanceTable.ecoBillingBranchID = Number(advanceTable.ecoBillingBranchID) || 0;
    const shipToId = Number(advanceTable.customerConfigurationBillToShipToID);
    advanceTable.customerConfigurationBillToShipToID = shipToId > 0 ? shipToId : null;
    advanceTable.invoiceDateString = formatDate(advanceTable.invoiceDate, 'yyyy-MM-dd', 'en-IN');
    advanceTable.billFromDateString = formatDate(
      advanceTable.billFromDate,
      'yyyy-MM-dd',
      'en-IN'
    );
    advanceTable.billToDateString = formatDate(
      advanceTable.billToDate,
      'yyyy-MM-dd',
      'en-IN'
    );
    advanceTable.billFromDate = advanceTable.billFromDateString as any;
    advanceTable.billToDate = advanceTable.billToDateString as any;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: GenerateBillMainModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.invoiceNumberIssuedByID=this.generalService.getUserID();
    advanceTable.invoiceDateString=this.generalService.getTimeApplicable(advanceTable.invoiceDate).toString().slice(0, 19);
   advanceTable.billFromDateString = formatDate(
    advanceTable.billFromDate,
    'yyyy-MM-dd',
    'en-IN'
  );

  advanceTable.billToDateString = formatDate(
    advanceTable.billToDate,
    'yyyy-MM-dd',
    'en-IN'
  );

  // Don't send Date objects
  advanceTable.billFromDate = advanceTable.billFromDateString as any;
  advanceTable.billToDate = advanceTable.billToDateString as any;

    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(invoiceID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ invoiceID+ '/'+ userID);
  }

}
  

