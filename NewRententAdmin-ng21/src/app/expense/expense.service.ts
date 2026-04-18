// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseModel } from './expense.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ExpenseService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "expense";
  }
  /** CRUD METHODS */
  getTableData(SearchExpense:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchExpense === "")
    {
      SearchExpense = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchExpense + '/' + SearchActivationStatus +'/' + PageNumber + '/ExpenseID/Ascending');
  }
  getTableDataSort(SearchExpense:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchExpense === "")
    {
      SearchExpense = "null";
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchExpense + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ExpenseModel) 
  {
    advanceTable.expenseID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ExpenseModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(expenseID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ expenseID + '/'+ userID);
  }

}
  

