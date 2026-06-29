export class DriverPayoutMISModel {
  reservationNo: number;
  dutySlipNo: number;
  customer: string;
  guestName: string;
  carNo: string;
  carBooked: string;
  carSent: string;
  driverID: string;
  driverOfficialID: string;
  driverName: string;
  driverMobile: string;
  city: string;
  package: string;
  locationOutDate: string;
  locationOutTime: string;
  locationOutKM: string;
  locationInDate: string;
  locationInTime: string;
  locationInKM: string;
  totalKM: string;
  totalHRS: string;
  totalDays: string;
  invoiceNo: string;
  verifyDuty: string;
  goodForBilling: string;
  tripStatus: string;
  chargeableExpense: string;
  nonChargeableExpense: string;
  status: string;
  dispatchLocation: string;
  supplierOfficialIdentityNumber: string;
  supplierName: string;
  supplierType: string;
  ownedOrSupplied: string;
  closingType: string;
  physicalDutySlipReceived: string;
}

export class SearchCriteria {
  UserID: number;
  SearchCustomer: string;
  SearchFromDate: string;
  SearchToDate: string;
  SearchDri: string;
  SearchDriverType: string;
  SearchSupplierType: string;
  SearchCity: string;
  SearchDispatchLocation: string;
  PageNumber?: number;
  Order?: string;
  OrderByColumn?: string;
}
