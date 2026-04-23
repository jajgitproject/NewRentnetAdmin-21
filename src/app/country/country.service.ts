// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Country } from './country.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CountryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "country";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchISO:string,
    SearchISD:string,
    SearchCurrency:string,
    SearchGeoSearchString:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchISO==="")
    {
      SearchISO="null";
    }
    if(SearchISD==="")
    {
      SearchISD="null";
    }
    if(SearchCurrency==="")
    {
      SearchCurrency="null";
    }
    if(SearchGeoSearchString==="")
    {
      SearchGeoSearchString="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' +SearchName+ '/' +SearchISO+ '/' +SearchISD+ '/' +SearchCurrency + '/' +SearchGeoSearchString+ '/' + SearchActivationStatus +'/' + PageNumber + '/geoPointName/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchISO:string,
    SearchISD:string,
    SearchCurrency:string,
    SearchGeoSearchString:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchISO==="")
    {
      SearchISO="null";
    }
    if(SearchISD==="")
    {
      SearchISD="null";
    }
    if(SearchCurrency==="")
    {
      SearchCurrency="null";
    }
    if(SearchGeoSearchString==="")
    {
      SearchGeoSearchString="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' +SearchName+ '/' +SearchISO+ '/' +SearchISD+ '/' +SearchCurrency + '/' +SearchGeoSearchString+ '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Country) 
  {
    advanceTable.geoPointID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Country)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(geoPointID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ geoPointID + '/'+ userID);
  }
}
