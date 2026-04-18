// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InvoiceCreditNoteDutySlipAdjustmentModel } from './creditNoteDutyAdjustment.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
@Injectable()
export class CreditNoteDutyAdjustmentService {
  private API_URL: string = '';
  private API_URL_Driver: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "creditNoteDutyAdjustment";
    this.API_URL_Driver = generalService.BaseURL + "driver";
  }

  /** CRUD METHODS */
  getTableData(InvoiceID:number,InvoiceCreditNoteID:number,searchActivationStatus: boolean,PageNumber: number): Observable<any> 
  {
    if (searchActivationStatus === null) 
    {
      searchActivationStatus = null;
    }    
    return this.httpClient.get(this.API_URL + '/' + InvoiceID + '/' + InvoiceCreditNoteID + '/' + searchActivationStatus + '/' + PageNumber + '/InvoiceCreditNoteDutySlipAdjustmentID/Descending');
  }

  getTableDataSort(InvoiceID:number,InvoiceCreditNoteID:number,searchActivationStatus: boolean,PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if (searchActivationStatus === null) 
    {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + InvoiceID + '/' + InvoiceCreditNoteID + '/' + searchActivationStatus + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InvoiceCreditNoteDutySlipAdjustmentModel) 
  {
    advanceTable.invoiceCreditNoteDutySlipAdjustmentID=-1;
    advanceTable.adjustedByID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: InvoiceCreditNoteDutySlipAdjustmentModel)
  {
    advanceTable.adjustedByID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(InvoiceCreditNoteDutySlipAdjustmentID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ InvoiceCreditNoteDutySlipAdjustmentID + '/'+ userID);
  }

  getDriver(): Observable<DriverDropDown[]> 
  {
    return this.httpClient.get<DriverDropDown[]>(this.API_URL_Driver + '/GetDriverForDropDown');
  }

  getDriverSupplier(DutySlipID:number) :  Observable<any>
  {
    return this.httpClient.get(this.API_URL + '/GetDriverSupplier/' + DutySlipID);
  }
}
