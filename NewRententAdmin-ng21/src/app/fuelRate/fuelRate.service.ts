// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FuelRateModel } from './fuelRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FuelRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "fuelRate";
  }

  /** CRUD METHODS */
  getTableData(SearchFuelType:string,SearchFuelRate:string,SearchStateName:string,SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchFuelType === "")
    {
      SearchFuelType = null;
    }
    if(SearchFuelRate === "")
    {
      SearchFuelRate = null;
    }
    if(SearchStateName === "")
    {
      SearchStateName = null;
    }
    if(SearchStartDate === "")
    {
      SearchStartDate = null;
    }
    if(SearchEndDate === "")
    {
      SearchEndDate = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchFuelType + '/' + SearchFuelRate + '/' + SearchStateName + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/FuelRateID/Ascending');
  }

  getTableDataSort(SearchFuelType:string,SearchFuelRate:string,SearchStateName:string,SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchFuelType === "")
    {
      SearchFuelType = "null";
    }
    if(SearchFuelRate === "")
    {
      SearchFuelRate = null;
    }
    if(SearchStateName === "")
    {
      SearchStateName = null;
    }
    if(SearchStartDate === "")
    {
      SearchStartDate = null;
    }
    if(SearchEndDate === "")
    {
      SearchEndDate = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchFuelType + '/' +SearchFuelRate + '/'+ SearchStateName + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: FuelRateModel) 
  {
    advanceTable.fuelRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fuelRateStartDateString=this.generalService.getTimeApplicable(advanceTable.fuelRateStartDate);
    advanceTable.fuelRateEndDateString=this.generalService.getTimeApplicableTO(advanceTable.fuelRateEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: FuelRateModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fuelRateStartDateString=this.generalService.getTimeApplicable(advanceTable.fuelRateStartDate);
    advanceTable.fuelRateEndDateString=this.generalService.getTimeApplicableTO(advanceTable.fuelRateEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(fuelRateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ fuelRateID + '/'+ userID);
  }

}
  

