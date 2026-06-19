// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { SummaryOfDutyData } from '../summaryOfDuty/summary-of-duty.model';
import {
  buildMergedInvoiceCalculationPayload,
  hasInvoiceCalculationResult,
  invoiceCalculationNeedsFullDetailMerge,
  mapInvoiceCalculationToSummaryOfDuty,
  summaryOfDutyHasDisplayableData,
  unwrapInvoiceCalculationPayload
} from '../summaryOfDuty/invoice-calculation-to-summary-of-duty.mapper';
import { ChangeSupplierForInventoryModel } from './clossingOne.model';

export const SUMMARY_LOAD_FAILED_MESSAGE =
  'Bill calculated but summary could not be loaded. Check rate card / GST configuration.';

export interface CalculateBillSummaryResult {
  message: string;
  payload: Record<string, unknown>;
  summary: SummaryOfDutyData;
}

@Injectable()
export class ClossingOneService 
{
  private API_URL:string = '';
  private API_URL_ClosingData:string = '';
  private API_URL_ReservationInfo ='';
  private API_CalculateBill:string = '';
  private API_GenerateBill:string = '';
  private API_URL_CurrentDutyInfo:string = '';
  private API_URL_Bill:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "Closing";
    this.API_URL_ClosingData=generalService.BaseURL+ "dutySlipForBilling";
    this.API_URL_ReservationInfo=generalService.BaseURL+ "reservation";
    this.API_GenerateBill =generalService.BaseURL+ "InvoiceGeneral/createInvoiceSingleDuty";
    this.API_CalculateBill =generalService.BaseURL+ "InvoiceCalculation/calculate";
    this.API_URL_CurrentDutyInfo=generalService.BaseURL+ "currentDuty";
    this.API_URL_Bill = generalService.BaseURL + 'invoicecalculation';
  }

  getClosingData(AllotmentID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_ClosingData+ '/'+ 'GetClosingData' + '/' +AllotmentID);
  }
   getClosingGSTData(ReservationID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_ClosingData+ '/'+ 'GetGSTData' + '/' +ReservationID);
  }
  
  GetClosingData(DutySlipID:any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL +"/"+DutySlipID);
  }
   GetBillFromTo(CustomerContractID:number,PackageID:number,PackageType:string): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + "/" + 'GetBillFromTo' + "/" + CustomerContractID + "/" + PackageID + "/" + PackageType);
  }
   PackageTypeForLTR(PackageTypeID:Number)
  {
    return this.httpClient.get(this.API_URL_ReservationInfo + "/"+'getPackageTypeForLTR'+ "/"+ PackageTypeID);
  }
    generateBill(dutySlipID:any):  Observable<any> 
  { 
    let userID=this.generalService.getUserID();
    return this.httpClient.get(this.API_GenerateBill+'/'+dutySlipID + '/'+userID);
  }
 calculateBill(dutySlipID:any):  Observable<any> 
  { 
    return this.httpClient.get(this.API_CalculateBill+'/'+dutySlipID);
  }

  /**
   * Calculate bill, merge duty-billing-summary when needed, and map to Summary of Duty rows.
   * Throws a string error when calculate returns empty/204 or summary cannot be built.
   */
  calculateBillWithSummary(dutySlipID: number | string): Observable<CalculateBillSummaryResult> {
    return this.calculateBill(dutySlipID).pipe(
      switchMap((calcRes) => {
        if (!hasInvoiceCalculationResult(calcRes)) {
          return throwError(
            () => 'Bill calculation returned no data. Check rate card / GST configuration.'
          );
        }
        const calc = unwrapInvoiceCalculationPayload(calcRes);
        if (!invoiceCalculationNeedsFullDetailMerge(calc)) {
          return of(calcRes);
        }
        return this.getDutyBillingSummary(dutySlipID).pipe(
          map((summaryRes) => buildMergedInvoiceCalculationPayload(calcRes, summaryRes)),
          switchMap((merged) =>
            merged == null ? throwError(() => SUMMARY_LOAD_FAILED_MESSAGE) : of(merged)
          ),
          catchError(() => throwError(() => SUMMARY_LOAD_FAILED_MESSAGE))
        );
      }),
      switchMap((response) => {
        const payload =
          response != null && typeof response === 'object'
            ? (unwrapInvoiceCalculationPayload(response) ?? (response as Record<string, unknown>))
            : null;
        if (payload == null) {
          return throwError(() => SUMMARY_LOAD_FAILED_MESSAGE);
        }
        const summary = mapInvoiceCalculationToSummaryOfDuty(payload);
        if (!summaryOfDutyHasDisplayableData(summary)) {
          return throwError(() => SUMMARY_LOAD_FAILED_MESSAGE);
        }
        const raw = response as Record<string, unknown>;
        const message = String(raw?.message ?? raw?.Message ?? '');
        return of({ message, payload, summary });
      })
    );
  }

  /** Full persisted calculation for Summary of Duty: `GET invoicecalculation/duty-billing-summary/{DutySlipID}`. */
  getDutyBillingSummary(dutySlipID: number | string): Observable<any> {
    return this.httpClient.get(this.API_URL_Bill + '/duty-billing-summary/' + dutySlipID);
  }

  /** Full invoice calculation row + nested models (same as `GetInvoiceCalculationByDutySlipID`). */
  getInvoiceCalculationFullByDutySlipId(dutySlipID: number | string): Observable<any> {
    return this.httpClient.get(this.API_URL_Bill + '/getinvoice/' + dutySlipID);
  }

  /** GST row only: `GET invoicecalculation/gst/dutyslip/{dutySlipId}` (same data as `invoiceGSTModel` on getinvoice). */
  getInvoiceGstByDutySlipId(dutySlipID: number | string): Observable<any> {
    return this.httpClient.get(this.API_URL_Bill + '/gst/dutyslip/' + dutySlipID);
  }

  /** GST row by `InvoiceCalculationID`: `GET invoicecalculation/gst/bycalculation/{id}`. */
  getInvoiceGstByInvoiceCalculationId(invoiceCalculationID: number | string): Observable<any> {
    return this.httpClient.get(this.API_URL_Bill + '/gst/bycalculation/' + invoiceCalculationID);
  }
   getDutySlipMap(dutySlipID:any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL_CurrentDutyInfo +'/' +dutySlipID);
  }
     getVerifyDutydata(reservationID:any): Observable<any>{
      return this.httpClient.get(this.API_URL+ "/" + 'GetVerifyDutyStatus' + "/" + reservationID);
  }
  

  GetTotalTollParInStDispute(DutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/' + 'TotalTollParInStDispute' + '/' + DutySlipID);
  }
  printDutySlipInfo(invoiceID: number): Observable<any> {
    return this.httpClient.get(this.API_URL_Bill + "/"+'getinvoice'+ "/" + invoiceID);
  }

  updateSupplierForInventory(advanceTable: ChangeSupplierForInventoryModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL + '/' + 'UpdateSupplierForInventory' , advanceTable);
  }

}

  

