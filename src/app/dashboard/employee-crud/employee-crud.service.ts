// @ts-nocheck
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeCrud } from './employee-crud.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeCrudTestService {
  private readonly API_URL = 'assets/data/advanceTable.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<EmployeeCrud[]> = new BehaviorSubject<EmployeeCrud[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): EmployeeCrud[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllAdvanceTableTests(): void {
    this.httpClient.get<EmployeeCrud[]>(this.API_URL).subscribe(
      (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        this.isTblLoading = false;
      }
    );
  }
  addAdvanceTableTest(AdvanceTableTest: EmployeeCrud): void {
    this.dialogData = AdvanceTableTest;

  }
  updateAdvanceTableTest(ProofOFDocumentTest:EmployeeCrud): void {
    this.dialogData = ProofOFDocumentTest;

  }
  deleteAdvanceTableTest(id: number): void {
  }
}

