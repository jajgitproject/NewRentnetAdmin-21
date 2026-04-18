// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Page } from './page.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { PageGroupDropDown } from '../pageGroup/pageGroupDropDown.model';
@Injectable()
export class PageService 
{
  private API_URL:string = '';
  private API_URL_PageGroup:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "page";
    this.API_URL_PageGroup=generalService.BaseURL+ "pageGroup";
  }
  /** CRUD METHODS */
  getTableData(SearchPage:string, SearchParentMenuID: number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    this.Result = "Failure";
    if(SearchPage==="")
    {
      SearchPage="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }

    return this.httpClient.get(this.API_URL + "/" + SearchPage + "/" + SearchParentMenuID  + '/' + SearchActivationStatus +'/' + PageNumber + '/Page/Ascending');
  }

  getTableDataSort(SearchPage:string, SearchParentMenuID: number, SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchPage==="")
    {
      SearchPage="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' +SearchPage+ '/' +SearchParentMenuID+  '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Page) 
  {
    this.Result="Failure";
    advanceTable.pageID=-1;
   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Page)
  {
    
    this.Result="Failure";
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(pageID: number):  Observable<any> 
  {
    this.Result="Failure";
    return this.httpClient.delete(this.API_URL + "/" + pageID);
  }
  
    GetPageGroup(): Observable<PageGroupDropDown[]> {
      return this.httpClient.get<PageGroupDropDown[]>(this.API_URL_PageGroup + "/ForDropDown");
    }
}
