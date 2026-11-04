// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeKamForCustomers } from './changeKamForCustomers.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

function readInt(row: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const val = row[key];
    if (val != null && val !== '' && !Number.isNaN(Number(val))) {
      const n = Number(val);
      if (n > 0) {
        return n;
      }
    }
  }
  return 0;
}

function readRecordId(row: Record<string, unknown> | null | undefined): number {
  if (!row) {
    return 0;
  }
  return readInt(row, [
    'customerKeyAccountManagerID',
    'CustomerKeyAccountManagerID',
    'keyAccountManagerUpdateID',
    'KeyAccountManagerUpdateID',
  ]);
}

function readOldKamId(row: Record<string, unknown>): number {
  return readInt(row, ['oldKAMID', 'OldKAMID', 'oldKeyAccountManagerID', 'OldKeyAccountManagerID']);
}

function readNewKamId(row: Record<string, unknown>): number {
  return readInt(row, ['newKAMID', 'NewKAMID', 'newKeyAccountManagerID', 'NewKeyAccountManagerID']);
}

function readStartDate(row: Record<string, unknown>): Date | null {
  const fromRaw =
    row['newKAMActivationFromDate'] ??
    row['NewKAMActivationFromDate'] ??
    row['startDate'] ??
    row['StartDate'];
  if (fromRaw instanceof Date && !isNaN(fromRaw.getTime())) {
    return fromRaw;
  }
  if (fromRaw != null && fromRaw !== '') {
    const parsed = new Date(fromRaw as string);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

/** Normalize list API rows so edit/delete always have KeyAccountManagerUpdateID and valid dates. */
function normalizeChangeKamListRow(row: Record<string, unknown> | null | undefined): Record<string, unknown> | null {
  if (!row || typeof row !== 'object') {
    return null;
  }
  const recordId = readRecordId(row);
  const startRaw =
    row['startDate'] ?? row['StartDate'] ?? row['newKAMActivationFromDate'] ?? row['NewKAMActivationFromDate'];
  let startDate: Date | unknown = startRaw;
  if (startRaw != null && startRaw !== '' && !(startRaw instanceof Date)) {
    const parsed = new Date(startRaw as string);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
    }
  }
  const updationRaw = row['updationDateTime'] ?? row['UpdationDateTime'];
  let updationDateTime: Date | unknown = updationRaw;
  if (updationRaw != null && updationRaw !== '' && !(updationRaw instanceof Date)) {
    const parsed = new Date(updationRaw as string);
    if (!isNaN(parsed.getTime())) {
      updationDateTime = parsed;
    }
  }
  return {
    ...row,
    customerKeyAccountManagerID: recordId,
    keyAccountManagerUpdateID: recordId,
    oldKAMID: Number(row['oldKAMID'] ?? row['oldKeyAccountManagerID'] ?? row['OldKeyAccountManagerID'] ?? 0),
    newKAMID: Number(row['newKAMID'] ?? row['newKeyAccountManagerID'] ?? row['NewKeyAccountManagerID'] ?? 0),
    oldKeyAccountManagerName:
      row['oldKeyAccountManagerName'] ?? row['OldKeyAccountManagerName'] ?? row['oldCustomerkamEmployee'],
    newKeyAccountManagerName:
      row['newKeyAccountManagerName'] ?? row['NewKeyAccountManagerName'] ?? row['newCustomerkamEmployee'],
    startDate,
    newKAMActivationFromDate: startDate,
    updationDateTime,
  };
}

@Injectable()
export class ChangeKamForCustomersService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerKAMChange";
    //this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  getRecordId(row: Record<string, unknown> | null | undefined): number {
    return readRecordId(normalizeChangeKamListRow(row) ?? row ?? null);
  }

  private buildUpdateDeleteBody(
    row: Record<string, unknown>,
    fallback?: Record<string, unknown> | null
  ): Record<string, unknown> | null {
    const merged = {
      ...(fallback || {}),
      ...row,
    } as Record<string, unknown>;
    const recordId = readRecordId(merged) || readRecordId(fallback ?? null);
    const oldKamId = readOldKamId(merged) || readOldKamId(fallback ?? {});
    const newKamId = readNewKamId(merged) || readNewKamId(fallback ?? {});
    const fromDate = readStartDate(merged) ?? readStartDate(fallback ?? {});
    const userID = this.generalService.getUserID();
    if (!recordId || !oldKamId || !newKamId) {
      return null;
    }
    return {
      customerKeyAccountManagerID: recordId,
      CustomerKeyAccountManagerID: recordId,
      oldKAMID: oldKamId,
      OldKAMID: oldKamId,
      oldKeyAccountManagerID: oldKamId,
      OldKeyAccountManagerID: oldKamId,
      newKAMID: newKamId,
      NewKAMID: newKamId,
      newKeyAccountManagerID: newKamId,
      NewKeyAccountManagerID: newKamId,
      userID,
      UserID: userID,
      updatedByID: userID,
      UpdatedByID: userID,
      newKAMActivationFromDate: fromDate,
      NewKAMActivationFromDate: fromDate,
      startDate: fromDate,
      StartDate: fromDate,
    };
  }

  private mapListResponse(data: unknown): unknown {
    if (!Array.isArray(data)) {
      return data;
    }
    return data
      .map((row) => normalizeChangeKamListRow(row as Record<string, unknown>))
      .filter((row): row is Record<string, unknown> => row != null);
  }

  /** CRUD METHODS */
  getTableData(SearchEmployeeName:string,SearchFromDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
  if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
     if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
 
   
    return this.httpClient
      .get(
        this.API_URL +
          '/' +
          SearchEmployeeName +
          '/' +
          SearchFromDate +
          '/' +
          SearchActivationStatus +
          '/' +
          PageNumber +
          '/keyAccountManagerUpdateID/Ascending'
      )
      .pipe(map((data) => this.mapListResponse(data)));
  }

  getTableDataSort(SearchEmployeeName:string,SearchnewKAMActivationFromDate:string, SearchnewKAMActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
     if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchnewKAMActivationFromDate==="")
    {
      SearchnewKAMActivationFromDate="null";
    }
    if(SearchnewKAMActivationStatus===null)
    {
      SearchnewKAMActivationStatus=null;
    }
 
    return this.httpClient
      .get(
        this.API_URL +
          '/' +
          SearchEmployeeName +
          '/' +
          SearchnewKAMActivationFromDate +
          '/' +
          SearchnewKAMActivationStatus +
          '/' +
          PageNumber +
          '/' +
          coloumName +
          '/' +
          sortType
      )
      .pipe(map((data) => this.mapListResponse(data)));
  }

  add(advanceTable: ChangeKamForCustomers) 
  {
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.customerKeyAccountManagerID=-1;
    advanceTable.newKAMActivationFromDateString=this.generalService.getTimeApplicable(advanceTable.newKAMActivationFromDate);
   // advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(
    advanceTable: ChangeKamForCustomers | Record<string, unknown>,
    fallbackRow?: Record<string, unknown> | null
  ) {
    const body = this.buildUpdateDeleteBody(advanceTable as Record<string, unknown>, fallbackRow);
    if (!body) {
      return throwError(() => new Error('Missing KeyAccountManagerUpdateID or KAM employee IDs'));
    }
    const putUrl = this.API_URL;
    const postUpdateUrl = this.API_URL + '/Update';
    return this.httpClient.post<any>(postUpdateUrl, body).pipe(
      catchError(() => this.httpClient.put<any>(putUrl, body))
    );
  }
  delete(changeKamForCustomersid: number):  Observable<any> 
  {
    const recordId = Number(changeKamForCustomersid);
    if (!recordId || recordId <= 0) {
      return throwError(() => new Error('Invalid KeyAccountManagerUpdateID'));
    }
    const userID = this.generalService.getUserID();
    const deleteUrl = this.API_URL + '/' + recordId + '/' + userID;
    const postDeleteUrl = this.API_URL + '/Delete/' + recordId + '/' + userID;
    return this.httpClient.post<any>(postDeleteUrl, {}).pipe(
      catchError(() => this.httpClient.delete(deleteUrl))
    );
  }
  // GetEmployeeData(employeeID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  // }
}
