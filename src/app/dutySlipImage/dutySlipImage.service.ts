// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DutySlipImage } from './dutySlipImage.model';
@Injectable()
export class DutySlipImageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutySlipImage";
  }
  /** CRUD METHODS */
  getTableData(SearchStartDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    // if(driverID===0)
    // {
    //   driverID=0;
    // }
    // if(inventoryID===0)
    // {
    //   inventoryID=0;
    // }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ SearchStartDate + '/' + SearchActivationStatus +'/' + PageNumber + '/dutySlipQualityCheckID/Ascending');
  }
  getTableDataSort(SearchStartDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL +"/"+ SearchStartDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+ coloumName +'/'+ sortType);
  }
  add(advanceTable: DutySlipImage) 
  {
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutySlipImage)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyQualityCheckID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ dutyQualityCheckID);
  }

  getAllotmentIDForDutySlipImage(AllotmentID:number)
  {
    console.log(this.API_URL+"/"+'GetDutySlipImage'+"/"+AllotmentID)
    return this.httpClient.get(this.API_URL+"/"+'GetDutySlipImage'+"/"+AllotmentID);
  }
}
