// @ts-nocheck
import { formatDate } from '@angular/common';
export class Fleet {
  reservationID: number;
  vehicleCategoryID: number;
  vehicleCategory: string;
  location: string;
  serviceLocationID: number;
  city: string;
  geoPointID: number;
  pickupDate: Date | null;
  pickupTime: Date | null;
  pickupDateString: string;
  pickupTimeString: string;
  activationStatus: boolean | null;

  // Additional fields based on the FleetModel class
  stateName: string;
  country: string;
  supplierCreatedByEmployeeName: string;
  supplierTypeID: number;
  dutySlipNo: string;
  dutyType: string;
  packages: string;
  vehicle: string;
  vehicleSupplier: string;
  currentChauffeur: string;
registrationNumber:string;
  driver: string;
  driverName: string;
  mobile: string;
  allotmentStatus: string;
  pickCity: string;
  pickAddress: string;
  dropOffDate: Date | null;
  dropOffTime: Date | null;
  dropOffCity: string;
  dropOffAddress: string;

  constructor(fleet: any) {
    this.reservationID = fleet.reservationID || 0;
    this.vehicleCategoryID = fleet.vehicleCategoryID || 0;
    this.vehicleCategory = fleet.vehicleCategory || '';
    this.location = fleet.location || '';
    this.serviceLocationID = fleet.serviceLocationID || 0;
    this.city = fleet.city || '';
    this.geoPointID = fleet.geoPointID || 0;
    this.pickupDate = fleet.pickupDate ? new Date(fleet.pickupDate) : null;
    this.pickupTime = fleet.pickupTime ? new Date(fleet.pickupTime) : null;
    this.pickupDateString = this.pickupDate ? this.pickupDate.toISOString().split('T')[0] : '';
    this.pickupTimeString = this.pickupTime ? this.pickupTime.toISOString().split('T')[1].split('.')[0] : '';
    this.activationStatus = fleet.activationStatus !== undefined ? fleet.activationStatus : null;

    // Additional fields
    this.stateName = fleet.stateName || '';
    this.country = fleet.country || '';
    this.supplierCreatedByEmployeeName = fleet.supplierCreatedByEmployeeName || '';
    this.supplierTypeID = fleet.supplierTypeID || 0;
    this.registrationNumber = fleet.registrationNumber || '';
    this.dutySlipNo = fleet.dutySlipNo || '';
    this.dutyType = fleet.dutyType || '';
    this.packages = fleet.packages || '';
    this.vehicle = fleet.vehicle || '';
    this.vehicleSupplier = fleet.vehicleSupplier || '';
    this.currentChauffeur = fleet.currentChauffeur || '';
    this.driver = fleet.driver || '';
    this.mobile = fleet.mobile || '';
    this.allotmentStatus = fleet.allotmentStatus || '';
    this.pickCity = fleet.pickCity || '';
    this.pickAddress = fleet.pickAddress || '';
    this.dropOffDate = fleet.dropOffDate ? new Date(fleet.dropOffDate) : null;
    this.dropOffTime = fleet.dropOffTime ? new Date(fleet.dropOffTime) : null;
    this.dropOffCity = fleet.dropOffCity || '';
    this.dropOffAddress = fleet.dropOffAddress || '';
  }
}


