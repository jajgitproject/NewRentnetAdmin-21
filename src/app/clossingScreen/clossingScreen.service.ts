// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { BillingHistory, ClosingDetailShowModel, ClosingTableModel, ReservationSalesPersonModel } from './clossingScreen.model';
@Injectable()
export class ClossingScreenService 
{
  private API_URL:string = '';
  private RP_API_URL:string = '';
  private API_URL_CustomerInfo:string = '';
  private API_URL_ReservationInfo:string = '';
  private API_URL_CurrentDutyInfo:string = '';
  private API_LOC_OUT_IN:string = '';
  private API_DutySlipForBilling:string = '';
  private API_CalculateBill:string = '';
  private API_GenerateBill:string = '';
  private API_SalesPerson:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "clossingScreen";
    this.API_URL_CustomerInfo=generalService.BaseURL+ "customerInfo";
    this.API_URL_ReservationInfo=generalService.BaseURL+ "reservation";
    this.API_URL_CurrentDutyInfo=generalService.BaseURL+ "currentDuty";
    this.API_LOC_OUT_IN=generalService.BaseURL+ "dispatchByExecutive";
    this.API_DutySlipForBilling=generalService.BaseURL+ "dutySlipForBilling";
    this.API_CalculateBill =generalService.BaseURL+ "InvoiceCalculation/calculate";
    this.API_SalesPerson =generalService.BaseURL+ "ReservationSalesPerson";
    this.API_GenerateBill =generalService.BaseURL+ "InvoiceGeneral/createInvoiceSingleDuty";
  }

  addBillingHistory(advanceTable: BillingHistory)
  {
    return this.httpClient.post<any>(this.API_DutySlipForBilling + '/SaveBillingHistory', advanceTable);
  }

  update(advanceTable: ClosingTableModel)
  {
    // if(advanceTable.locationOutDateForDriver)
    //   {
    //     advanceTable.locationOutDateForDriverString=this.generalService.getTimeApplicable(advanceTable.locationOutDateForDriver);
    //     advanceTable.locationOutTimeForDriverString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTimeForDriver);

    //     advanceTable.reportingToGuestDateForDriverString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDateForDriver);
    //     advanceTable.reportingToGuestTimeForDriverString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTimeForDriver);

    //     advanceTable.pickUpDateForDriverString=this.generalService.getTimeApplicable(advanceTable.pickUpDateForDriver);
    //     advanceTable.pickUpTimeForDriverString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTimeForDriver);

    //     advanceTable.dropOffDateForDriverString=this.generalService.getTimeApplicable(advanceTable.dropOffDateForDriver);
    //     advanceTable.dropOffTimeForDriverString=this.generalService.getTimeApplicableTO(advanceTable.dropOffTimeForDriver);

    //     advanceTable.locationInDateForDriverString=this.generalService.getTimeApplicable(advanceTable.locationInDateForDriver);
    //     advanceTable.locationInTimeForDriverString=this.generalService.getTimeApplicableTO(advanceTable.locationInTimeForDriver);
    //   }
     
      // if(advanceTable.locationOutDateForApp)
      //   {
      //     advanceTable.locationOutDateForAppString=this.generalService.getTimeApplicable(advanceTable.locationOutDateForApp);
      //     advanceTable.locationOutTimeForAppString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTimeForApp);

      //     advanceTable.reportingToGuestDateForAppString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDateForApp);
      //     advanceTable.reportingToGuestTimeForAppString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTimeForApp);

      //     advanceTable.pickUpDateForAppString=this.generalService.getTimeApplicable(advanceTable.pickUpDateForApp);
      //     advanceTable.pickUpTimeForAppString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTimeForApp);

      //     advanceTable.dropOffDateForAppString=this.generalService.getTimeApplicable(advanceTable.dropOffDateForApp);
      //     advanceTable.dropOffTimeForAppString=this.generalService.getTimeApplicableTO(advanceTable.dropOffTimeForApp);

      //     advanceTable.locationInDateForAppString=this.generalService.getTimeApplicable(advanceTable.locationInDateForApp);
      //     advanceTable.locationInTimeForAppString=this.generalService.getTimeApplicableTO(advanceTable.locationInTimeForApp);
      //   }

        // if(advanceTable.locationOutDateForGPS)
        //   {
        //     advanceTable.locationOutDateForGPSString=this.generalService.getTimeApplicable(advanceTable.locationOutDateForGPS);
        //     advanceTable.locationOutTimeForGPSString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTimeForGPS);
    
        //     advanceTable.reportingToGuestDateForGPSString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDateForGPS);
        //     advanceTable.reportingToGuestTimeForGPSString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTimeForGPS);
    
        //     advanceTable.pickUpDateForGPSString=this.generalService.getTimeApplicable(advanceTable.pickUpDateForGPS);
        //     advanceTable.pickUpTimeForGPSString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTimeForGPS);
    
        //     advanceTable.dropOffDateForGPSString=this.generalService.getTimeApplicable(advanceTable.dropOffDateForGPS);
        //     advanceTable.dropOffTimeForGPSString=this.generalService.getTimeApplicableTO(advanceTable.dropOffTimeForGPS);
    
        //     advanceTable.locationInDateForGPSString=this.generalService.getTimeApplicable(advanceTable.locationInDateForGPS);
        //     advanceTable.locationInTimeForGPSString=this.generalService.getTimeApplicableTO(advanceTable.locationInTimeForGPS);
        //   }  
  
          if(advanceTable.locationOutDateForBilling)
            {
              advanceTable.locationOutDateForBillingString=this.generalService.getTimeApplicable(advanceTable.locationOutDateForBilling);
              advanceTable.locationOutTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTimeForBilling);
      
              advanceTable.reportingToGuestDateForBillingString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDateForBilling);
              advanceTable.reportingToGuestTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTimeForBilling);
      
              advanceTable.pickUpDateForBillingString=this.generalService.getTimeApplicable(advanceTable.pickUpDateForBilling);
              advanceTable.pickUpTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTimeForBilling);
      
              advanceTable.dropOffDateForBillingString=this.generalService.getTimeApplicable(advanceTable.dropOffDateForBilling);
              advanceTable.dropOffTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.dropOffTimeForBilling);
      
              advanceTable.locationInDateForBillingString=this.generalService.getTimeApplicable(advanceTable.locationInDateForBilling);
              advanceTable.locationInTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.locationInTimeForBilling);
            }  
    
    // if(advanceTable.locationInAddressStringForApp === "")
    // {
    //   advanceTable.locationInAddressStringForApp=null;
    // }
    // if(advanceTable.locationOutLatLongForApp === "")
    // {
    //   advanceTable.locationOutLatLongForApp=null;
    // }
    // if(advanceTable.locationInLatLongForApp === "")
    // {
    //   advanceTable.locationInLatLongForApp=null;
    // }
    // if(advanceTable.dropOffLatLongForApp === "")
    // {
    //   advanceTable.dropOffLatLongForApp=null;
    // }
    // if(advanceTable.reportingToGuestLatLongForApp === "")
    // {
    //   advanceTable.reportingToGuestLatLongForApp=null;
    // }
    // if(advanceTable.pickUpLatLongForApp === "")
    // {
    //   advanceTable.pickUpLatLongForApp=null;
    // }
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_DutySlipForBilling , advanceTable);
  }
  // update(advanceTable: ClosingDetailShowModel)
  // {
  //   advanceTable.locationOutDateForBillingString=this.generalService.getTimeApplicable(advanceTable.locationOutDateForBilling);
  //   advanceTable.locationOutTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTimeForBilling);

  //   advanceTable.reportingToGuestDateForBillingString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDateForBilling);
  //   advanceTable.reportingToGuestTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTimeForBilling);

  //   advanceTable.pickUpDateForBillingString=this.generalService.getTimeApplicable(advanceTable.pickUpDateForBilling);
  //   advanceTable.pickUpTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTimeForBilling);

  //   advanceTable.dropOffDateForBillingString=this.generalService.getTimeApplicable(advanceTable.dropOffDateForBilling);
  //   advanceTable.dropOffTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.dropOffTimeForBilling);

  //   advanceTable.locationInDateForBillingString=this.generalService.getTimeApplicable(advanceTable.locationInDateForBilling);
  //   advanceTable.locationInTimeForBillingString=this.generalService.getTimeApplicableTO(advanceTable.locationInTimeForBilling);
    
  //   if(advanceTable.locationInAddressStringForBilling === "")
  //   {
  //     advanceTable.locationInAddressStringForBilling=null;
  //   }
  //   if(advanceTable.locationOutLatLongForBilling === "")
  //   {
  //     advanceTable.locationOutLatLongForBilling=null;
  //   }
  //   if(advanceTable.locationInLatLongForBilling === "")
  //   {
  //     advanceTable.locationInLatLongForBilling=null;
  //   }
  //   if(advanceTable.dropOffLatLongForBilling === "")
  //   {
  //     advanceTable.dropOffLatLongForBilling=null;
  //   }
  //   if(advanceTable.reportingToGuestLatLongForBilling === "")
  //   {
  //     advanceTable.reportingToGuestLatLongForBilling=null;
  //   }
  //   if(advanceTable.pickUpLatLongForBilling === "")
  //   {
  //     advanceTable.pickUpLatLongForBilling=null;
  //   }

  //   return this.httpClient.put<any>(this.API_DutySlipForBilling , advanceTable);
  // }

  // LocationOut(ReservationID:Number)
  // {
  //   return this.httpClient.get(this.API_LOC_OUT_IN + "/"+'LocationIn'+ "/"+ ReservationID);
  // }

  PackageTypeForLTR(PackageTypeID:Number)
  {
    return this.httpClient.get(this.API_URL_ReservationInfo + "/"+'getPackageTypeForLTR'+ "/"+ PackageTypeID);
  }

  LocationOut(DutySlipID:Number)
  {
    return this.httpClient.get(this.API_LOC_OUT_IN + "/"+'LocationIn'+ "/"+ DutySlipID);
  }

  LocationOutOrHubID(DutySlipID:Number)
  {
       return this.httpClient.get(this.API_DutySlipForBilling+"/"+'GetLocationOutLocationHubID' + "/"+ DutySlipID);
  }
  
  getTableDataForCustomer(customerID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CustomerInfo+'/'+customerID);
  }
  calculateBill(dutySlipID:any):  Observable<any> 
  { console.log(this.API_CalculateBill+'/'+dutySlipID);
    return this.httpClient.get(this.API_CalculateBill+'/'+dutySlipID);
  }

  generateBill(dutySlipID:any):  Observable<any> 
  { 
    let userID=this.generalService.getUserID();
    console.log(this.API_GenerateBill+'/'+dutySlipID + '/'+userID);
    return this.httpClient.get(this.API_GenerateBill+'/'+dutySlipID + '/'+userID);
  }
  getTableDataForReservation(reservationID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_ReservationInfo+'/'+'ForReservationClosingDetails/'+reservationID);
  }

  // getTableData(dutySlipID:any):  Observable<any> 
  // {
  //   return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/' +dutySlipID);
  // }

  getTableDataForApp(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforApp' + '/' +dutySlipID);
  }

  getTableDataForDriver(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforDriver' + '/' +dutySlipID);
  }

  getTableDataForGPS(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforGPS' + '/' +dutySlipID);
  }
  getTableDataForBilling(dutySlipID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_CurrentDutyInfo+ '/'+ 'GetDataforBilling' + '/' +dutySlipID);
  }

  addUpdateReservationStopDetail(requestPayload: any) {
    const apiUrl = this.generalService.BaseURL+ "reservationStopDetails";
    return this.httpClient.post<any>(apiUrl, requestPayload);
  }

  getClosingData(reservationID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_DutySlipForBilling+ '/'+ 'GetClosingData' + '/' +reservationID);
  }
  // updateDispute(advanceTable:any)
  // {
  //   return this.httpClient.put<any>(this.API_DutySlipForBilling+'/UpdateDispute' , advanceTable);
  // }

  updateAdditional(advanceTable:any)
  {
    return this.httpClient.put<any>(this.API_DutySlipForBilling+'/UpdateAdditionalKMsAndMinutes' , advanceTable);
  }

  // getDutySlipMap(dutySlipID:any):  Observable<any> 
  // {
  //   return this.httpClient.get(this.API_URL_CurrentDutyInfo+'/' +dutySlipID);
  // }

  getDutySlipMap(dutySlipID:any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL_CurrentDutyInfo +'/' +dutySlipID);
  }

  getDutySlipForBillingData(dutySlipForBillingID:any): Observable<any> {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/GetDutySlipForBillingData/' +dutySlipForBillingID);
  }

  getCurrentDuty(dutySlipID:any): Observable<any> {
    return this.httpClient.get<any>(this.API_URL_CurrentDutyInfo+'/GetCurrentDutyByDutySlipID/' +dutySlipID);
  }

  getKmForApp(dutySlipID:any): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/getKMByApp/' +dutySlipID);
  }

  getKmForDriver(dutySlipID:any): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/getKMByDriver/' +dutySlipID);
  }

  getKmForPervious(reservationID:any,registrationNumber:any): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/getKMOfPreviousBooking/' + reservationID + '/' + registrationNumber);
  }

  getClosureType(dutySlipID:any): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/getClosureType/' + dutySlipID);
  }

  getDutySlipByAppDateTime(dutySlipID:any): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/getDutySlipByAppDateTime/' + dutySlipID);
  }

  getDutySlipReceived(dutySlipID:any): Observable<any> 
  {
    return this.httpClient.get<any>(this.API_DutySlipForBilling+'/DutySlipReceivedCheck/' + dutySlipID);
  }

  addSalesPerson(advanceTable: ReservationSalesPersonModel) 
    {
      advanceTable.reservationSalesPersonID=-1;
      advanceTable.userID=this.generalService.getUserID();
      return this.httpClient.post<any>(this.API_SalesPerson , advanceTable);
    }
    updateSalesPerson(advanceTable: ReservationSalesPersonModel)
    {
      advanceTable.userID=this.generalService.getUserID();
      return this.httpClient.put<any>(this.API_SalesPerson , advanceTable);
    }

    deleteSalesPerson(reservationSalesPersonID: number):  Observable<any> 
    {
      let userID = this.generalService.getUserID();
      return this.httpClient.delete(this.API_SalesPerson + '/'+ reservationSalesPersonID  + '/'+ userID);
    }

    getSalesPerson(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
    {
      return this.httpClient.get(this.API_SalesPerson + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationSalesPersonID/Ascending');
    }
}
  

