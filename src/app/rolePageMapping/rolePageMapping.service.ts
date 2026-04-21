// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RolePageMapping } from './rolePageMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class RolePageMappingService 
{
  private API_URL:string = '';
  
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "rolePageMapping";
    
  }
  /** CRUD METHODS */
  getTableData(SearchPage:string, SearchRoleID: number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    this.Result = "Failure";
    if(SearchPage==="")
    {
      SearchPage="null";
    }
    if(SearchRoleID===0)
    {
      SearchRoleID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }

    return this.httpClient.get(this.API_URL + "/" +SearchPage + '/' + SearchRoleID + '/' + SearchActivationStatus +'/' + PageNumber + '/Page/Ascending');
  }

  getTableDataSort(SearchPage:string, SearchRoleID: number, SearchActivationStatus:boolean,PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchPage==="")
    {
      SearchPage="null";
    }
    if(SearchRoleID===0)
    {
      SearchRoleID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPage +'/' +SearchRoleID +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: RolePageMapping) 
  {

    this.Result="Failure";
    advanceTable.rolePageMappingID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: RolePageMapping)
  {
    this.Result="Failure";
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(rolePageMappingID: number):  Observable<any> 
  {
    this.Result="Failure";
    return this.httpClient.delete(this.API_URL + "/" + rolePageMappingID);
  }
}
