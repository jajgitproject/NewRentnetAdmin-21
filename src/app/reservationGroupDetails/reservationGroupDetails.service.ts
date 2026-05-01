// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookingWithDateRangeModel, ReservationGroupModel, UnfilledBookingModel } from './reservationGroupDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReservationGroupDetailsService 
{
  private API_URL:string = '';
  private OE_API_URL:string = '';
  private Duplicate_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService,
    private datePipe: DatePipe
  ) 
  {
    this.API_URL=generalService.BaseURL+ "reservationGroup";
    this.OE_API_URL=generalService.BaseURL+ "organizationalEntity";
    this.Duplicate_API_URL=generalService.BaseURL+ "reservationGroupDuplicate";
  }
  /** CRUD METHODS */
  getTableData(ReservationGroupID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL+ '/' + ReservationGroupID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationID/Ascending');
  }
  getTableDataSort(ReservationGroupID:number,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL+ '/' + ReservationGroupID+ '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ReservationGroupModel) 
  {
    advanceTable.reservationGroupID=-1;
    if(!advanceTable.salesExecutiveID)
      {
        advanceTable.salesExecutiveID=0;
      }
      advanceTable.userID=this.generalService.getUserID();
    // advanceTable.reservationStartDateString=this.generalService.getTimeApplicable(advanceTable.reservationStartDate);
    // advanceTable.reservationEndDateString=this.generalService.getTimeApplicable(advanceTable.reservationEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  updateDuplicate(advanceTable: ReservationGroupModel) 
  {
    advanceTable.reservationExecutiveID = this.generalService.getUserID();
    advanceTable.activationStatus = true;
    if(advanceTable.pickupDate)
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    else
    {
      advanceTable.pickupDate=null;
    }

    if(advanceTable.pickupTime)
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    else
    {
      advanceTable.pickupTime=null;
    }
      
    if(!advanceTable.vehicleID)
    {
      advanceTable.vehicleID=0;
    }

    if(!advanceTable.pickupCityID)
    {
      advanceTable.pickupCityID=0;
    }

    if(!advanceTable.primaryPassengerID)
    {
      advanceTable.primaryPassengerID=0;
    }
    if(!advanceTable.salesExecutiveID)
      {
        advanceTable.salesExecutiveID=0;
      }
    advanceTable.reservationID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.reservationStartDateString=this.generalService.getTimeApplicable(advanceTable.reservationStartDate);
    // advanceTable.reservationEndDateString=this.generalService.getTimeApplicable(advanceTable.reservationEndDate);
    return this.httpClient.put<any>(this.API_URL + '/' + 'updateReservationGroupDuplicate'  , advanceTable);
  }

  update(advanceTable: ReservationGroupModel)
  {
    
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
    return this.httpClient.delete(this.API_URL + '/'+ reservationGroupID);
  }

  getReservationSourceData(ReservationGroupID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/' + ReservationGroupID);
  }

  getNumberOfBookings(ReservationGroupID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/'+'GetNumberOfBookings'+ '/' + ReservationGroupID);
  }

  CreateDuplicate(ReservationID: number)
  {
    return this.httpClient.post<any>(this.Duplicate_API_URL,ReservationID);
  }

  CreateDuplicateForUnfilledBooking(advanceTable:any)
  {
    return this.httpClient.post<any>(this.Duplicate_API_URL+'/'+'ForUnfilledBooking',advanceTable);
  }

  getReservationIDBasedOnRGID(ReservationGroupID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+ '/' +'getOnlyReservationNumbers'+ '/' + ReservationGroupID);
  }

  getTLBasedOnCustomer(CustomerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.OE_API_URL+ '/' +'GetTransferLocationBasedOnCustomer'+ '/' + CustomerID);
  }

  CreateDuplicateWithDateRange(advanceTable:BookingWithDateRangeModel)
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.startDateString=this.datePipe.transform(advanceTable.startDateString, 'yyyy-MM-dd');
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    advanceTable.endDateString=this.datePipe.transform(advanceTable.endDateString, 'yyyy-MM-dd');
    return this.httpClient.post<any>(this.Duplicate_API_URL+'/'+'ForBookingWithDateRange',advanceTable);
  }

}
  

