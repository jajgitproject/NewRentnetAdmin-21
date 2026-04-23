// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonPreferedDriver } from './customerPersonPreferedDriver.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonPreferedDriverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonPreferedDriver";
  }
  /** CRUD METHODS */
  getTableData(customerPersonID:number,SearchName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerPersonID===0)
    {
      customerPersonID=0;
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerPersonID + '/'+SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonPreferedDriverID/Ascending');
  }
  getTableDataSort(customerPersonID:number,SearchName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerPersonID===0)
    {
      customerPersonID=0;
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+customerPersonID + '/' +SearchName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonPreferedDriver) 
  {
    advanceTable.customerPersonPreferedDriverID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonPreferedDriver)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonPreferedDriverID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonPreferedDriverID  + '/'+ userID);
  }
}
