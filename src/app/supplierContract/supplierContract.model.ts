// @ts-nocheck
import { formatDate } from '@angular/common';
export class SupplierContract {
  supplierContractID: number;
  userID:number;
  supplierContractName: string;
  supplierRateCardID: number;
  supplierRateCardName:number;
  copiedFromPreviousContractID:number;
  copiedFromPreviousContractName:string;
  validFrom:Date;
  validFromString:string;
  validTo:Date;
  validToString:string;
  negotiatedByID:number;
  negotiatedBy:string;
  approvedByID:number;
  approvedBy:string;
  gstParking:boolean;
  modeOfPaymentID:number;
  modeOfPayment:string;
  paymentCycleID:number;
  paymentCycle:string;
  referenceNote:string;
  activationStatus:boolean;
  constructor(supplierContract) {
    {
       this.supplierContractID = supplierContract.supplierContractID || -1;
       this.supplierContractName=supplierContract.supplierContractName || '';
       this.supplierRateCardID = supplierContract.supplierRateCardID || '';
       this.copiedFromPreviousContractID = supplierContract.copiedFromPreviousContractID || '';
       this.copiedFromPreviousContractName = supplierContract.copiedFromPreviousContractName || 'N/A';
       this.validFromString = supplierContract.validFromString || '';
       this.validToString = supplierContract.validToString || '';
       this.negotiatedByID = supplierContract.negotiatedByID || '';
       this.approvedByID = supplierContract.approvedByID || '';
       this.gstParking = supplierContract.gstParking || '';
       this.modeOfPaymentID = supplierContract.modeOfPaymentID || null;
       this.paymentCycleID = supplierContract.paymentCycleID || '';
       this.referenceNote = supplierContract.referenceNote || '';
       this.activationStatus = supplierContract.activationStatus || '';
       this.validFrom=new Date();
       this.validTo=new Date();
    }
  }
  
}

