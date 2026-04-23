// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerAllowedPackageTypesInCDP } from './customerAllowedPackageTypesInCDP.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerAllowedPackageTypesInCDPService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAllowedPackageTypesInCDP";
  }
  /** CRUD METHODS */
 getTableData(
  customerGroupID: number,
  searchpackage: string,
  SearchActivationStatus: boolean,
  PageNumber: number
): Observable<any> {

  if (customerGroupID === null || customerGroupID === undefined) {
    //throw new Error('CustomerGroupID is required');
  }

  searchpackage = searchpackage ? searchpackage : 'null';

  return this.httpClient.get(
    `${this.API_URL}/${customerGroupID}/${searchpackage}/${SearchActivationStatus}/${PageNumber}/allowedPackageTypesInCDPID/Ascending`
  );
}

  getTableDataSort(customerGroupID:number,searchpackage:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchpackage==="")
    {
      searchpackage="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/' +searchpackage + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerAllowedPackageTypesInCDP) 
  {
    advanceTable.allowedPackageTypesInCDPID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAllowedPackageTypesInCDP)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(allowedPackageTypesInCDPID: number):  Observable<any> 
  {
    
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ allowedPackageTypesInCDPID + '/'+ userID);
  }
}
