// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyTollParkingEntry } from './dutyTollParkingEntry.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyTollParkingEntryService 
{
  private API_URL:string = '';
  private API_URL_Info:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyTollParkingEntry";
    this.API_URL_Info=generalService.BaseURL+ "dutyTollParkingEntryDetails";
  }
  /** CRUD METHODS */
  getTableData(SearchDutyTollParkingID:number,DutySlipID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyTollParkingID+ "/" +DutySlipID + '/' + SearchActivationStatus +'/' + PageNumber + '/DutyTollParkingID/Ascending');
  }
  getTableDataSort(SearchDutyTollParkingID:number, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDutyTollParkingID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DutyTollParkingEntry) 
  {
    advanceTable.dutyTollParkingID=-1;
    advanceTable.approvalRemark=null;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.approvalDateString=this.generalService.getTimeApplicable(advanceTable.approvalDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: DutyTollParkingEntry)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.approvalDateString=this.generalService.getTimeApplicable(advanceTable.approvalDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(dutyTollParkingEntryID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyTollParkingEntryID+ '/'+ userID);
  }

  GetTollParkingData(DutySlipID:Number)
  {
    return this.httpClient.get(this.API_URL + "/"+'GetDutyTollParking'+ "/"+ DutySlipID);
  }

  GetTollParkingInfo(DutySlipID:Number)
  {
    return this.httpClient.get(this.API_URL_Info + "/"+'GetDutyTollParkingEntryDetails'+ "/"+ DutySlipID);
  }
}
  

