// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CityTier } from './cityTier.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CityTierService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cityTier";
  }
  /** CRUD METHODS */
  getTableData(SearchCityTierName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCityTierName==="")
    {
      SearchCityTierName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCityTierName + '/' + SearchActivationStatus +'/' + PageNumber + '/CityTierName/Ascending');
  }

  getTableDataSort(SearchCityTierName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCityTierName==="")
    {
      SearchCityTierName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCityTierName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CityTier) 
  {
    advanceTable.cityTierID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CityTier)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cityTierID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cityTierID + '/'+ userID);
  }

}
  

