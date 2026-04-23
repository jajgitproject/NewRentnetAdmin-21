// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DispatchByExecutive } from './dispatchByExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DispatchByExecutiveService 
{
  private API_URL:string = '';
  private API_URL_GPS:string = '';
  private API_URL_App:string = '';
  private API_URL_Appp:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dispatchByExecutive";
    this.API_URL_App=generalService.BaseURL+ "dispatchByApp";
    this.API_URL_GPS=generalService.BaseURL+ "gTrackData";
    this.API_URL_Appp=generalService.BaseURL+ "dutySlip";
  }

  getDataFromGPS(pickupDate: string, pickupTime:string,reseravtionID:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_GPS + '/getLiveDataFromGTrack/' + pickupDate + "/"+ pickupTime + "/" + reseravtionID);
  }

  getgaroutCheckDataDetails(dutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Appp + "/" + dutySlipID);
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

  add(advanceTable: DispatchByExecutive) 
  {
    //advanceTable.dispatchByExecutiveID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: DispatchByExecutive)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.actualCarMovedFrom=null;
    advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
    advanceTable.locationOutTimeString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTime);
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
  
  GetLocationOutIntervalInMinutes(customerID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/getLocationOutIntervalInMinutes/' + customerID);
  }
  getCustomerAlertForDispatch(customerID: number,FromToDate:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/CustomerAlertForDispatch/' + customerID + '/'+ FromToDate);
  }
}
  

