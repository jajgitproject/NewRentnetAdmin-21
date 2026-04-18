// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerCarAndDriverDetailsSMSEMail } from './customerCarAndDriverDetailsSMSEMail.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerCarAndDriverDetailsSMSEMailService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCarAndDriverDetailsSMSEMail";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchmobile:string,searchemail:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchmobile==="")
    {
      searchmobile="null";
    }
    if(searchemail==="")
    {
      searchemail="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchmobile + '/'+searchemail + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerCarAndDriverDetailsSMSEMailID/Ascending');
  }
  getTableDataSort(customerID:number,searchmobile:string,searchemail:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchmobile==="")
    {
      searchmobile="null";
    }
    if(searchemail==="")
    {
      searchemail="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchmobile + '/'+searchemail + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerCarAndDriverDetailsSMSEMail) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerCarAndDriverDetailsSMSEMailID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerCarAndDriverDetailsSMSEMail)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerCarAndDriverDetailsSMSEMailID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerCarAndDriverDetailsSMSEMailID+ '/'+ userID);
  }
}
