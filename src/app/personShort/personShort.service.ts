// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonShort } from './personShort.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PersonShortService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "personShort";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string,
    SearchPrimary:string,
    SearchBilling:string,
    CustomerGroupID:number,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchPrimary==="")
    {
      SearchPrimary="null";
    }
    if(SearchBilling==="")
    {
      SearchBilling="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchPrimary + '/'+SearchBilling + '/'+CustomerGroupID + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonName/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchPrimary:string,
    SearchBilling:string,
    CustomerGroupID:number,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchPrimary==="")
    {
      SearchPrimary="null";
    }
    if(SearchBilling==="")
    {
      SearchBilling="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchPrimary + '/'+SearchBilling + '/'+CustomerGroupID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: PersonShort) 
  {
    advanceTable.customerPersonID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: PersonShort)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonID);
  }
}
