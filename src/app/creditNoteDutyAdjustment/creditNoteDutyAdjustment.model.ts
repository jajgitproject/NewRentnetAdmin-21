// @ts-nocheck
export class CreditNoteDutyAdjustmentModel {
  invoiceID: number;
  gstType: string;
  igstPercentage: number;
  igstAmount: number;
  sgstPercentage: number;
  sgstAmount: number;
  cgstPercentage: number;
  cgstAmount: number;
  dutyTotalPackageAmount: number;
  amount: number;
  debitedTo: string;
  dutySlipID: number;
  invoiceDate: Date | null;
  customerID: number;
  customerName: string;
  cityID: number;
  cityName: string;
  vehicleID: number;
  vehicle: string;
  packageTypeID: number;
  packageType: string;
  packageID: number;
  package: string;
  branchID: number;
  branchName: string;
  passengerID: number;
  passengerName: string;
  creditNoteAmount:number;

  constructor(creditNoteDutyAdjustmentModel) {
    this.invoiceID = creditNoteDutyAdjustmentModel.invoiceID || '';
    this.gstType = creditNoteDutyAdjustmentModel.gstType || '';
    this.igstPercentage = creditNoteDutyAdjustmentModel.igstPercentage || '';
    this.igstAmount = creditNoteDutyAdjustmentModel.igstAmount || '';
    this.sgstPercentage = creditNoteDutyAdjustmentModel.sgstPercentage || '';
    this.sgstAmount = creditNoteDutyAdjustmentModel.sgstAmount || '';
    this.cgstPercentage = creditNoteDutyAdjustmentModel.cgstPercentage || '';
    this.cgstAmount = creditNoteDutyAdjustmentModel.cgstAmount || '';
    this.dutyTotalPackageAmount = creditNoteDutyAdjustmentModel.dutyTotalPackageAmount || '';
    this.amount = creditNoteDutyAdjustmentModel.amount || '';
    this.debitedTo = creditNoteDutyAdjustmentModel.debitedTo || '';
    this.dutySlipID = creditNoteDutyAdjustmentModel.dutySlipID || '';
    this.invoiceDate = creditNoteDutyAdjustmentModel.invoiceDate || '';
    this.customerID = creditNoteDutyAdjustmentModel.customerID || '';
    this.customerName = creditNoteDutyAdjustmentModel.customerName || '';
    this.cityID = creditNoteDutyAdjustmentModel.cityID || '';
    this.cityName = creditNoteDutyAdjustmentModel.cityName || '';
    this.vehicleID = creditNoteDutyAdjustmentModel.vehicleID || '';
    this.vehicle = creditNoteDutyAdjustmentModel.vehicle || '';
    this.packageTypeID = creditNoteDutyAdjustmentModel.packageTypeID || '';
    this.packageType = creditNoteDutyAdjustmentModel.packageType || '';
    this.packageID = creditNoteDutyAdjustmentModel.packageID || '';
    this.package = creditNoteDutyAdjustmentModel.package || '';
    this.branchID = creditNoteDutyAdjustmentModel.branchID || '';
    this.branchName = creditNoteDutyAdjustmentModel.branchName || '';
    this.passengerID = creditNoteDutyAdjustmentModel.passengerID || '';
    this.passengerName = creditNoteDutyAdjustmentModel.passengerName || '';
    this.creditNoteAmount = creditNoteDutyAdjustmentModel.creditNoteAmount || '';
  }
}


export class InvoiceCreditNoteDutySlipAdjustmentModel {
  invoiceCreditNoteDutySlipAdjustmentID:number;
  invoiceCreditNoteID:number;
  dutySlipID: number;
  invoiceID: number;
  amount: number;
  igstPercentage: number;
  igstAmount: number;
  sgstPercentage: number;
  sgstAmount: number;
  cgstPercentage: number;
  cgstAmount: number;
  debitedTo: string;
  debitedToDriverID:number;
  debitedToDriverName:string;
  debitedToSupplierID:number;
  debitedToSupplierName:string;
  debitedToEcoID:number;
  debitedToEcoName:string;
  reason:string;
  details:string;
  adjustedByID: number;
  activationStatus: boolean;

  constructor(invoiceCreditNoteDutySlipAdjustmentModel) {
    this.invoiceCreditNoteDutySlipAdjustmentID = invoiceCreditNoteDutySlipAdjustmentModel.invoiceCreditNoteDutySlipAdjustmentID || -1;
    this.invoiceCreditNoteID = invoiceCreditNoteDutySlipAdjustmentModel.invoiceCreditNoteID || '';
    this.dutySlipID = invoiceCreditNoteDutySlipAdjustmentModel.dutySlipID || '';
    this.invoiceID = invoiceCreditNoteDutySlipAdjustmentModel.invoiceID || '';
    this.amount = invoiceCreditNoteDutySlipAdjustmentModel.amount || '';
    this.igstPercentage = invoiceCreditNoteDutySlipAdjustmentModel.igstPercentage || '';
    this.igstAmount = invoiceCreditNoteDutySlipAdjustmentModel.igstAmount || '';
    this.sgstPercentage = invoiceCreditNoteDutySlipAdjustmentModel.sgstPercentage || '';
    this.sgstAmount = invoiceCreditNoteDutySlipAdjustmentModel.sgstAmount || '';
    this.cgstPercentage = invoiceCreditNoteDutySlipAdjustmentModel.cgstPercentage || '';
    this.cgstAmount = invoiceCreditNoteDutySlipAdjustmentModel.cgstAmount || '';    
    this.debitedTo = invoiceCreditNoteDutySlipAdjustmentModel.debitedTo || '';    
    this.debitedToDriverID = invoiceCreditNoteDutySlipAdjustmentModel.debitedToDriverID || '';
    this.debitedToDriverName = invoiceCreditNoteDutySlipAdjustmentModel.debitedToDriverName || '';
    this.debitedToSupplierID = invoiceCreditNoteDutySlipAdjustmentModel.debitedToSupplierID || '';
    this.debitedToSupplierName = invoiceCreditNoteDutySlipAdjustmentModel.debitedToSupplierName || '';
    this.debitedToEcoID = invoiceCreditNoteDutySlipAdjustmentModel.debitedToEcoID || '';
    this.debitedToEcoName = invoiceCreditNoteDutySlipAdjustmentModel.debitedToEcoName || '';
    this.reason = invoiceCreditNoteDutySlipAdjustmentModel.reason || '';
    this.details = invoiceCreditNoteDutySlipAdjustmentModel.details || '';
    this.adjustedByID = invoiceCreditNoteDutySlipAdjustmentModel.adjustedByID || '';
    this.activationStatus = invoiceCreditNoteDutySlipAdjustmentModel.activationStatus || '';
  }
}


export class DriverSupplierModel{
  driverID:number;
  driverName:string;
  supplierID:number;
  supplierName:string;
}
