// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationalEntity } from './organizationalEntity.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { OrganizationalEntityDropDown } from './organizationalEntityDropDown.model';
@Injectable()
export class OrganizationalEntityService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "organizationalEntity";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchParent:string,
    SearchCity:string,
    SearchOrganizationalType:string,
    SearchOperationalStatus:string,
    SearchOwner:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchParent==="")
    {
      SearchParent="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchOrganizationalType==="")
    {
      SearchOrganizationalType="null";
    }
    if(SearchOperationalStatus==="")
    {
      SearchOperationalStatus="null";
    }
    if(SearchOwner==="")
    {
      SearchOwner="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName +"/" +SearchParent +"/" +SearchCity +"/" +SearchOrganizationalType +"/" +SearchOperationalStatus + '/' + SearchOwner + '/' + SearchActivationStatus +'/' + PageNumber + '/organizationalEntityName/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchParent:string,
    SearchCity:string,
    SearchOrganizationalType:string,
    SearchOperationalStatus:string,
    SearchOwner:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchParent==="")
    {
      SearchParent="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchOrganizationalType==="")
    {
      SearchOrganizationalType="null";
    }
    if(SearchOperationalStatus==="")
    {
      SearchOperationalStatus="null";
    }
    if(SearchOwner==="")
    {
      SearchOwner="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName +"/" +SearchParent +"/" +SearchCity +"/" +SearchOrganizationalType +"/" +SearchOperationalStatus + '/' + SearchOwner + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: OrganizationalEntity) 
  {
    advanceTable.organizationalEntityID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.organizationalEntityStartDateString=this.generalService.getTimeApplicable(advanceTable.organizationalEntityStartDate);
    advanceTable.supplierCreatedByEmployeeID=this.generalService.getUserID();
    if (advanceTable.activationStatus === true) 
      {
        advanceTable.organizationalEntityEndDateString = null;
      }
      else 
      {
        advanceTable.organizationalEntityEndDateString = this.generalService.getTimeApplicable(advanceTable.organizationalEntityEndDate);
      }
      if (advanceTable.oldRentNetService_Location === "") 
      {
        advanceTable.oldRentNetService_Location = null;
      }
      else 
      {
        advanceTable.oldRentNetService_Location = advanceTable.oldRentNetService_Location;
      }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: OrganizationalEntity)
  {
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.organizationalEntitySupplierID===0){
      advanceTable.organizationalEntitySupplierID=null;
    } 
    advanceTable.supplierCreatedByEmployeeID=this.generalService.getUserID();
    advanceTable.organizationalEntityStartDateString=this.generalService.getTimeApplicable(advanceTable.organizationalEntityStartDate);
    if (advanceTable.activationStatus === true) 
      {
        advanceTable.organizationalEntityEndDateString = null;
      }
      else 
      {
        advanceTable.organizationalEntityEndDateString = this.generalService.getTimeApplicable(advanceTable.organizationalEntityEndDate);
      }
       if (advanceTable.oldRentNetService_Location === "") 
      {
        advanceTable.oldRentNetService_Location = null;
      }
      else 
      {
        advanceTable.oldRentNetService_Location = advanceTable.oldRentNetService_Location;
      }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(organizationalEntityID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ organizationalEntityID + '/' + userID);
  }

  GetOrganizationalEntity(OrganizationalEntityType:string): Observable<OrganizationalEntityDropDown[]>
  {
    return this.httpClient.get<OrganizationalEntityDropDown[]>(this.API_URL + "/GetDropDownForParent/" + OrganizationalEntityType);
  }

  GetOrganizationalEntityForHub(OrganizationalEntityType:string,OrganizationalEntity:string): Observable<OrganizationalEntityDropDown[]>
  {
    return this.httpClient.get<OrganizationalEntityDropDown[]>(this.API_URL + "/GetDropDownForParentForHub/" + OrganizationalEntityType + '/' + OrganizationalEntity);
  }
}
