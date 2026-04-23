// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonInventoryRestriction } from './customerPersonInventoryRestriction.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerPersonInventoryRestrictionService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonInventoryRestriction";
  }
  /** CRUD METHODS */
  getTableData(RegistrationNumber:string,CustomerPersonID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(RegistrationNumber==="")
    {
      RegistrationNumber="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +RegistrationNumber + '/'+CustomerPersonID + '/' + SearchActivationStatus +'/' + PageNumber + '/customerPersonInventoryRestrictionID/Ascending');
  }
  getTableDataSort(RegistrationNumber:string,CustomerPersonID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(RegistrationNumber==="")
    {
      RegistrationNumber="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +RegistrationNumber + '/'+CustomerPersonID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonInventoryRestriction) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerPersonInventoryRestrictionID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonInventoryRestriction)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonInventoryRestrictionID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonInventoryRestrictionID + '/'+ userID);
  }
}
