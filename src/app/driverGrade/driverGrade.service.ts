// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverGrade } from './driverGrade.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverGradeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverGrade";
  }
  /** CRUD METHODS */
  getTableData(SearchdriverGradeName:string,searchnextGrade:string,searchpreviousGrade:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchdriverGradeName==="")
    {
      SearchdriverGradeName="null";
    }
    if(searchnextGrade==="")
    {
      searchnextGrade="null";
    }
    if(searchpreviousGrade==="")
    {
      searchpreviousGrade="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdriverGradeName + '/'+searchnextGrade + '/'+searchpreviousGrade + '/' + SearchActivationStatus +'/' + PageNumber + '/driverGradeName/Ascending');
  }
  getTableDataSort(searchdriverGradeName:string,searchnextGrade:string,searchpreviousGrade:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchdriverGradeName==="")
    {
      searchdriverGradeName="null";
    }
    if(searchnextGrade==="")
    {
      searchnextGrade="null";
    }
    if(searchpreviousGrade==="")
    {
      searchpreviousGrade="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchdriverGradeName + '/' +searchnextGrade +'/'+searchpreviousGrade + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DriverGrade) 
  {
    advanceTable.driverGradeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DriverGrade)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(driverGradeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ driverGradeID  + '/'+ userID);
  }

}
  

