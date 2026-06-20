
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddB2CServiceLocation } from './addB2CServiceLocation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AddB2CServiceLocationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "addB2CServiceLocation";
  }
  /** CRUD METHODS */
  getTableData(SearchB2CCityName:string, SearchEcoCityName:string, SearchEcoServiceLocation:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchB2CCityName==="")
    {
      SearchB2CCityName="null";
    }
    if(SearchEcoCityName==="")
    {
      SearchEcoCityName="null";
    }
    if(SearchEcoServiceLocation==="")
    {
      SearchEcoServiceLocation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchB2CCityName + '/' + SearchEcoCityName + '/' + SearchEcoServiceLocation + '/' + SearchActivationStatus +'/' + PageNumber + '/B2CServiceLocationID/Ascending');
  }
  getTableDataSort(SearchB2CCityName:string, SearchEcoCityName:string, SearchEcoServiceLocation:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchB2CCityName==="")
    {
      SearchB2CCityName="null";
    }
    if(SearchEcoCityName==="")
    {
      SearchEcoCityName="null";
    }
    if(SearchEcoServiceLocation==="")
    {
      SearchEcoServiceLocation="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchB2CCityName + '/' + SearchEcoCityName + '/' + SearchEcoServiceLocation + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: AddB2CServiceLocation) 
  {
    advanceTable.b2CServiceLocationID=-1;
    advanceTable.createdBy=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AddB2CServiceLocation)
  {
    advanceTable.createdBy=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(addB2CServiceLocationID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ addB2CServiceLocationID + '/'+ userID);
  }

}
  

