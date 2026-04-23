// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContactPerson } from './customerContactPerson.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContactPersonService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContactPerson";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchsalutation:string,searchcontactPersonName:string,searchcustomerDesignation:string,searchcustomerDepartment:string,searchmobile:string,searchemail:string,SearchisActive:boolean, PageNumber: number):  Observable<any> 
  {
     if(customerID===0)
    {
      customerID=0;
    }
    if(searchsalutation==="")
    {
      searchsalutation="null";
    }
    if(searchcontactPersonName==="")
    {
      searchcontactPersonName="null";
    }
    if(searchcustomerDesignation==="")
    {
      searchcustomerDesignation="null";
    }
    if(searchcustomerDepartment==="")
    {
      searchcustomerDepartment="null";
    }
    if(searchmobile==="")
    {
      searchmobile="null";
    }
    if(searchemail==="")
    {
      searchemail="null";
    }
    if(SearchisActive===null)
    {
      SearchisActive=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchsalutation + '/'+searchcontactPersonName + '/'+searchcustomerDesignation + '/'+searchcustomerDepartment + '/'+searchmobile + '/'+searchemail + '/'+ SearchisActive +'/' + PageNumber + '/customerContactPersonID/Ascending');
  }
  getTableDataSort(customerID:number,searchsalutation:string,searchcontactPersonName:string,searchcustomerDesignation:string,searchcustomerDepartment:string,searchmobile:string,searchemail:string,SearchisActive:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchsalutation==="")
    {
      searchsalutation="null";
    }
    if(searchcontactPersonName==="")
    {
      searchcontactPersonName="null";
    }
    if(searchcustomerDesignation==="")
    {
      searchcustomerDesignation="null";
    }
    if(searchcustomerDepartment==="")
    {
      searchcustomerDepartment="null";
    }
    if(searchmobile==="")
    {
      searchmobile="null";
    }
    if(searchemail==="")
    {
      searchemail="null";
    }
    if(SearchisActive===null)
    {
      SearchisActive=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchsalutation + '/'+searchcontactPersonName + '/'+searchcustomerDesignation + '/'+searchcustomerDepartment + '/'+searchmobile + '/'+searchemail + '/'+ SearchisActive +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerContactPerson) 
  {
    advanceTable.customerContactPersonID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContactPerson)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerContactPersonID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContactPersonID + '/'+ userID);
  }
}
