// @ts-nocheck
import { formatDate, Time } from '@angular/common';
export class DutyRegisterModel {

  reservationID: number;

  dutySlipID: number;

  pickupDate: Date | null;
  bookingDate: string;

  dispatchLocation: string;

  customerGroup: string;

  customerID: number;
  customerName: string;

  customerType: string;

  bookerName: string;
  guestName: string;
  guestMobile: string;

  city: string;

  packageType: string;
  billedDutyType: string;

  package: string;

  carBooked: string;
  carSent: string;

  carNumber: string;

  driverName: string;

  modeOfPayment: string;

  locationOutDate: Date | null;
  locationOutTime: string;
  locationOutKM: number;

  dsPickUpDate: Date | null;
  pickUpTime: string;
  pickUpKM: number;

  dropOffDate: Date | null;
  dropOffTime: string;
  dropOffKM: number;

  locationInDate: Date | null;
  locationInTime: string;
  locationInKM: number;

  g2P: number;
  d2G: number;

  appP2D: number;
  driverP2D: number;
  gpsP2D: number;

  totalKMWithAddtionalKM: number;
  totalHoursWithAddtionalHours: number;

  packageBaseRate: number;

  extraMinutes: number;
  extraHRRate: number;
  extraMinutesAmount: number;

  extraKMs: number;
  extraKMRate: number;
  extraKMAmount: number;

  totalDriverAllowanceAmount: number;

  nightAmount: number;

  toll: number;
  parking: number;
  fasTag: number;

  invoiceInterstateTax: number;

  dutyExpenseChargeTotal: number;

  fgrAmount: number;

  revenue: number;

  subTotal: number;

  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;

  gstAmount: number;

  gstType: string;

  invoiceTotalAmountAfterGST: number;

  invoiceNumberWithPrefix: string;

  invoiceDate: Date | null;

  dsVerifyStatus: string;

  goodForBilling: boolean | null;

  dsStatus: string;

  reservationStatus: string;

  ownedSupplied: string;

  supplierType: string;

  adocStatus: boolean | null;

  salesPerson: string;

  kam: string;

  reservationCreatedBy: string;

  allotmentBy: string;

  closureType: string;

  disputeType: string;

  pickupLocation: string;

  dropLocation: string;

  invoiceCreatedBy: string;
}


export class SalesPersonDropDownModel { 
  salesPersonID: number;
  salesPerson: string;

 constructor(salesPersonDropDownModel) {
   {
      this.salesPersonID = salesPersonDropDownModel.salesPersonID || -1;
      this.salesPerson = salesPersonDropDownModel.salesPerson || '';
   }
 }
 
}

export class SearchCriteria 
{
  SearchCustomerGroup: string;
  SearchCustomer: string;
  SearchBranch: string;
  SearchKAM: string;
  SearchBranchID: number;
  SearchKAMID: number;
  SearchCustomerPersonName: string;
  SearchDutyType: string;
  SearchFeedbackDate: string;
  SearchSlipReceipt:boolean;
  SearchClosureType: string;
  SearchDispatchLocation: string;
  SearchMOP: string;
  SearchSupplierType: string;
  SearchSupplier: string;
  SearchFromDate: string;
  SearchToDate: string;
  SearchSalesPersonName: string;
  SearchCarSent: string;
  SearchCarBook: string;
  SearchCustomerType: string;
  SearchCustomerLocationName: string;
  SearchBookingStatus: string;
  SearchImportance: string;
  SearchDSVerification: boolean;
  SearchGoodForBill: boolean;
  SearchDri: string;
  SearchCarNo: string;
  SearchSupplierO: string;
  SearchRes: string;
  SearchDuty: string;
  SearchGuestName: string;
  SearchGuestMobile: string;
  // SearchGuestEmail: string;
  SearchCity: string;
  SearchCancellationDateFrom: string;
  SearchCancellationDateTo:string;
  SearchBookingDateFrom:string;
  SearchBookingDate:string;
  SearchChangeMOPCase:string;
  SearchLocationGroup:string;
  SearchBillFromDate:string;
  SearchBillToDate:string;
  SearchBillStatus:string;
  
}

