// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Salutation } from './salutation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SalutationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "salutation";
  }
  /** CRUD METHODS */
  getTableData(SearchSalutation:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchSalutation==="")
    {
      SearchSalutation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSalutation + '/' + SearchActivationStatus +'/' + PageNumber + '/Salutation/Ascending');
  }

  getTableDataSort(SearchSalutation:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchSalutation==="")
    {
      SearchSalutation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSalutation + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Salutation) 
  {
    advanceTable.salutationID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Salutation)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(salutationID: number):  Observable<any> 
  {
    debugger;
    return this.httpClient.delete(this.API_URL + '/'+ salutationID);
  }
}
