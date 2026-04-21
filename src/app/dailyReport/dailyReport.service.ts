// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DailyReport } from './dailyReport.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DailyReportService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dailyReport";
  }
  /** CRUD METHODS */
  getTableData(SearchDateInDutySlip:string, SearchEndDateInDutySlip:string,SearchregistrationNo:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchDateInDutySlip==="")
    {
      SearchDateInDutySlip="null";
    }
    if(SearchEndDateInDutySlip==="")
    {
      SearchEndDateInDutySlip="null";
    }
    if(SearchregistrationNo === "")
    {
      SearchregistrationNo = "null"; 
    }
    
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+SearchDateInDutySlip +'/' +SearchEndDateInDutySlip +'/' +SearchregistrationNo +'/' +SearchActivationStatus +'/' + PageNumber + '/InventoryDailyTargetAchievementID/Ascending');
  }

  getTableDataSort(SearchDateInDutySlip:string, SearchEndDateInDutySlip:string,SearchregistrationNo:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchDateInDutySlip==="")
    {
      SearchDateInDutySlip="null";
    }
    if(SearchEndDateInDutySlip==="")
    {
      SearchEndDateInDutySlip="null";
    }
    if(SearchregistrationNo==="")
    {
      SearchregistrationNo="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+SearchDateInDutySlip +'/' +SearchEndDateInDutySlip +'/' +SearchregistrationNo +'/'  +SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
}
