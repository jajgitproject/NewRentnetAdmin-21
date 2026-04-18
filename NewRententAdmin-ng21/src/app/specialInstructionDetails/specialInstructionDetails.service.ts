// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpecialInstructionDetails } from './specialInstructionDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SpecialInstructionDetailsService 
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
  getspecialInstructionDetails(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForSpecialInstructionLoadData/' + reservationID}`);
  }

  add(advanceTable: SpecialInstructionDetails) 
  {
   
    advanceTable.reservationSpecialInstructionID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SpecialInstructionDetails)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationSpecialInstructionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationSpecialInstructionID + '/'+ userID);
  }

}
  

