// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BillingInstruction } from './billingInstruction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BillingInstructionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "billingInstruction";
  }
  /** CRUD METHODS */
  getTableData(SearchBillingInstruction:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchBillingInstruction==="")
    {
      SearchBillingInstruction="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBillingInstruction + '/' + SearchActivationStatus +'/' + PageNumber + '/BillingInstruction/Ascending');
  }

  getTableDataSort(SearchBillingInstruction:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchBillingInstruction==="")
    {
      SearchBillingInstruction="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBillingInstruction + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: BillingInstruction) 
  {
    advanceTable.billingInstructionID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BillingInstruction)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(billingInstructionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ billingInstructionID + '/'+ userID);
  }

}
  

