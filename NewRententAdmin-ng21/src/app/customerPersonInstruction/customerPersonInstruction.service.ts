// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonInstruction } from './customerPersonInstruction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonInstructionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonInstruction";
  }
  /** CRUD METHODS */
  getTableData(customerPerson_ID:number,SearchName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + customerPerson_ID + '/' +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonInstructionID/Ascending');
  }
  getTableDataSort(customerPerson_ID:number,SearchName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + customerPerson_ID + '/' +SearchName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonInstruction) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerPersonInstructionID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonInstruction)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonInstructionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonInstructionID + '/'+ userID);
  }
}
