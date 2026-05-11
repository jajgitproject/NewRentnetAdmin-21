import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ChangeCityModel } from './changeCity.model';

@Injectable()
export class ChangeCityService 
{
  private API_URL:string = '';
  private API_URL_ForMOPEdit:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "changeCity";

  }
  /** CRUD METHODS */
  GetCityAvailable(ContractID: number,PackageTypeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetCityAvailable/' + ContractID + '/' + PackageTypeID);
  }

  update(advanceTable: ChangeCityModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
}
  

