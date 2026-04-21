// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FetchDataRBE } from './fetchDataRBE.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FetchDataRBEService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "pickUpByExecutive";
  }

  fetchAppCurrentData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchCurrentDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppPreviousData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchPreviousDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppNextData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchNextDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  /** CRUD METHODS */
  getTableData(SearchFetchDataRBE:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchFetchDataRBE==="")
    {
      SearchFetchDataRBE="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchFetchDataRBE + '/' + SearchActivationStatus +'/' + PageNumber + '/FetchDataRBE/Ascending');
  }
  getTableDataSort(SearchFetchDataRBE:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchFetchDataRBE==="")
    {
      SearchFetchDataRBE="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchFetchDataRBE + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: FetchDataRBE) 
  {
    //advanceTable.fetchDataRBEID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: FetchDataRBE)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(fetchDataRBEID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ fetchDataRBEID);
  }

  
}
  

