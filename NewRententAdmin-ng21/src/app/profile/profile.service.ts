// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GeneralService } from '../general/general.service';


@Injectable()
export class ProfileService 
{
  private API_URL:string = '';
  private Employee_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "employee";
    this.Employee_API_URL=generalService.BaseURL+ "employeePickupPointType";
  }
  /** CRUD METHODS */

   getTableData(LoginUserID: number):  Observable<any> 
  {
    if(LoginUserID===0)
    {
      LoginUserID=0;
    }
   
    return this.httpClient.get(this.API_URL + "/"+ 'ForProfile' + "/" +LoginUserID);
  }


 
  
}
  

