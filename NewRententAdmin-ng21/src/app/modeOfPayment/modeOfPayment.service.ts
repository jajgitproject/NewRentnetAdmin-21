// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModeOfPayment } from './modeOfPayment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ModeOfPaymentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "modeOfPayment";
  }
  /** CRUD METHODS */
  getTableData(SearchModeOfPayment:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchModeOfPayment==="")
    {
      SearchModeOfPayment="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchModeOfPayment + '/' + SearchActivationStatus +'/' + PageNumber + '/ModeOfPayment/Ascending');
  }
  getTableDataSort(SearchModeOfPayment:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchModeOfPayment==="")
    {
      SearchModeOfPayment="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchModeOfPayment + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ModeOfPayment) 
  {
    advanceTable.modeOfPaymentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    if(advanceTable.oldRentNetPaymentMode==="")
    {
      advanceTable.oldRentNetPaymentMode = null;
    }
    else
    {
      advanceTable.oldRentNetPaymentMode = advanceTable.oldRentNetPaymentMode;
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ModeOfPayment)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(modeOfPaymentID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ modeOfPaymentID + '/' + userID);
  }

  
}
  

