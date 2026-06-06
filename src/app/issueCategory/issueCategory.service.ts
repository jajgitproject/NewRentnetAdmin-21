// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IssueCategory } from './issueCategory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class IssueCategoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "issueCategory";
  }
  /** CRUD METHODS */
  getTableData(SearchIssueCategory:string, SearchSeverity:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchIssueCategory==="")
    {
      SearchIssueCategory="null";
    }
    if(SearchSeverity==="" || SearchSeverity==null)
    {
      SearchSeverity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchIssueCategory + '/' + SearchSeverity + '/' + SearchActivationStatus +'/' + PageNumber + '/IssueCategory/Ascending');
  }
  getTableDataSort(SearchIssueCategory:string, SearchSeverity:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchIssueCategory==="")
    {
      SearchIssueCategory="null";
    }
    if(SearchSeverity==="" || SearchSeverity==null)
    {
      SearchSeverity="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchIssueCategory + '/' + SearchSeverity + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: IssueCategory) 
  {
    advanceTable.issueCategoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: IssueCategory)
  {
advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(issueCategoryID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ issueCategoryID + '/'+ userID);
  }

}
  

