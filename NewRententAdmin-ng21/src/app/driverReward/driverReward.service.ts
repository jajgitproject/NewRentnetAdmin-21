// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverReward } from './driverReward.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverRewardService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverReward";
  }
  /** CRUD METHODS */
  getTableData(searchdriverGradeName:string,searchrewardAmount:string,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchrewardAmount==="")
    {
      searchrewardAmount="null";
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchdriverGradeName + '/'+searchrewardAmount + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber + '/driverRewardID/Ascending');
  }
  getTableDataSort(searchdriverGradeName:string,searchrewardAmount:string,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchrewardAmount==="")
    {
      searchrewardAmount="null";
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchdriverGradeName + '/'+searchrewardAmount + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: DriverReward) 
  {
    advanceTable.driverRewardID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DriverReward)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(driverRewardID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverRewardID  + '/'+ userID);
  }
}
