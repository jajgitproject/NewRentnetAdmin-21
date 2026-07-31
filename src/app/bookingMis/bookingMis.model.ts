// @ts-nocheck
export class SearchCriteria {
  UserID: number;
  ShowAllLocation: boolean | null;
  SearchModeOfPayment: string;
  SearchServiceLocation: string;
  SearchCustomer: string;
  SearchDutySlip: string;
  SearchManualDS: string;
  SearchBooking: string;
  SearchCity: string;
  SearchFromDate: string;
  SearchToDate: string;
  SearchCancellationFrom: string;
  SearchCancellationTo: string;
  SearchSalesPerson: string;
  SearchDispatchStatus: string;
  SearchBookingStatus: string;
  SearchCustomerLocation: string;
  SearchGuestName: string;
  SearchPickupDetail: string;
  SearchPickupSubDetail: string;
  SearchCustomerGroup: string;
  SearchBookerName: string;
}

/** Expected CSV columns produced by bookingMIS ExportCsv (backend-owned). */
export const BOOKING_MIS_CSV_COLUMNS = [
  'Booking no',
  'Booking Group',
  'Service Location',
  'Booking Date',
  'Pickup Date',
  'Pickup Time',
  'Customer Name',
  'Guest Name',
  'Guest Mobile No',
  'Booker Name',
  'City',
  'Duty Type',
  'Package',
  'Car Type',
  'Pickup Address',
  'Drop Address',
  'Special Instruction',
  'MOP',
  'Ticket No',
  'Booking Created By',
  'KAM Name'
] as const;
