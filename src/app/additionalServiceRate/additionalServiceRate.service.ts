// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdditionalServiceRate } from './additionalServiceRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AdditionalServiceRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "additionalServiceRate";
  }
  /** CRUD METHODS */
  getTableData(SearchRate:string,Service_ID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(Service_ID===0)
    {
      Service_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchRate + '/'+Service_ID + '/' + SearchActivationStatus +'/' + PageNumber + '/AdditionalServiceRateID/Ascending');
  }
  getTableDataSort(SearchRate:string,Service_ID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(Service_ID===0)
    {
      Service_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchRate + '/'+Service_ID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: AdditionalServiceRate) 
  {
    
    advanceTable.additionalServiceRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AdditionalServiceRate)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeFromS(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeFromS(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(additionalServiceRateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ additionalServiceRateID+ '/'+ userID);
  }
}
