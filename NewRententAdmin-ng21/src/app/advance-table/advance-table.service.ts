// @ts-nocheck
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { AdvanceTable } from './advance-table.model';

@Injectable({
  providedIn: 'root',
})
export class AdvanceTableService {
  private readonly API_URL = 'assets/data/advanceTable.json';
  private httpClient = inject(HttpClient);

  /** GET: Fetch all advance tables */
  getAllAdvanceTables(): Observable<AdvanceTable[]> {
    return this.httpClient
      .get<AdvanceTable[]>(this.API_URL)
      .pipe(catchError(this.handleError));
  }

  /** POST: Add a new advance table */
  addAdvanceTable(advanceTable: AdvanceTable): Observable<AdvanceTable> {
    return of(advanceTable).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  /** PUT: Update an existing advance table */
  updateAdvanceTable(advanceTable: AdvanceTable): Observable<AdvanceTable> {
    return of(advanceTable).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  /** DELETE: Remove an advance table by ID */
  deleteAdvanceTable(id: number): Observable<number> {
    return of(id).pipe(
      map(() => id),
      catchError(this.handleError)
    );
  }

  /** Handle Http operation that failed */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}

