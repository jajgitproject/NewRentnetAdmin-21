// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CancelAllotment } from './cancelAllotment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CancelAllotmentService 
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
  getTableData(SearchCancelAllotmentName:string,SearchCancelAllotmentCode:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCancelAllotmentName==="")
    {
      SearchCancelAllotmentName="null";
    }
    if(SearchCancelAllotmentCode==="")
    {
      SearchCancelAllotmentCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCancelAllotmentName + '/' +SearchCancelAllotmentCode + '/' + SearchActivationStatus +'/' + PageNumber + '/cancelAllotmentName/Ascending');
  }
  getTableDataSort(SearchCancelAllotmentName:string,SearchCancelAllotmentCode:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCancelAllotmentName==="")
    {
      SearchCancelAllotmentName="null";
    }
    if(SearchCancelAllotmentCode==="")
    {
      SearchCancelAllotmentCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCancelAllotmentName + '/' +SearchCancelAllotmentCode + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CancelAllotment) 
  {
    advanceTable.allotmentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CancelAllotment)
  {
    
     advanceTable.cancellationByEmployeeID=this.generalService.getUserID();
     advanceTable.dateOfCancellation= this.generalService.getTodaysDate();
     advanceTable.timeOfCancellation= this.generalService.getCurrentTime();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(CancelAllotmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ CancelAllotmentID);
  }

 
 updateAllotmentType(AllotmentTypeData:any)
  {
    AllotmentTypeData.UserID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL +"/UpdateAllotmentType/",AllotmentTypeData);
  }

}
  

