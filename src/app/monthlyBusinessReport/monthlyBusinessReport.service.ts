// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MonthlyBusinessReport } from './monthlyBusinessReport.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class MonthlyBusinessReportService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "monthlyBusinessReport";
  }
  /** CRUD METHODS */
  getTableData(inventoryID:number,
    searchSelectedMonth:number,
    year:number,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchSelectedMonth==0)
    {
      searchSelectedMonth=0;
    }
    if(year===0)
      {
        year=0;
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +inventoryID+ "/" +searchSelectedMonth+ "/" +year+ "/"+ SearchActivationStatus +'/' + PageNumber + '/inventoryMonthlyTargetAchievementID/Dscending');
  }
  getTableDataSort(
    inventoryID:number,
    searchSelectedMonth:number,
    year:number,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchSelectedMonth==0)
      {
        searchSelectedMonth=0;
      }
      if(year===0)
        {
          year=0;
        }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + "/" +inventoryID+ "/" +searchSelectedMonth+ "/" +year+ "/" + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: MonthlyBusinessReport) 
  {
    //advanceTable.monthlyBusinessReportID=-1;
    if(advanceTable.includeChildren){
      advanceTable.includeChildren=true;
    }
    else{
     advanceTable.includeChildren=false;
    }
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: MonthlyBusinessReport)
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(monthlyBusinessReportID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ monthlyBusinessReportID);
  }
}
