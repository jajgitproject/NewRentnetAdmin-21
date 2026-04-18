// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdvanceTableTest } from './advance-table-test.model';

@Injectable({
  providedIn: 'root'
})
export class AdvanceTableTestService {
  private readonly API_URL = 'assets/data/advanceTable.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTableTest[]> = new BehaviorSubject<
    AdvanceTableTest[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): AdvanceTableTest[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAdvanceTableTests(): void {
    this.httpClient.get<AdvanceTableTest[]>(this.API_URL).subscribe(
      (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  addAdvanceTableTest(AdvanceTableTest: AdvanceTableTest): void {
    this.dialogData = AdvanceTableTest;

    /*  this.httpClient.post(this.API_URL, AdvanceTableTest).subscribe(data => {
      this.dialogData = AdvanceTableTest;
      },
      (err: HttpErrorResponse) => {
     // error code here
    });*/
  }
  updateAdvanceTableTest(AdvanceTableTest: AdvanceTableTest): void {
    this.dialogData = AdvanceTableTest;

    /* this.httpClient.put(this.API_URL + AdvanceTableTest.id, AdvanceTableTest).subscribe(data => {
      this.dialogData = AdvanceTableTest;
    },
    (err: HttpErrorResponse) => {
      // error code here
    }
  );*/
  }
  deleteAdvanceTableTest(id: number): void {
    console.log(id);

    /*  this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(id);
      },
      (err: HttpErrorResponse) => {
         // error code here
      }
    );*/
  }
}

