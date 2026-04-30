// @ts-nocheck
import { formatDate, Time } from '@angular/common';
export class DutyRegisterModel {
  reservationID: number;
  primaryBookerID:number;
  passengerMobile:string;
  customerPersonName:string;
  modeOfPaymentID:number;
  modeOfPayment:string;
  reservationGroupID:number;
  bookingType:string;
  pickupDate:Date;
  customerID:number;
  cancellationDateTime:Date;
  customerSpecificFields:string;
  customerName:string;
  gender:string;
  importance:string;
  primaryEmail:string;
  loyalGuest:boolean;
  pickupCityID:number;
  city:string;
  packageID:number;
  package:string;
  packageTypeID:number;
  packageType:string;
  pickupAddress:string;
  modeOfPaymentChangeReason:string;
  vehicleID:number;
  carSent:string;
  carBooked:string;
  inventoryID:number;
  registrationNumber:string;
  driverName:string;
  dutySlipID:number;
  dsClosing:string;
  locationOutAddressString:string;
  actualCarMovedFrom:string;
  locationOutDate:Date;
  locationOutTime:Date;
  locationOutKM:number;
  locationInDate:Date;
  locationInTime:Date;
  locationInKM:number;
  tripStatus:string;
  driverRemark:string;
  locationOutLocationOrHubID:number;
  organizationalEntityName:string;
  supplierID:number;
  supplierName:string;
  supplierTypeID:number;
  supplierType:string;
  employeeID:number;
  loggedInUser:string;
  disputeType:string;
  specialInstruction:string;
  dateOfFeedback:Date;
  feedbackPointsOutOfFive:number;
  feedbackRemark:string;
  customerTypeID:number;
  customerType:string;
  customerGroupID:number;
  customerGroup: string;
  manualDutySlipNumber:string;
  reportingToGuestKM:number;
  reportingToGuestTime:Date;
  releasingKM:number;
  releasingTime:Date;
  goodForBilling:boolean;
  baseFare:number;
  carUpgraded:string;
  customerCreationDate:Date;
  dateOfAllotment:Date;
  timeofAllotment:Time;
  selfDeclaration:boolean;
  bodyTemperatureInDegreeCelcius:number;
  fuelType:string;
  amount:number;
  customerCategory:string;
  fgrkmAmount:number;
  packageBaseRate:number;
  extraKMAmount:number;
  extraMinutesAmount:number;
  revenue:number;
  invoiceNumber:number;
  manualInvoiceNumber:number;
  invoiceDate:Date;
  totalAmountAfterDiscout:number;
  invoiceTotalAmountAfterGST:Date;
  invoiceStatusActiveOrVoid:string;
  totalKMWithAddtionalKM:number;
  totalHoursWithAddtionalHours:number;
  tollParkingType:string;
  tollParkingAmount:number;
  interStateTaxAmount:number;
  communicationTextSentTo:string;
  extraMinutes:number;
  extraKMs:number;
  totalFuelSurchargeOnExtraKM:number;
  totalFuelSurchargeOnExtraHours:number;
  totalFuelSurchargeOnPackageRate:number;
  invoiceSummaryID:number;
  invoiceSummaryDate:Date;
  dutyExpenseChargeTotal:Date;
  dutyExpenseNonChargeTotal:Date;
  reservationStatus:string;
  inventoryOwnedSupplied:string;
  salesPersonID: number;
  salesPerson: string;
  physicalDutySlipReceived:boolean;
  activationStatus: boolean;
  allotmentStatus:string;
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

