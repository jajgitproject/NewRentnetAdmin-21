// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpecialInstruction } from './specialInstruction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SpecialInstructionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "specialInstruction";
  }
  /** CRUD METHODS */
  getTableData(SearchSpecialInstruction:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchSpecialInstruction==="")
    {
      SearchSpecialInstruction="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSpecialInstruction + '/' + SearchActivationStatus +'/' + PageNumber + '/SpecialInstruction/Ascending');
  }

  getTableDataSort(SearchSpecialInstruction:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchSpecialInstruction==="")
    {
      SearchSpecialInstruction="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSpecialInstruction + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SpecialInstruction) 
  {
    advanceTable.reservationSpecialInstructionID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SpecialInstruction)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(specialInstructionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ specialInstructionID + '/'+ userID);
  }

  
}
  

