// @ts-nocheck
export class SearchCriteria {
  UserID: number;
  ShowAllLocation: boolean;
  SearchFromDate: string;
  SearchToDate: string;
  SearchCreditNoteNumber: string;
  SearchBillNo: string;
  SearchCustomer: string;
  SearchBranch: string;
  SearchApprovalStatus: string;
}

/** Expected CSV columns produced by creditNoteMIS ExportCsv (backend-owned). */
export const CREDIT_NOTE_MIS_CSV_COLUMNS = [
  'CN Branch State',
  'Customer Branch State',
  'gst_no',
  'Booked By',
  'Used By',
  'Credit Note Date',
  'credit_note_no',
  'Customer_name',
  'Customer_alias code',
  'car_hiring_charge',
  'Parking and Toll',
  'Net CC Processing Amount',
  'Sub Total',
  'sgst_amount',
  'cgst_amount',
  'igst_amount',
  'Cess Payable under GST',
  'Credit Note Amount',
  'CGST_rate',
  'SGST_rate',
  'IGST_rate',
  'Round Off',
  'NARRATION',
  'Bill Alter',
  'Cess',
  'Cess Amount',
  'billno',
  'bill_date',
  'credit_note_created_by',
  'accepted_by',
  'IRN',
  'IRN Date',
  'Segment',
  'SAC/HSN',
  'Service Date From',
  'Service Date To',
  'New Bill No',
  'New Bill Date',
  'Remarks',
  'Location branch'
] as const;
