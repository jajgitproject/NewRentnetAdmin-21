// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerAllowedCarsInCDP } from './customerAllowedCarsInCDP.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerAllowedCarsInCDPService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAllowedCarsInCDP";
  }
  /** CRUD METHODS */
 getTableData(
  customerGroupID: number,
  searchvehicle: string,
  SearchActivationStatus: boolean,
  PageNumber: number
): Observable<any> {

  if (customerGroupID === null || customerGroupID === undefined) {
    //throw new Error('CustomerGroupID is required');
  }

  searchvehicle = searchvehicle ? searchvehicle : 'null';

  return this.httpClient.get(
    `${this.API_URL}/${customerGroupID}/${searchvehicle}/${SearchActivationStatus}/${PageNumber}/allowedCarsInCDPID/Ascending`
  );
}

  getTableDataSort(customerGroupID:number,searchvehicle:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchvehicle==="")
    {
      searchvehicle="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/' +searchvehicle + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerAllowedCarsInCDP) 
  {
    advanceTable.allowedCarsInCDPID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAllowedCarsInCDP)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(allowedCarsInCDPID: number):  Observable<any> 
  {
    
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ allowedCarsInCDPID + '/'+ userID);
  }
}
