// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CDCLocalFixedDetails } from './cdcLocalFixedDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CDCLocalFixedDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cdcLocalFixedDetails";
  }
  /** CRUD METHODS */
  getTableData(customerContract_ID:number, SearchBillFromTo:string,SearchPackageJumpCriteria:string, SearchNextPackageCriteria:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBillFromTo==="")
      {
        SearchBillFromTo=null;
      }
      if(SearchPackageJumpCriteria==="")
        {
          SearchPackageJumpCriteria=null;
        }
        if(SearchNextPackageCriteria==="")
          {
            SearchNextPackageCriteria=null;
          }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContract_ID + '/' + SearchBillFromTo + '/' + SearchPackageJumpCriteria + '/' + SearchNextPackageCriteria + '/' + SearchActivationStatus +'/' + PageNumber + '/billFromTo/Ascending');
  }

  getTableDataSort(customerContract_ID:number,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerContract_ID  + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CDCLocalFixedDetails) 
  {
    advanceTable.cdcLocalFixedDetailsID=-1;
    
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CDCLocalFixedDetails)
  {
   
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cdcLocalFixedDetailsDetailsID
: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cdcLocalFixedDetailsDetailsID + '/'+ userID);

  }
}
