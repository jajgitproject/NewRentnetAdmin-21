// @ts-nocheck
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CityMaster } from './city-master.model';

@Injectable({
  providedIn: 'root'
})
export class CityMasterTestService {
  private readonly API_URL = 'assets/data/advanceTable.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<CityMaster[]> = new BehaviorSubject<CityMaster[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): CityMaster[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllAdvanceTableTests(): void {
    this.httpClient.get<CityMaster[]>(this.API_URL).subscribe(
      (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        this.isTblLoading = false;
      }
    );
  }
  addAdvanceTableTest(AdvanceTableTest: CityMaster): void {
    this.dialogData = AdvanceTableTest;

  }
  updateAdvanceTableTest(ProofOFDocumentTest:CityMaster): void {
    this.dialogData = ProofOFDocumentTest;

  }
  deleteAdvanceTableTest(id: number): void {
  }
}

