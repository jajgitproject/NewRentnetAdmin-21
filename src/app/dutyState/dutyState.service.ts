// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DutyState } from './dutyState.model';
@Injectable()
export class DutyStateService 
{
  private API_URL:string = '';
  private API_URL_Closing:string = '';
  private API_URL_City:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyState";
    this.API_URL_Closing=generalService.BaseURL+ "dutyStateClosing";
    this.API_URL_City=generalService.BaseURL+ "city/GetEcoDutyStateForClosing";
  }
  /** CRUD METHODS */
  getTableData(dutySlipID:number):  Observable<any> 
  {
   
    return this.httpClient.get(this.API_URL + "/" + dutySlipID );
  }
  // getTableDataSort(SearchBank:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchBank==="")
  //   {
  //     SearchBank="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   //console.log(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
  //   return this.httpClient.get(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  add(advanceTable:  DutyState) 
  {
    advanceTable.dutyStateID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicableTO(advanceTable.changeDateTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable:  DutyState)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeDateTimeString=this.generalService.getTimeApplicableTO(advanceTable.changeDateTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyStateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyStateID+ '/'+ userID);
  }
  getTableDataClosing(dutySlipID:number):  Observable<any> 
  {
   
    return this.httpClient.get(this.API_URL_Closing + "/" + dutySlipID );
  }
   GetEcoDutyStateForClosing():  Observable<any> 
  {
   
    return this.httpClient.get(this.API_URL_City);
  }

  normalizeDutyStateRows(data: any): any[] {
    if (!data) {
      return [];
    }
    return Array.isArray(data) ? data.filter(Boolean) : [data];
  }

  isDutyStateRecordNewer(candidate: any, current: any): boolean {
    if (!current) {
      return true;
    }
    const candidateTime = new Date(candidate?.changeDateTime).getTime();
    const currentTime = new Date(current?.changeDateTime).getTime();
    if (!isNaN(candidateTime) && !isNaN(currentTime) && candidateTime !== currentTime) {
      return candidateTime > currentTime;
    }
    return (candidate?.dutyStateID || 0) > (current?.dutyStateID || 0);
  }

  getLatestDutyStateRecord(data: any): any | null {
    const rows = this.normalizeDutyStateRows(data);
    if (rows.length === 0) {
      return null;
    }
    return rows.reduce((latest, row) =>
      this.isDutyStateRecordNewer(row, latest) ? row : latest
    );
  }

  sortDutyStateRecordsNewestFirst(data: any): any {
    const rows = this.normalizeDutyStateRows(data);
    if (rows.length === 0) {
      return data;
    }
    const sorted = [...rows].sort((a, b) => {
      const timeDiff = new Date(b?.changeDateTime).getTime() - new Date(a?.changeDateTime).getTime();
      if (!isNaN(timeDiff) && timeDiff !== 0) {
        return timeDiff;
      }
      return (b?.dutyStateID || 0) - (a?.dutyStateID || 0);
    });
    return Array.isArray(data) ? sorted : sorted[0];
  }

  hasIssuedInvoice(dutySlipID: number): Observable<boolean> {
    return this.httpClient.get(`${this.generalService.BaseURL}Closing/${dutySlipID}`).pipe(
      map((data: any) => Number(data?.invoiceID || data?.InvoiceID) > 0)
    );
  }
}
  

