// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AcrisCode } from './acrisCode.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AcrisCodeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "acrisCode";
  }
  /** CRUD METHODS */
  getTableData(SearchAcrisCodeType:string,SearchAcrisCode:string,SearchAcrisCodeValue:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchAcrisCodeType==="")
    {
      SearchAcrisCodeType="null";
    }
    if(SearchAcrisCode==="")
    {
      SearchAcrisCode="null";
    }
    if(SearchAcrisCodeValue==="")
    {
      SearchAcrisCodeValue="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAcrisCodeType + '/'+SearchAcrisCode + '/'+SearchAcrisCodeValue + '/' + SearchActivationStatus +'/' + PageNumber + '/AcrisCodeType/Ascending');
  }

  getTableDataSort(SearchAcrisCodeType:string,SearchAcrisCode:string, SearchAcrisCodeValue:string,  SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchAcrisCodeType==="")
    {
      SearchAcrisCodeType="null";
    }
    if(SearchAcrisCode==="")
    {
      SearchAcrisCode="null";
    }
    if(SearchAcrisCodeValue==="")
    {
      SearchAcrisCodeValue="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAcrisCodeType +'/' +SearchAcrisCode +'/'+SearchAcrisCodeValue +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: AcrisCode) 
  {
    advanceTable.acrisCodeDetailsID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AcrisCode)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(acrisCodeDetailsID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ acrisCodeDetailsID+ '/'+ userID);
  }
}
