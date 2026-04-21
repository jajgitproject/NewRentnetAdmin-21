// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { TravllerBookingPage } from './travllerBookingPage.model';


@Injectable()
export class TravllerBookingPageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "adminBookingPage";
  }
  /** CRUD METHODS */
  getTableData(SearchColor:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchColor==="")
    {
      SearchColor="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchColor + '/' + SearchActivationStatus +'/' + PageNumber + '/Color/Ascending');
  }
  getTableDataSort(SearchColor:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchColor==="")
    {
      SearchColor="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchColor + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: TravllerBookingPage) 
  {
    
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: TravllerBookingPage)
  {
    
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(colorID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ colorID  + '/'+ userID);
  }

}
  

