// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer, CustomerNameModel } from './customer.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customer";
  }
  /** CRUD METHODS */
  getTableData(
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchCustomerType+ '/'+searchcustomerGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }

   getTableDataForSerch(
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchCustomerType+ '/'+searchcustomerGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }

  
  getTableDataSort(
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+searchCustomerType + '/'+searchcustomerGroup + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Customer) 
  {
    advanceTable = this.sanitizePayload(advanceTable);
    advanceTable.customerCreatedByID=this.generalService.getUserID();
    advanceTable.customerID=-1;

    if(!advanceTable.maximumAgeOfCarToBeSent){
      advanceTable.maximumAgeOfCarToBeSent=0
    }

    if(!advanceTable.locationCollectionInterval){
      advanceTable.locationCollectionInterval=0
    }
    if(!advanceTable.locationUploadInterval){
      advanceTable.locationUploadInterval=0
    }
    if (advanceTable.newCustomer === false) 
      {
        advanceTable.treatAsNewCustomerTillDateString = null;
      }
      else 
      {
        advanceTable.treatAsNewCustomerTillDateString = this.generalService.getTimeApplicable(advanceTable.treatAsNewCustomerTillDate);
      }
    advanceTable.customerCreationDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreationDate);
    
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Customer)
  {
    advanceTable = this.sanitizePayload(advanceTable);
    advanceTable.customerCreatedByID=this.generalService.getUserID();

    // if(!advanceTable.maximumAgeOfCarToBeSent){
    //   advanceTable.maximumAgeOfCarToBeSent=0
    // }

    // if(!advanceTable.locationCollectionInterval){
    //   advanceTable.locationCollectionInterval=0
    // }
    // if(!advanceTable.locationUploadInterval){
    //   advanceTable.locationUploadInterval=0
    // }
    if (advanceTable.newCustomer === false) 
      {
        advanceTable.treatAsNewCustomerTillDateString = null;
      }
      else 
      {
        advanceTable.treatAsNewCustomerTillDateString = this.generalService.getTimeApplicable(advanceTable.treatAsNewCustomerTillDate);
      }
    advanceTable.customerCreationDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreationDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  /** Coerce empty strings so System.Text.Json model binding does not return 400. */
  private sanitizePayload(raw: any): any {
    const toInt = (v: any, fallback: number = 0) => {
      if (v === null || v === undefined || v === '') return fallback;
      const n = Number(v);
      return Number.isFinite(n) ? n : fallback;
    };
    const toBool = (v: any, fallback: boolean = false) => {
      if (v === null || v === undefined || v === '') return fallback;
      if (typeof v === 'boolean') return v;
      if (v === 'true' || v === 1 || v === '1') return true;
      if (v === 'false' || v === 0 || v === '0') return false;
      return fallback;
    };

    return {
      ...raw,
      customerID: toInt(raw.customerID, -1),
      customerGroupID: toInt(raw.customerGroupID),
      customerTypeID: toInt(raw.customerTypeID),
      customerCategoryID: toInt(raw.customerCategoryID),
      companyID: toInt(raw.companyID),
      corporateCompanyID: toInt(raw.corporateCompanyID),
      countryForISDCodeID: toInt(raw.countryForISDCodeID),
      serviceLocationID: toInt(raw.serviceLocationID),
      customerCreatedByID: toInt(raw.customerCreatedByID),
      tallyCustomerID: toInt(raw.tallyCustomerID),
      maximumAgeOfCarToBeSent: toInt(raw.maximumAgeOfCarToBeSent),
      locationCollectionInterval: toInt(raw.locationCollectionInterval),
      locationUploadInterval: toInt(raw.locationUploadInterval),
      locationOutIntervalInMinutes: toInt(raw.locationOutIntervalInMinutes),
      businessTypeID: toInt(raw.businessTypeID),
      newCustomer: toBool(raw.newCustomer, false),
      activationStatus: toBool(raw.activationStatus, true),
      customerPriority: toBool(raw.customerPriority, false),
      latLonRequired: toBool(raw.latLonRequired, false),
      printRunningDetailOnDutySlip: toBool(raw.printRunningDetailOnDutySlip, false),
      showRateOnDutySlip: toBool(raw.showRateOnDutySlip, false),
      showOTPOnDutySlip: toBool(raw.showOTPOnDutySlip, false),
      isBookerAllowedToBeCreatedFromReservation: toBool(raw.isBookerAllowedToBeCreatedFromReservation, false),
      isPostPickUpCallAllowed: toBool(raw.isPostPickUpCallAllowed, false),
      isBillToShipToCustomer: toBool(raw.isBillToShipToCustomer, false),
      customerIdentityNumber: raw.customerIdentityNumber || '',
      panNo: raw.panNo || '',
      gstCustomerType: raw.gstCustomerType || '',
      segment: raw.segment || '',
      businessType: raw.businessType || '',
      businessServices: raw.businessServices || '',
    };
  }
  delete(customerID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerID+ '/'+ userID);
  }

  DuplicateCustomer(CustomerName:string): Observable<CustomerNameModel>
  {
    return this.httpClient.get<CustomerNameModel>(this.API_URL + "/checkDuplicateCustomerName/" + CustomerName);
  }
}
