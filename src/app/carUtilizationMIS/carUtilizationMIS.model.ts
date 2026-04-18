// @ts-nocheck
import { formatDate } from '@angular/common';
export class CarUtilizationMIS {
  reservationID: number;
  bookingNo: string;
  dutySlipNo: string;
  registrationNumber: string;
  dutyDate: Date;
  openDate:Date;
  dispatchLocation: string;
  driverName: string;
  carLocation: string;
  carNo: string;
  vehicle: string;
  ownedSupplier: string;
  locationHubID: number;
  locationHub: string;
  customerName: string;
  customerID: number;
  dutySlipID: number;
  supplierName: string;
  supplierType: string;
  guestName: string;
  serviceLocation: string;
  
  organizationalEntityName: string;

  constructor(carUtilizationMIS: any) {
    this.reservationID = carUtilizationMIS.reservationID || 0;
    this.bookingNo = carUtilizationMIS.bookingNo || '';
    this.dutySlipNo = carUtilizationMIS.dutySlipNo || '';
    this.registrationNumber = carUtilizationMIS.registrationNumber || '';
    this.dutyDate = carUtilizationMIS.dutyDate ? new Date(carUtilizationMIS.dutyDate) : null;
    this.dispatchLocation = carUtilizationMIS.dispatchLocation || '';
    this.driverName = carUtilizationMIS.driverName || '';
    this.carLocation = carUtilizationMIS.carLocation || '';
    this.carNo = carUtilizationMIS.carNo || '';
    this.vehicle = carUtilizationMIS.vehicle || '';
    this.ownedSupplier = carUtilizationMIS.ownedSupplier || '';
    this.locationHubID = carUtilizationMIS.locationHubID || 0;
    this.locationHub = carUtilizationMIS.locationHub || '';
    this.customerName = carUtilizationMIS.customerName || '';
    this.customerID = carUtilizationMIS.customerID || 0;
    this.dutySlipID = carUtilizationMIS.dutySlipID || 0;
    this.supplierName = carUtilizationMIS.supplierName || '';
    this.supplierType = carUtilizationMIS.supplierType || '';
    this.guestName = carUtilizationMIS.guestName || '';
    this.serviceLocation = carUtilizationMIS.serviceLocation || '';
   
    this.organizationalEntityName = carUtilizationMIS.organizationalEntityName || '';
  }
}


