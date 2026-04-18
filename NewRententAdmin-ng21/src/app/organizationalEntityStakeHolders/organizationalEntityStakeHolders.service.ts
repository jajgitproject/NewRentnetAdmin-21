// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationalEntityStakeHolders } from './organizationalEntityStakeHolders.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class OrganizationalEntityStakeHoldersService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "organizationalEntityStakeHolders";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData(OrganizationalEntityID:number,SearchEntityType:string, SearchOrganizationalEntityStakeHolders:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchEntityType==="")
    {
      SearchEntityType="null";
    }
    if(SearchOrganizationalEntityStakeHolders==="")
    {
      SearchOrganizationalEntityStakeHolders="null";
    }
    return this.httpClient.get(this.API_URL+ "/"+OrganizationalEntityID + "/"+SearchEntityType + '/'+SearchOrganizationalEntityStakeHolders + '/' + SearchActivationStatus +'/' + PageNumber + '/organizationalEntityName/Ascending');
  }

  getTableDataSort(OrganizationalEntityID:number,SearchEntityType:string,SearchOrganizationalEntityStakeHolders:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchEntityType==="")
    {
      SearchEntityType="null";
    }
    if(SearchOrganizationalEntityStakeHolders==="")
    {
      SearchOrganizationalEntityStakeHolders="null";
    }
    return this.httpClient.get(this.API_URL+ "/" +OrganizationalEntityID + "/" +SearchEntityType + '/'+SearchOrganizationalEntityStakeHolders + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: OrganizationalEntityStakeHolders) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.organizationalEntityStakeHoldersID=-1;
    if(advanceTable.isHOD){
      advanceTable.isHOD=true;
    }
    else{
     advanceTable.isHOD=false;
    }
    
    if(advanceTable.isResponsibleForChildEntities){
      advanceTable.isResponsibleForChildEntities=true;
    }
    else{
     advanceTable.isResponsibleForChildEntities=false;
    }
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: OrganizationalEntityStakeHolders)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(organizationalEntityStakeHoldersid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ organizationalEntityStakeHoldersid + '/' + userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
