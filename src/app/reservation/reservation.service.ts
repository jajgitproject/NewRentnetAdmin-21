// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleAddress, Reservation } from './reservation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerConfigurationInvoicing } from '../customerConfigurationInvoicing/customerConfigurationInvoicing.model';
@Injectable()
export class ReservationService 
{
  private API_URL:string = '';
  private RG_API_URL:string = '';
  private Duplicate_API_URL:string = '';
  private GA_API_URL:string = '';
  private SA_API_URL:string = '';
  private API_URL_CustomerGroupReservationCapping:string = '';
  private API_URL_Customer:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservation";
    this.RG_API_URL=generalService.BaseURL+ "reservationGroup";
    this.Duplicate_API_URL=generalService.BaseURL+ "reservationGroupDuplicate";
    this.GA_API_URL=generalService.BaseURL+ "googleAddress";
    this.SA_API_URL=generalService.BaseURL+ "savedAddress";
    this.API_URL_CustomerGroupReservationCapping=generalService.BaseURL+ "customerGroupReservationCapping";
    this.API_URL_Customer=generalService.BaseURL+ "customer";
  }
  /** CRUD METHODS */
  getIntervalMin(CustomerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Customer + "/" + 'GetIntervalMinByID' + '/' +CustomerID);
  }

  getTableData(PassengerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.SA_API_URL +"/"+PassengerID);
  }

  getDataForReservation(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.RG_API_URL +"/ForReservationPage/"+ReservationID);
  }

  GetServiceLocation(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/getServiceAndTransferedLocation/"+ReservationID);
  }

  getTimeForDropoffTime(packageID:number,pickupTime:string,pickupDate:string,contractID:number,vehicleID:number,cityID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" + 'getDropOffTime' + "/"  +  packageID + "/" + pickupTime + "/" + pickupDate + "/" + contractID + "/" + vehicleID + "/" + cityID);
  }

  getBookingDetails(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/ForBookingDetails/"+ReservationID);
  }

  getReservationStatusLog(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.Duplicate_API_URL+'/'+ReservationID);
  }

  add(advanceTable: any) 
  {
    
    advanceTable.reservationID=-1;
    advanceTable.reservationStatusChangedByID=this.generalService.getUserID();
    if(advanceTable.pickupSpotTypeID==="")
    {
      advanceTable.pickupSpotTypeID=0;
    }
    if(advanceTable.customerReservationFieldID=== "")
    {
      advanceTable.customerReservationFieldID=null;
    }
    if(advanceTable.fieldName=== "")
    {
      advanceTable.fieldName=null;
    }
    if(advanceTable.projectCode=== "")
    {
      advanceTable.projectCode=null;
    }
    if(advanceTable.pickupSpotID==="")
    {
      advanceTable.pickupSpotID=0;
    }
    if(advanceTable.dropOffCityID==="")
    {
      advanceTable.dropOffCityID=0;
    }
    if(advanceTable.dropOffSpotID==="")
    {
      advanceTable.dropOffSpotID=0;
    }
    if(advanceTable.dropOffSpotTypeID==="")
    {
      advanceTable.dropOffSpotTypeID=0;
    }
    if(advanceTable.pickupDate==="")
    {
      advanceTable.pickupDate=null;
    }
    else
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    if(advanceTable.dropOffDate==="")
    {
      advanceTable.dropOffDate=null;
    }
    else
    {
      advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    }
    if(advanceTable.locationOutDate==="")
      {
        advanceTable.locationOutDate=null;
      }
      else
      {
        advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
      }
    if(advanceTable.locationOutTime==="")
    {
      advanceTable.locationOutTime=null;
    }
    else
    {
      advanceTable.locationOutTimeString=this.generalService.getTimeApplicable(advanceTable.locationOutTime);
    }
    if(advanceTable.pickupTime==="")
    {
      advanceTable.pickupTime=null;
    }
    else
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    if(advanceTable.dropOffTime==="")
    {
      advanceTable.dropOffTime=null;
    }
    else
    {
      advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    }   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  addGoogleAddress(advanceTable: GoogleAddress) 
  {
    advanceTable.geoPointID=-1;
    return this.httpClient.post<any>(this.GA_API_URL , advanceTable);
  }

  update(advanceTable: any)
  {
    advanceTable.reservationStatusChangedByID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.etrDate==="")
      {
        advanceTable.etrDate=null;
      }
      else
      {
        advanceTable.etrDateString=this.generalService.getTimeApplicable(advanceTable.etrDate);
      }
      if(advanceTable.etrTime==="")
      {
        advanceTable.etrTime=null;
      }
      else
      {
        advanceTable.etrTimeString=this.generalService.getTimeApplicable(advanceTable.etrTime);
      }
  
    if(advanceTable.pickupSpotTypeID==="")
    {
      advanceTable.pickupSpotTypeID=0;
    }
    if(advanceTable.customerReservationFieldID=== "")
    {
      advanceTable.customerReservationFieldID=null;
    }
    if(advanceTable.fieldName=== "")
    {
      advanceTable.fieldName=null;
    }
    if(advanceTable.projectCode=== "")
    {
      advanceTable.projectCode=null;
    }
    if(advanceTable.pickupSpotID==="")
    {
      advanceTable.pickupSpotID=0;
    }
    if(advanceTable.dropOffCityID==="")
    {
      advanceTable.dropOffCityID=0;
    }
    if(advanceTable.dropOffSpotID==="")
    {
      advanceTable.dropOffSpotID=0;
    }
    if(advanceTable.dropOffSpotTypeID==="")
    {
      advanceTable.dropOffSpotTypeID=0;
    }
    if(advanceTable.pickupDate==="")
    {
      advanceTable.pickupDate=null;
    }
    else
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    if(advanceTable.dropOffDate==="")
    {
      advanceTable.dropOffDate=null;
    }
    else
    {
      advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    }
    if(advanceTable.locationOutDate==="")
      {
        advanceTable.locationOutDate=null;
      }
      else
      {
        advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
      }
    if(advanceTable.locationOutTime==="")
    {
      advanceTable.locationOutTime=null;
    }
    else
    {
      advanceTable.locationOutTimeString=this.generalService.getTimeApplicable(advanceTable.locationOutTime);
    }
    if(advanceTable.pickupTime==="")
    {
      advanceTable.pickupTime=null;
    }
    else
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    if(advanceTable.dropOffTime==="")
    {
      advanceTable.dropOffTime=null;
    }
    else
    {
      advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    }   
    if(advanceTable.etrDate==="")
    {
      advanceTable.etrDate=null;
    }
    else
    {
      advanceTable.etrDateString=this.generalService.getTimeApplicable(advanceTable.etrDate);
    }
    if(advanceTable.etrTime==="")
    {
      advanceTable.etrTime=null;
    }
    else
    {
      advanceTable.etrTimeString=this.generalService.getTimeApplicable(advanceTable.etrTime);
    }   
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  updateReservationEdit(advanceTable: any)
  {
    advanceTable.reservationStatusChangedByID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.pickupSpotTypeID==="")
    {
      advanceTable.pickupSpotTypeID=0;
    }
    if(advanceTable.customerReservationFieldID=== "")
    {
      advanceTable.customerReservationFieldID=null;
    }
    if(advanceTable.fieldName=== "")
    {
      advanceTable.fieldName=null;
    }
    if(advanceTable.projectCode=== "")
    {
      advanceTable.projectCode=null;
    }
    if(advanceTable.pickupSpotID==="")
    {
      advanceTable.pickupSpotID=0;
    }
    if(advanceTable.dropOffCityID==="")
    {
      advanceTable.dropOffCityID=0;
    }
    if(advanceTable.dropOffSpotID==="")
    {
      advanceTable.dropOffSpotID=0;
    }
    if(advanceTable.dropOffSpotTypeID==="")
    {
      advanceTable.dropOffSpotTypeID=0;
    }
    if(advanceTable.pickupDate==="")
    {
      advanceTable.pickupDate=null;
    }
    else
    {
      advanceTable.pickupDateString=this.generalService.getTimeApplicable(advanceTable.pickupDate);
    }
    if(advanceTable.dropOffDate==="")
    {
      advanceTable.dropOffDate=null;
    }
    else
    {
      advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    }
    if(advanceTable.locationOutDate==="")
      {
        advanceTable.locationOutDate=null;
      }
      else
      {
        advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
      }
    if(advanceTable.locationOutTime==="")
    {
      advanceTable.locationOutTime=null;
    }
    else
    {
      advanceTable.locationOutTimeString=this.generalService.getTimeApplicable(advanceTable.locationOutTime);
    }
    if(advanceTable.pickupTime==="")
    {
      advanceTable.pickupTime=null;
    }
    else
    {
      advanceTable.pickupTimeString=this.generalService.getTimeApplicable(advanceTable.pickupTime);
    }
    if(advanceTable.dropOffTime==="")
    {
      advanceTable.dropOffTime=null;
    }
    else
    {
      advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    }   
    if(advanceTable.etrDate==="")
      {
        advanceTable.etrDate=null;
      }
      else
      {
        advanceTable.etrDateString=this.generalService.getTimeApplicable(advanceTable.etrDate);
      }
      if(advanceTable.etrTime==="")
      {
        advanceTable.etrTime=null;
      }
      else
      {
        advanceTable.etrTimeString=this.generalService.getTimeApplicable(advanceTable.etrTime);
      }
    return this.httpClient.put<any>(this.API_URL+'/'+'UpdateReservationForEdit' , advanceTable);
  }

  delete(reservationID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ reservationID);
  }

  getReservationCapping(CustomerGroupID:number,CustomerID:number,PickupDate:string,CityID:number,PackageTypeID:number,VehicleCategoryID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CustomerGroupReservationCapping + "/CheckReservationCapping/" + CustomerGroupID + '/' + CustomerID + '/' + PickupDate + '/' + CityID + '/' + PackageTypeID + '/' + VehicleCategoryID);
  }
  GetResrvationGSTForCityID(customerID:number,cityID:number): Observable<any> {
    return this.httpClient.get(this.generalService.BaseURL + "customerConfigurationInvoicing/GetResrvationGSTForCityID/"+customerID +'/'+cityID);
  }
  GetResrvationGSTDetails(customerID:number): Observable<CustomerConfigurationInvoicing[]> {
    return this.httpClient.get<CustomerConfigurationInvoicing[]>(this.generalService.BaseURL + "customerConfigurationInvoicing/GetResrvationGSTDetails/"+customerID);
  }
  
  GetIsGSTMandatoryWithResrvation(customerGroupID:number): Observable<any> {
    return this.httpClient.get<any>(this.generalService.BaseURL + "customerGroup/GetIsGSTMandatoryWithResrvation/"+customerGroupID);
  }
  
  getReservationGSTData(ReservationID:number):  Observable<any> 
    {
      return this.httpClient.get(this.API_URL +"/getReservationGSTData/"+ReservationID);
    }
   updatePickupEdit(advanceTable: any) {
  if (advanceTable.pickupTime === "") {
    advanceTable.pickupTime = null;
  } else {
    advanceTable.pickupTimeString = this.generalService.getTimeApplicable(advanceTable.pickupTime);
  }
  if (!advanceTable.dropOffTime) {
    advanceTable.dropOffTimeString = null;
  } else {
    advanceTable.dropOffTimeString = this.generalService.getTimeApplicable(advanceTable.dropOffTime);
  }

  return this.httpClient.put<any>(this.API_URL + '/' + 'EditPickupTime', advanceTable);
}
}
  

