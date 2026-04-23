// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonDriverRestriction } from './customerPersonDriverRestriction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonDriverRestrictionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonDriverRestriction";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string,CustomerPersonID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+CustomerPersonID + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonDriverRestrictionID/Ascending');
  }
  getTableDataSort(SearchName:string,CustomerPersonID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+CustomerPersonID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonDriverRestriction) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerPersonDriverRestrictionID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonDriverRestriction)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonDriverRestrictionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonDriverRestrictionID + '/'+ userID);
  }
}
