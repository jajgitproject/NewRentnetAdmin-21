// @ts-nocheck
import { formatDate } from '@angular/common';
export class GenerateBillMainModel {
  invoiceID:number;
  customerID: number;
  customer: string;
  stateID: number;
  state: string;
  cityID: number;
  city: string;
  pinCode:number;
  billingAddress:string;
  gst:boolean;
  ecoBillingBranchID:number;
  organizationalEntityID:number;
  organizationalEntityName:string;
  invoiceNarration:string;
  invoiceDateString:string;
  invoiceDate:Date;
  placeOfSupply:string;
  vehicleID:number;
  vehicle:string;
  dutyType:string;
  billFromDateString:string;
  billFromDate:Date;
  billToDateString:string;
  billToDate:Date;
  gstType:string;
  igstPercentageID:number;
  igstPercentage:string;
  csgstPercentageID:number;
  csgstPercentage:string;
  customerPersonNameID:number;
  customerPersonName:string;
  invoiceType:string;
  activationStatus: boolean;
  invoicePrefix:string;
  cgstPercentage:number;
  sgstPercentage:number;
  userID: number;
  invoiceTemplateID:number;
  monthID: number;
  monthName: string;
  passengerID:number;
  passengerName:string;
  invoiceNumberIssuedByID:number;

  constructor(generateBillMainModel) {
    {
      this.invoiceID = generateBillMainModel.invoiceID || -1;
      this.customerID = generateBillMainModel.customerID || '';
      this.invoiceTemplateID = generateBillMainModel.invoiceTemplateID || '';
      this.customer = generateBillMainModel.customer || '';
      this.stateID = generateBillMainModel.stateID || '';
      this.state = generateBillMainModel.state || '';
      this.cityID = generateBillMainModel.cityID || '';
      this.city = generateBillMainModel.city || '';
      this.monthName = generateBillMainModel.monthName || '';
      this.monthID = generateBillMainModel.monthID || '';
      this.pinCode = generateBillMainModel.pinCode || '';
      this.billingAddress = generateBillMainModel.billingAddress || '';
      this.gst = generateBillMainModel.gst || '';
      this.ecoBillingBranchID = generateBillMainModel.ecoBillingBranchID || '';
      this.organizationalEntityID = generateBillMainModel.organizationalEntityID || '';
      this.organizationalEntityName = generateBillMainModel.organizationalEntityName || '';
      this.invoiceNarration = generateBillMainModel.invoiceNarration || '';
      this.invoiceDateString = generateBillMainModel.invoiceDateString || '';
      this.placeOfSupply = generateBillMainModel.placeOfSupply || '';
      this.vehicleID = generateBillMainModel.vehicleID || '';
      this.vehicle = generateBillMainModel.vehicle || '';
      this.dutyType = generateBillMainModel.dutyType || '';
      this.billFromDateString = generateBillMainModel.billFromDateString || '';
      this.billToDateString = generateBillMainModel.billToDateString || '';
      this.gstType = generateBillMainModel.gstType || '';
      this.igstPercentageID = generateBillMainModel.igstPercentageID || '';
      this.igstPercentage = generateBillMainModel.igstPercentage || '';
      this.csgstPercentageID = generateBillMainModel.csgstPercentageID || '';
      this.csgstPercentage = generateBillMainModel.csgstPercentage || '';
      this.customerPersonNameID = generateBillMainModel.customerPersonNameID || '';
      this.customerPersonName = generateBillMainModel.customerPersonName || '';
      this.invoiceType = generateBillMainModel.invoiceType || '';
      this.activationStatus = generateBillMainModel.activationStatus || '';
      this.cgstPercentage = generateBillMainModel.cgstPercentage || '';
      this.sgstPercentage = generateBillMainModel.sgstPercentage || '';
      this.passengerID = generateBillMainModel.passengerID || '';
      this.passengerName = generateBillMainModel.passengerName || '';
      this.invoiceNumberIssuedByID = generateBillMainModel.invoiceNumberIssuedByID || '';
      
      this.invoiceDate = new Date();
      this.billFromDate = new Date();
      this.billToDate = new Date();
    }
  }
  
}

//------------- Model For IGST Percentage -------------
export class IGSTPercentageDropDown 
{
  igstPercentageID: number;
  igstPercentage: string;

  constructor(igSTPercentageDropDown) {
    {
      this.igstPercentageID = igSTPercentageDropDown.igstPercentageID || -1;
      this.igstPercentage = igSTPercentageDropDown.igstPercentage || '';
    }
  }
}

//------------- Model For CGST & SGST Percentage -------------
export class CSGSTPercentageDropDown 
{
  csgstPercentageID: number;
  csgstPercentage: string;

  constructor(csgSTPercentageDropDown) {
    {
      this.csgstPercentageID = csgSTPercentageDropDown.csgstPercentageID || -1;
      this.csgstPercentage = csgSTPercentageDropDown.csgstPercentage || '';
    }
  }
}


