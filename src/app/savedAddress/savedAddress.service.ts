// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SavedAddress } from './savedAddress.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SavedAddressService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "savedAddress";
  }
  /** CRUD METHODS */
  getTableData(SearchSavedAddress:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchSavedAddress==="")
    {
      SearchSavedAddress="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSavedAddress + '/' + SearchActivationStatus +'/' + PageNumber + '/savedAddressName/Ascending');
  }
  getTableDataSort(SearchSavedAddress:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchSavedAddress==="")
    {
      SearchSavedAddress="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSavedAddress + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SavedAddress) 
  {
    advanceTable.CustomerKeyAccountManagerID=-1;
   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SavedAddress)
  {
   
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(savedAddressID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ savedAddressID);
  }
}
