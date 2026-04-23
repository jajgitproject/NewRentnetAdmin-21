// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationGroup } from './reservationGroup.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ReservationGroupModel } from '../reservationGroupDetails/reservationGroupDetails.model';
@Injectable()
export class ReservationGroupService 
{
  private API_URL:string = '';
  private API_URL_Reason:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationGroup";
    this.API_URL_Reason=generalService.BaseURL+ "stopReservation";
  }
  /** CRUD METHODS */
  getTableData(searchStartDate:string,searchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchStartDate==="")
      {
        searchStartDate=null;
      }
      if(searchEndDate==="")
        {
          searchEndDate=null;
        }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + '/' + searchStartDate + '/' + searchEndDate + '/' + SearchActivationStatus + '/' + PageNumber + '/ReservationGroupID/Ascending');

  }
  getTableDataSort(searchStartDate:string,searchEndDate:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchStartDate==="")
      {
        searchStartDate=null;
      }
      if(searchEndDate==="")
        {
          searchEndDate=null;
        }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL+'/' + searchStartDate+'/' + searchEndDate+'/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ReservationGroupModel) 
  {
    advanceTable.reservationGroupID=-1;
    if(!advanceTable.salesExecutiveID)
    {
      advanceTable.salesExecutiveID=0;
    }
    advanceTable.userID = this.generalService.getUserID();
    // advanceTable.reservationStartDateString=this.generalService.getTimeApplicable(advanceTable.reservationStartDate);
    // advanceTable.reservationEndDateString=this.generalService.getTimeApplicable(advanceTable.reservationEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ReservationGroupModel)
  {
    advanceTable.userID = this.generalService.getUserID();
    if(!advanceTable.salesExecutiveID)
      {
        advanceTable.salesExecutiveID=0;
      }
    // advanceTable.reservationStartDateString=this.generalService.getTimeApplicable(advanceTable.reservationStartDate);
    // advanceTable.reservationEndDateString=this.generalService.getTimeApplicable(advanceTable.reservationEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationGroupID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationGroupID + '/'+ userID);
  }

  getReason(CustomerID:number,FromToDate:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Reason + "/CheckStopReservationReason/" + CustomerID + '/' + FromToDate);
  }

  getReservationAlertForCustomer(CustomerID:number,FromToDate:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Reason + "/ReservationAlertForCustomer/" + CustomerID + '/' + FromToDate);
  }

  getAlerMessagetForCustomer(CustomerID:number,FromToDate:string):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Reason + "/AlerMessagetForCustomer/" + CustomerID + '/' + FromToDate);
  }
}
  

