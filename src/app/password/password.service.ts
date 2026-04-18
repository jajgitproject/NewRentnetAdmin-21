// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { Password } from './password.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import {Password } from './password.model';
@Injectable()
export class PasswordService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + 'auth/';
  }

  password(model: Password) {
    return this.httpClient.post<any>(this.API_URL + 'reset', model);
  }
  /** CRUD METHODS */
  getTableData(SearchPassword:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchPassword==="")
    {
      SearchPassword="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPassword + '/' + SearchActivationStatus +'/' + PageNumber + '/Password/Ascending');
  }

  getTableDataSort(SearchPassword:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchPassword==="")
    {
      SearchPassword="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPassword + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Password) 
  {
    // advanceTable.passwordID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Password)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(passwordID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ passwordID);
  }

}
  

