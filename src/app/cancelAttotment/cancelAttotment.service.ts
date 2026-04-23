// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CancelAttotment } from './cancelAttotment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CancelAttotmentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "allotment";
  }
  /** CRUD METHODS */
  getTableData(SearchCancelAttotmentName:string,SearchCancelAttotmentCode:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCancelAttotmentName==="")
    {
      SearchCancelAttotmentName="null";
    }
    if(SearchCancelAttotmentCode==="")
    {
      SearchCancelAttotmentCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCancelAttotmentName + '/' +SearchCancelAttotmentCode + '/' + SearchActivationStatus +'/' + PageNumber + '/cancelAttotmentName/Ascending');
  }
  getTableDataSort(SearchCancelAttotmentName:string,SearchCancelAttotmentCode:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCancelAttotmentName==="")
    {
      SearchCancelAttotmentName="null";
    }
    if(SearchCancelAttotmentCode==="")
    {
      SearchCancelAttotmentCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCancelAttotmentName + '/' +SearchCancelAttotmentCode + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CancelAttotment) 
  {
    advanceTable.allotmentID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CancelAttotment)
  {
    
     advanceTable.cancellationByEmployeeID=this.generalService.getUserID();
     advanceTable.dateOfCancellation= this.generalService.getTodaysDate();
     advanceTable.timeOfCancellation= this.generalService.getCurrentTime();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(CancelAttotmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ CancelAttotmentID);
  }
}
  

