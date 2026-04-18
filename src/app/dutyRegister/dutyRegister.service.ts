// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyRegisterModel, SearchCriteria } from './dutyRegister.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyRegisterService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyRegister";
  }
  /** CRUD METHODS */
  // getTableData(SearchCustomerGroup:string,SearchCustomerPerson:string,SearchDutyType:string,SearchFeedbackDate:string,
  //             SearchClosureType:string,SearchDispatchLocation:string,SearchMOP:string,SearchSupplierType:string,SearchSupplier:string,
  //             SearchFromDate:string,SearchToDate:string,SearchSalesPerson:string,SearchCarSend:string,SearchCarBooked:string,
  //             SearchCustomerType:string,SearchCustomerLocation:string,SearchBookingStatus:string,SearchDri:string,SearchCarNo:string,
  //             SearchOwnSupplier:string,SearchReservationNo:string,SearchDutySlipNo:string,SearchGuestName:string,SearchGuestEmail:string,
  //             SearchCity:string,
  //   PageNumber: number):  Observable<any> 
  // {
  //   if(SearchCustomerGroup==="")
  //   {
  //     SearchCustomerGroup="null";
  //   }
  //   if(SearchCustomerLocation==="")
  //   {
  //     SearchCustomerLocation="null";
  //   }
  //   if(SearchCustomerPerson==="")
  //   {
  //     SearchCustomerPerson="null";
  //   }
  //   if(SearchDutyType==="")
  //   {
  //     SearchDutyType="null";
  //   }
  //   if(SearchFeedbackDate==="")
  //   {
  //     SearchFeedbackDate="null";
  //   }
  //   if(SearchClosureType==="")
  //   {
  //     SearchClosureType="null";
  //   }
  //   if(SearchDispatchLocation==="")
  //   {
  //     SearchDispatchLocation="null";
  //   }
  //   if(SearchMOP==="")
  //   {
  //     SearchMOP="null";
  //   }
  //   if(SearchSupplierType==="")
  //   {
  //     SearchSupplierType="null";
  //   }
  //   if(SearchFromDate==="")
  //   {
  //     SearchFromDate="null";
  //   }
  //   if(SearchToDate==="")
  //   {
  //     SearchToDate="null";
  //   }
  //   if(SearchSalesPerson==="")
  //   {
  //     SearchSalesPerson="null";
  //   }
  //   if(SearchSupplier==="")
  //   {
  //     SearchSupplier="null";
  //   }
  //   if(SearchCarSend==="")
  //   {
  //     SearchCarSend="null";
  //   }
  //   if(SearchCarBooked==="")
  //   {
  //     SearchCarBooked="null";
  //   }
  //   if(SearchBookingStatus==="")
  //   {
  //     SearchBookingStatus="null";
  //   }
  //   if(SearchDri==="")
  //   {
  //     SearchDri="null";
  //   }
  //   if(SearchCarNo==="")
  //   {
  //     SearchCarNo="null";
  //   }
  //   if(SearchOwnSupplier==="")
  //   {
  //     SearchOwnSupplier="null";
  //   }
  //   if(SearchCustomerType==="")
  //   {
  //     SearchCustomerType="null";
  //   }
  //   if(SearchReservationNo==="")
  //   {
  //     SearchReservationNo="null";
  //   }
  //   if(SearchDutySlipNo==="")
  //   {
  //     SearchDutySlipNo="null";
  //   }
  //   if(SearchGuestName==="")
  //   {
  //     SearchGuestName="null";
  //   }
  //   if(SearchGuestEmail==="")
  //   {
  //     SearchGuestEmail="null";
  //   }
  //   if(SearchCity==="")
  //   {
  //     SearchCity="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" + SearchCustomerGroup  + '/' + SearchCustomerPerson + '/' + SearchDutyType + '/' + SearchFeedbackDate + '/' + 
  //                             SearchClosureType + '/' + SearchDispatchLocation + '/' +SearchMOP + '/' + SearchSupplierType + '/' + SearchSupplier + '/' +
  //                             SearchFromDate + '/' + SearchToDate + '/' + SearchSalesPerson + '/' + SearchCarSend + '/' + SearchCarBooked + '/' + 
  //                             SearchCustomerType + '/' + SearchCustomerLocation + '/' + SearchBookingStatus + '/' + SearchDri + '/' + SearchCarNo + '/' + 
  //                             SearchOwnSupplier + '/' + SearchReservationNo + '/' + SearchDutySlipNo + '/' + SearchGuestName + '/' + SearchGuestEmail + '/' +
  //                             SearchCity + '/'
  //       + PageNumber + '/ReservationID/Descending');
  // }

  // getTableDataSort(SearchCustomerGroup:string,SearchCustomerPerson:string,SearchDutyType:string,SearchFeedbackDate:string,
  //                 SearchClosureType:string,SearchDispatchLocation:string,SearchMOP:string,SearchSupplierType:string,SearchSupplier:string,
  //                 SearchFromDate:string,SearchToDate:string,SearchSalesPerson:string,SearchCarSend:string,SearchCarBooked:string,
  //                 SearchCustomerType:string,SearchCustomerLocation:string,SearchBookingStatus:string,SearchDri:string,SearchCarNo:string,
  //                 SearchOwnSupplier:string,SearchReservationNo:string,SearchDutySlipNo:string,SearchGuestName:string,SearchGuestEmail:string,
  //                 SearchCity:string,
  //   PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchCustomerGroup==="")
  //   {
  //     SearchCustomerGroup="null";
  //   }
  //   if(SearchCustomerLocation==="")
  //   {
  //     SearchCustomerLocation="null";
  //   }
  //   if(SearchCustomerPerson==="")
  //   {
  //     SearchCustomerPerson="null";
  //   }
  //   if(SearchDutyType==="")
  //   {
  //     SearchDutyType="null";
  //   }
  //   if(SearchFeedbackDate==="")
  //   {
  //     SearchFeedbackDate="null";
  //   }
  //   if(SearchClosureType==="")
  //   {
  //     SearchClosureType="null";
  //   }
  //   if(SearchDispatchLocation==="")
  //   {
  //     SearchDispatchLocation="null";
  //   }
  //   if(SearchMOP==="")
  //   {
  //     SearchMOP="null";
  //   }
  //   if(SearchSupplierType==="")
  //   {
  //     SearchSupplierType="null";
  //   }
  //   if(SearchFromDate==="")
  //   {
  //     SearchFromDate="null";
  //   }
  //   if(SearchToDate==="")
  //   {
  //     SearchToDate="null";
  //   }
  //   if(SearchSalesPerson==="")
  //   {
  //     SearchSalesPerson="null";
  //   }
  //   if(SearchSupplier==="")
  //   {
  //     SearchSupplier="null";
  //   }
  //   if(SearchCarSend==="")
  //   {
  //     SearchCarSend="null";
  //   }
  //   if(SearchCarBooked==="")
  //   {
  //     SearchCarBooked="null";
  //   }
  //   if(SearchBookingStatus==="")
  //   {
  //     SearchBookingStatus="null";
  //   }
  //   if(SearchDri==="")
  //   {
  //     SearchDri="null";
  //   }
  //   if(SearchCarNo==="")
  //   {
  //     SearchCarNo="null";
  //   }
  //   if(SearchOwnSupplier==="")
  //   {
  //     SearchOwnSupplier="null";
  //   }
  //   if(SearchCustomerType==="")
  //   {
  //     SearchCustomerType="null";
  //   }
  //   if(SearchReservationNo==="")
  //   {
  //     SearchReservationNo="null";
  //   }
  //   if(SearchDutySlipNo==="")
  //   {
  //     SearchDutySlipNo="null";
  //   }
  //   if(SearchGuestName==="")
  //   {
  //     SearchGuestName="null";
  //   }
  //   if(SearchGuestEmail==="")
  //   {
  //     SearchGuestEmail="null";
  //   }
  //   if(SearchCity==="")
  //   {
  //     SearchCity="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" + SearchCustomerGroup  + '/' + SearchCustomerPerson + '/' + SearchDutyType + '/' + SearchFeedbackDate + '/' + 
  //                             SearchClosureType + '/' + SearchDispatchLocation + '/' +SearchMOP + '/' + SearchSupplierType + '/' + SearchSupplier + '/' +
  //                             SearchFromDate + '/' + SearchToDate + '/' + SearchSalesPerson + '/' + SearchCarSend + '/' + SearchCarBooked + '/' + 
  //                             SearchCustomerType + '/' + SearchCustomerLocation + '/' + SearchBookingStatus + '/' + SearchDri + '/' + SearchCarNo + '/' + 
  //                             SearchOwnSupplier + '/' + SearchReservationNo + '/' + SearchDutySlipNo + '/' + SearchGuestName + '/' + SearchGuestEmail + '/' +
  //                             SearchCity + '/'
  //      + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  getTableData(criteria: SearchCriteria, pageNumber: number): Observable<any> {
    const updatedCriteria = {
      SearchCustomerGroup: criteria.SearchCustomerGroup || "null",
      SearchCustomerPersonName: criteria.SearchCustomerPersonName || "null",
      SearchDutyType: criteria.SearchDutyType || "null",
      SearchFeedbackDate: criteria.SearchFeedbackDate || "null",
      SearchSlipReceipt: criteria.SearchSlipReceipt,
      SearchClosureType: criteria.SearchClosureType || "null",
      SearchDispatchLocation: criteria.SearchDispatchLocation || "null",
      SearchMOP: criteria.SearchMOP || "null",
      SearchSupplierType: criteria.SearchSupplierType || "null",
      SearchSupplier: criteria.SearchSupplier || "null",
      SearchFromDate: criteria.SearchFromDate || "null",
      SearchToDate: criteria.SearchToDate || "null",
      SearchSalesPersonName: criteria.SearchSalesPersonName || "null",
      SearchCarSent: criteria.SearchCarSent || "null",
      SearchCarBook: criteria.SearchCarBook || "null",
      SearchCustomerType: criteria.SearchCustomerType || "null",
      SearchCustomerLocationName: criteria.SearchCustomerLocationName || "null",
      SearchBookingStatus: criteria.SearchBookingStatus || "null",
      SearchDri: criteria.SearchDri || "null",
      SearchCarNo: criteria.SearchCarNo || "null",
      SearchSupplierO: criteria.SearchSupplierO || "null",
      SearchRes: criteria.SearchRes || "null",
      SearchDuty: criteria.SearchDuty || "null",
      SearchGuestName: criteria.SearchGuestName || "null",
      // SearchGuestEmail: criteria.SearchGuestEmail || "null",
      SearchGuestMobile: criteria.SearchGuestMobile || "null",  
      SearchCity: criteria.SearchCity || "null",
      SearchCancellationDateFrom: criteria.SearchCancellationDateFrom || "null",
      SearchCancellationDateTo: criteria.SearchCancellationDateTo || "null",
      SearchBookingDateFrom: criteria.SearchBookingDateFrom || "null",
      SearchBookingDate: criteria.SearchBookingDate || "null",
      SearchChangeMOPCase: criteria.SearchChangeMOPCase || "null",
      SearchLocationGroup: criteria.SearchLocationGroup || "null",
      SearchBillToDate: criteria.SearchBillToDate || "null",
      SearchBillFromDate: criteria.SearchBillFromDate || "null",
      SearchBillStatus:criteria.SearchBillStatus || "null",
      order: "Descending",
      orderbyColumn: "ReservationID"
    };
    return this.httpClient.post(`${this.API_URL}`, updatedCriteria);
  }

  getTableDataSort(criteria: SearchCriteria,pageNumber: number,coloumName: string,sortType: string): Observable<any> {
    const updatedCriteria = {
      SearchCustomerGroup: criteria.SearchCustomerGroup || "null",
      SearchCustomerPersonName: criteria.SearchCustomerPersonName || "null",
      SearchDutyType: criteria.SearchDutyType || "null",
      SearchFeedbackDate: criteria.SearchFeedbackDate || "null",
      SearchSlipReceipt: criteria.SearchSlipReceipt,
      SearchClosureType: criteria.SearchClosureType || "null",
      SearchDispatchLocation: criteria.SearchDispatchLocation || "null",
      SearchMOP: criteria.SearchMOP || "null",
      SearchSupplierType: criteria.SearchSupplierType || "null",
      SearchSupplier: criteria.SearchSupplier || "null",
      SearchFromDate: criteria.SearchFromDate || "null",
      SearchToDate: criteria.SearchToDate || "null",
      SearchSalesPersonName: criteria.SearchSalesPersonName || "null",
      SearchCarSent: criteria.SearchCarSent || "null",
      SearchCarBook: criteria.SearchCarBook || "null",
      SearchCustomerType: criteria.SearchCustomerType || "null",
      SearchCustomerLocationName: criteria.SearchCustomerLocationName || "null",
      SearchBookingStatus: criteria.SearchBookingStatus || "null",
      SearchDri: criteria.SearchDri || "null",
      SearchCarNo: criteria.SearchCarNo || "null",
      SearchSupplierO: criteria.SearchSupplierO || "null",
      SearchRes: criteria.SearchRes || "null",
      SearchDuty: criteria.SearchDuty || "null",
      SearchGuestName: criteria.SearchGuestName || "null",
      // SearchGuestEmail: criteria.SearchGuestEmail || "null",
      SearchGuestMobile: criteria.SearchGuestMobile || "null",
      SearchCity: criteria.SearchCity || "null",
      SearchCancellationDateFrom: criteria.SearchCancellationDateFrom || "null",
      SearchCancellationDateTo: criteria.SearchCancellationDateTo || "null",
      SearchBookingDateFrom: criteria.SearchBookingDateFrom || "null",
      SearchBookingDate: criteria.SearchBookingDate || "null",
      SearchChangeMOPCase: criteria.SearchChangeMOPCase || "null",  
      SearchLocationGroup: criteria.SearchLocationGroup || "null",
      SearchBillFromDate: criteria.SearchBillFromDate || "null",
      SearchBillToDate: criteria.SearchBillToDate || "null",
       SearchBillStatus:criteria.SearchBillStatus || "null" ,
      order: "Descending",
      orderbyColumn: "ReservationID"
    };
    return this.httpClient.post(`${this.API_URL}`, updatedCriteria);
  }
  
}
  

