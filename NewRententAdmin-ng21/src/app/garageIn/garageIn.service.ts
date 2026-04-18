// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { GarageIn } from './garageIn.model';
@Injectable()
export class GarageInService 
{
  private API_URL:string = '';
  private API_URL_GPS:string = '';
  private API_URL_App:string = '';
  private API_URL_App1:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "GarageIn";
    this.API_URL_App=generalService.BaseURL+ "GarageInByApp";
    this.API_URL_App1=generalService.BaseURL+ "pickUpByExecutive";
    this.API_URL_GPS=generalService.BaseURL+ "gTrackData";
  }

  getDataFromGPS(pickupDate: string, pickupTime:string,reseravtionID:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_GPS + '/getLiveDataFromGTrack/' + pickupDate + "/"+ pickupTime + "/" + reseravtionID);
  }
  /** CRUD METHODS */
  getTableData(SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ SearchActivationStatus +'/' + PageNumber + '/DispatchByExecutive/Ascending');
  }
  getTableDataSort(SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: GarageIn) 
  {
    
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: GarageIn)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.locationInDateString=this.generalService.getTimeApplicable(advanceTable.locationInDate);
    advanceTable.locationInTimeString=this.generalService.getTimeApplicableTO(advanceTable.locationInTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(dispatchByExecutiveID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ dispatchByExecutiveID);
  }

  getDispatchDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/ForAllotmentData/' + allotmentID);
  }
  getDispatchDetailsForDriver(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetAllotmentDataByDriver/' + allotmentID);
  }
  getDispatchDetailsForApp(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_App + '/GetAllotmentDataByApp/' + allotmentID);
  }
  
  fetchAppCurrentData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL_App1 + "/"+'fetchCurrentDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppPreviousData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL_App1 + "/"+'fetchPreviousDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppNextData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL_App1 + "/"+'fetchNextDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }
}
  

