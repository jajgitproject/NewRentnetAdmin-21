// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ClossingOneService 
{
  private API_URL:string = '';
  private API_URL_ClosingData:string = '';
  private API_URL_ReservationInfo ='';
  private API_CalculateBill:string = '';
  private API_GenerateBill:string = '';
  private API_URL_CurrentDutyInfo:string = '';
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
  
}

  

