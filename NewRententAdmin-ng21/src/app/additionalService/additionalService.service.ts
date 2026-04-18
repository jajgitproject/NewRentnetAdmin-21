// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdditionalService } from './additionalService.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AdditionalServiceService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "additionalService";
  }
  /** CRUD METHODS */
  getTableData(SearchAdditionalService:string,SearchServiceType:string,SearchUom:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchAdditionalService==="")
    {
      SearchAdditionalService="null";
    }
    if(SearchServiceType==="")
    {
      SearchServiceType="null";
    }
    if(SearchUom==="")
    {
      SearchUom="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //alert(this.API_URL + "/" + SearchAdditionalService + '/' + SearchActivationStatus +'/' + PageNumber + '/City/Ascending');
    return this.httpClient.get(this.API_URL + "/" +SearchAdditionalService + '/' + SearchServiceType +'/'+ SearchUom +'/' + SearchActivationStatus +'/' + PageNumber + '/AdditionalService/Ascending');
  }
  getTableDataSort(SearchAdditionalService:string,SearchServiceType:string,SearchUom:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:any, sortType:string ):  Observable<any> 
  {
    if(SearchAdditionalService==="")
    {
      SearchAdditionalService="null";
    }
    if(SearchServiceType==="")
    {
      SearchServiceType="null";
    }
    if(SearchUom==="")
    {
      SearchUom="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    // if(coloumName) {
    //   return this.httpClient.get(this.API_URL + "/" +SearchAdditionalService + '/' + SearchActivationStatus +'/' + PageNumber + '/AdditionalService/Ascending?'+coloumName?.active+'='+coloumName?.direction);
    // }
    return this.httpClient.get(this.API_URL + "/" +SearchAdditionalService + '/' + SearchServiceType +'/' + SearchUom +'/' + SearchActivationStatus +'/' + PageNumber +'/' + coloumName +'/' + sortType );
  }

  add(advanceTable: AdditionalService) 
  {
    advanceTable.additionalServiceID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AdditionalService)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(additionalServiceID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ additionalServiceID + '/'+ userID);
  }

  
}
  

