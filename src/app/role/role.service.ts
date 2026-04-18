// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from './role.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class RoleService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "role";
  }
  /** CRUD METHODS */
  getTableData(SearchRole:string, SearchRoleFor:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    this.Result = "Failure";
    if(SearchRole==="")
    {
      SearchRole="null";
    }
    if(SearchRoleFor==="")
    {
      SearchRoleFor="null";
    }
    // if(SearchRemark==="")
    // {
    //   SearchRemark="null";
    // }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }

    return this.httpClient.get(this.API_URL + "/" +SearchRole + "/" +SearchRoleFor+ '/' + SearchActivationStatus +'/' + PageNumber + '/Role/Ascending');
  }

  getTableDataSort(SearchRole:string, SearchRoleFor:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchRole==="")
    {
      SearchRole="null";
    }
    if(SearchRoleFor==="")
    {
      SearchRoleFor="null";
    }
    // if(SearchRemark==="")
    // {
    //   SearchRemark="null";
    // }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchRole +'/' +SearchRoleFor+'/'+'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Role) 
  {
    this.Result="Failure";
    advanceTable.roleID=-1;
   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Role)
  {
    this.Result="Failure";
   
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(roleID: number):  Observable<any> 
  {
    this.Result="Failure";
    return this.httpClient.delete(this.API_URL + "/" + roleID);
  }
}
