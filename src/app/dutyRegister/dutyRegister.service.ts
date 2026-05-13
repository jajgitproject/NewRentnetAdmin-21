// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyRegisterModel, SearchCriteria } from './dutyRegister.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { S } from '@angular/cdk/keycodes';
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
      SearchCustomer: criteria.SearchCustomer || "null",
      SearchBranch: criteria.SearchBranch || "null",
      SearchBranchID: criteria.SearchBranchID || 0,
      SearchKAM: criteria.SearchKAM || "null",
      SearchKAMID: criteria.SearchKAMID || 0,
      SearchCustomerPersonName: criteria.SearchCustomerPersonName || "null",
      SearchDutyType: criteria.SearchDutyType || "null",
      SearchFeedbackDate: criteria.SearchFeedbackDate || "null",
      SearchSlipReceipt: criteria.SearchSlipReceipt,
      SearchClosureType: criteria.SearchClosureType || "null",
      SearchDispatchLocationName: criteria.SearchDispatchLocation || "null",
      SearchMOP: criteria.SearchMOP || "null",
      SearchSupplierType: criteria.SearchSupplierType || "null",
      SearchSupplierName: criteria.SearchSupplier || "null",
      SearchFromDate: criteria.SearchFromDate || "null",
      SearchToDate: criteria.SearchToDate || "null",
      SearchSalesPersonName: criteria.SearchSalesPersonName || "null",
      SearchCarSent: criteria.SearchCarSent || "null",
      SearchCarBook: criteria.SearchCarBook || "null",
      SearchCustomerType: criteria.SearchCustomerType || "null",
      SearchCustomerLocationName: criteria.SearchCustomerLocationName || "null",
      SearchBookingStatus: criteria.SearchBookingStatus || "null",
      SearchImportance: criteria.SearchImportance || "null",
      SearchDSVerification:
            criteria.SearchDSVerification !== null &&
            criteria.SearchDSVerification !== undefined
              ? criteria.SearchDSVerification
              : null,
      SearchGoodForBill:
            criteria.SearchGoodForBill !== null &&
            criteria.SearchGoodForBill !== undefined
              ? criteria.SearchGoodForBill
              : null,
      SearchBillStatus:
            criteria.SearchBillStatus !== null &&
            criteria.SearchBillStatus !== undefined
              ? criteria.SearchBillStatus
              : null,
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
      PageNumber: pageNumber,
      Order: "Descending",
      OrderByColumn: "ReservationID"
    };
    console.log(`${this.API_URL}`, updatedCriteria);
    return this.httpClient.post(`${this.API_URL}`, updatedCriteria);
  }

  getTableDataSort(criteria: SearchCriteria,pageNumber: number,coloumName: string,sortType: string): Observable<any> {
    const updatedCriteria = {
      SearchCustomerGroup: criteria.SearchCustomerGroup || "null",
      SearchCustomer: criteria.SearchCustomer || "null",
      SearchBranch: criteria.SearchBranch || "null",
      SearchBranchID: criteria.SearchBranchID || 0,
      SearchKAM: criteria.SearchKAM || "null",
      SearchKAMID: criteria.SearchKAMID || 0,
      SearchCustomerPersonName: criteria.SearchCustomerPersonName || "null",
      SearchDutyType: criteria.SearchDutyType || "null",
      SearchFeedbackDate: criteria.SearchFeedbackDate || "null",
      SearchSlipReceipt: criteria.SearchSlipReceipt,
      SearchClosureType: criteria.SearchClosureType || "null",
      SearchDispatchLocationName: criteria.SearchDispatchLocation || "null",
      SearchMOP: criteria.SearchMOP || "null",
      SearchSupplierType: criteria.SearchSupplierType || "null",
      SearchSupplierName: criteria.SearchSupplier || "null",
      SearchFromDate: criteria.SearchFromDate || "null",
      SearchToDate: criteria.SearchToDate || "null",
      SearchSalesPersonName: criteria.SearchSalesPersonName || "null",
      SearchCarSent: criteria.SearchCarSent || "null",
      SearchCarBook: criteria.SearchCarBook || "null",
      SearchCustomerType: criteria.SearchCustomerType || "null",
      SearchCustomerLocationName: criteria.SearchCustomerLocationName || "null",
      SearchBookingStatus: criteria.SearchBookingStatus || "null",
      SearchImportance: criteria.SearchImportance || "null",
      SearchDSVerification: criteria.SearchDSVerification !== null && criteria.SearchDSVerification !== undefined ? criteria.SearchDSVerification : null,
      SearchGoodForBill: criteria.SearchGoodForBill !== null && criteria.SearchGoodForBill !== undefined ? criteria.SearchGoodForBill : null,
      SearchBillStatus: criteria.SearchBillStatus !== null && criteria.SearchBillStatus !== undefined ? criteria.SearchBillStatus : null,
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
      PageNumber: pageNumber,
      Order: sortType || "Descending",
      OrderByColumn: coloumName || "ReservationID"
    };
    return this.httpClient.post(`${this.API_URL}`, updatedCriteria);
  }

  exportCsv(criteria: SearchCriteria): Observable<Blob> {
    const toNull = (value: any) => {
      if (value === undefined || value === null) {
        return null;
      }
      const text = String(value).trim();
      if (text === '' || text.toLowerCase() === 'null') {
        return null;
      }
      return value;
    };

    const updatedCriteria = {
      SearchCustomerGroup: toNull(criteria.SearchCustomerGroup),
      SearchCustomer: toNull(criteria.SearchCustomer),
      SearchBranch: toNull(criteria.SearchBranch),
      SearchBranchID: criteria.SearchBranchID || 0,
      SearchKAM: toNull(criteria.SearchKAM),
      SearchKAMID: criteria.SearchKAMID || 0,
      SearchCustomerPersonName: toNull(criteria.SearchCustomerPersonName),
      SearchDutyType: toNull(criteria.SearchDutyType),
      SearchFeedbackDate: toNull(criteria.SearchFeedbackDate),
      SearchSlipReceipt: criteria.SearchSlipReceipt,
      SearchClosureType: toNull(criteria.SearchClosureType),
      SearchDispatchLocationName: toNull(criteria.SearchDispatchLocation),
      SearchMOP: toNull(criteria.SearchMOP),
      SearchSupplierType: toNull(criteria.SearchSupplierType),
      SearchSupplierName: toNull(criteria.SearchSupplier),
      SearchFromDate: toNull(criteria.SearchFromDate),
      SearchToDate: toNull(criteria.SearchToDate),
      SearchSalesPersonName: toNull(criteria.SearchSalesPersonName),
      SearchCarSent: toNull(criteria.SearchCarSent),
      SearchCarBook: toNull(criteria.SearchCarBook),
      SearchCustomerType: toNull(criteria.SearchCustomerType),
      SearchCustomerLocationName: toNull(criteria.SearchCustomerLocationName),
      SearchBookingStatus: toNull(criteria.SearchBookingStatus),
      SearchImportance: toNull(criteria.SearchImportance),
      SearchDSVerification: criteria.SearchDSVerification !== null && criteria.SearchDSVerification !== undefined ? criteria.SearchDSVerification : null,
      SearchGoodForBill: criteria.SearchGoodForBill !== null && criteria.SearchGoodForBill !== undefined ? criteria.SearchGoodForBill : null,
      SearchBillStatus: criteria.SearchBillStatus !== null && criteria.SearchBillStatus !== undefined ? criteria.SearchBillStatus : null,                           
      SearchDri: toNull(criteria.SearchDri),
      SearchCarNo: toNull(criteria.SearchCarNo),
      SearchSupplierO: toNull(criteria.SearchSupplierO),
      SearchRes: toNull(criteria.SearchRes),
      SearchDuty: toNull(criteria.SearchDuty),
      SearchGuestName: toNull(criteria.SearchGuestName),
      SearchGuestMobile: toNull(criteria.SearchGuestMobile),
      SearchCity: toNull(criteria.SearchCity),
      SearchCancellationDateFrom: toNull(criteria.SearchCancellationDateFrom),
      SearchCancellationDateTo: toNull(criteria.SearchCancellationDateTo),
      SearchBookingDateFrom: toNull(criteria.SearchBookingDateFrom),
      SearchBookingDate: toNull(criteria.SearchBookingDate),
      SearchChangeMOPCase: toNull(criteria.SearchChangeMOPCase),
      SearchLocationGroup: toNull(criteria.SearchLocationGroup),
      SearchBillFromDate: toNull(criteria.SearchBillFromDate),
      SearchBillToDate: toNull(criteria.SearchBillToDate)
    };
    console.log(`${this.API_URL}/ExportCsv`, updatedCriteria);
    return this.httpClient.post(`${this.API_URL}/ExportCsv`, updatedCriteria, {
      responseType: 'blob'
    });
  }
  
}
  

