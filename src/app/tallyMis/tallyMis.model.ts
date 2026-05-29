// @ts-nocheck
/** Column order matches MISTally API / CSV export */
export const MISTALLY_API_COLUMNS: string[] = [
  'BranchState',
  'State',
  'GSTNo',
  'Billno',
  'BillDate',
  'Customerid',
  'CustomerName',
  'CarHireCharges',
  'ParkingandToll',
  'NetCCProcessingamount',
  'SUBTOTAL',
  'NetSgstAmount',
  'NetCgstAmount',
  'NetIgstAmount',
  'FinalBillAmount',
  'SGSTRate',
  'CGSTRate',
  'IGSTRate',
  'IRNNO',
  'IRNDATE'
];

/** JSON key variants per API property (camelCase + PascalCase) */
export const MISTALLY_COLUMN_ALIASES: Record<string, string[]> = {
  BranchState: ['BranchState', 'branchState'],
  State: ['State', 'state'],
  GSTNo: ['GSTNo', 'gstNo', 'gstNO'],
  Billno: ['Billno', 'billno'],
  BillDate: ['BillDate', 'billDate'],
  Customerid: ['Customerid', 'customerid', 'customerID'],
  CustomerName: ['CustomerName', 'customerName'],
  CarHireCharges: ['CarHireCharges', 'carHireCharges'],
  ParkingandToll: ['ParkingandToll', 'parkingandToll'],
  NetCCProcessingamount: ['NetCCProcessingamount', 'netCCProcessingamount'],
  SUBTOTAL: ['SUBTOTAL', 'subtotal', 'sUBTOTAL'],
  NetSgstAmount: ['NetSgstAmount', 'netSgstAmount'],
  NetCgstAmount: ['NetCgstAmount', 'netCgstAmount'],
  NetIgstAmount: ['NetIgstAmount', 'netIgstAmount'],
  FinalBillAmount: ['FinalBillAmount', 'finalBillAmount'],
  SGSTRate: ['SGSTRate', 'sgstRate', 'sGSTRate'],
  CGSTRate: ['CGSTRate', 'cgstRate', 'cGSTRate'],
  IGSTRate: ['IGSTRate', 'igstRate', 'iGSTRate'],
  IRNNO: ['IRNNO', 'irnno', 'iRNNO'],
  IRNDATE: ['IRNDATE', 'irndate', 'iRNDATE']
};
