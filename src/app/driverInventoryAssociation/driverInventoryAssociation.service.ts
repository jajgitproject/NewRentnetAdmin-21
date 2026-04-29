// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverInventoryAssociation } from './driverInventoryAssociation.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverInventoryAssociationService {
  private API_URL: string = '';
  private API_URL_Driver: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL_Driver = generalService.BaseURL + "driver";
    this.API_URL = generalService.BaseURL + "driverInventoryAssociation";
  }
  /** CRUD METHODS */
  getDriverInventoryData(driverID: number, searchDriverName: string, vehicleID: number, searchVehicle: string, searchInventoryName: string, searchVehicleCategory: string, searchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (driverID === 0) {
      driverID = 0;
    }
    if (searchDriverName === "") {
      searchDriverName = "null";
    }
    if (vehicleID === 0) {
      vehicleID = 0;
    }
    if (searchVehicle === "") {
      searchVehicle = "null";
    }
    if (searchInventoryName === "") {
      searchInventoryName = "null";
    }
    if (searchVehicleCategory === "") {
      searchVehicleCategory = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/GetCompleteDriverInventoryAssociation' + "/" + driverID + "/" + searchDriverName + "/" + vehicleID + "/" + searchVehicle + "/" + searchInventoryName + "/" + searchVehicleCategory + '/' + searchActivationStatus + '/' + PageNumber + '/driverInventoryAssociationID/Descending');
  }

  getTableDataByDriver(driverID: number, searchDriverName: string, eTRAvailabilityDate: string, eTRAvailabilityTime: string, eTRAvailabilityGeoLocation: string, searchInventoryName: string, pickupDate: string, searchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (driverID === 0) {
      driverID = 0;
    }
    if (searchDriverName === "") {
      searchDriverName = "null";
    }
    if (eTRAvailabilityDate === "") {
      eTRAvailabilityDate = "null";
    }
    if (eTRAvailabilityTime === "") {
      eTRAvailabilityTime = "null";
    }
    if (eTRAvailabilityGeoLocation === "") {
      eTRAvailabilityGeoLocation = "null";
    }
    if (searchInventoryName === "") {
      searchInventoryName = "null";
    }
    if (pickupDate === "") {
      pickupDate = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/GetAllSearchDriver' + "/" + driverID + "/" + searchDriverName + "/" + eTRAvailabilityDate + '/' + eTRAvailabilityTime + '/' + eTRAvailabilityGeoLocation + '/' + searchInventoryName + "/" + pickupDate + '/' + searchActivationStatus + '/' + PageNumber + '/driverInventoryAssociationID/Ascending');
  }

  getTableData(servicelocationID: any, driverID: number, searchDriverName: string, DOIN: string, supplierName: string, searchCategory: string, searchVehicle: string, searchRegistration: string, searchInventoryName: string, SearchVendorType: string, SearchOwnedSupplier: string, SearchBookingCount: string, SearchMonthlyTarget: string, SearchOtherCriteria: string, pickupDate: string, searchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (driverID === 0) {
      driverID = 0;
    }
    if (searchDriverName === "") {
      searchDriverName = "null";
    }
    if (DOIN === "") {
      DOIN = "null";
    }
    if (supplierName === "") {
      supplierName = "null";
    }
    if (searchCategory === "") {
      searchCategory = "null";
    }
    if (searchVehicle === "") {
      searchVehicle = "null";
    }
    if (searchRegistration === "") {
      searchRegistration = "null";
    }
    if (searchInventoryName === "") {
      searchInventoryName = "null";
    }
    if (SearchVendorType === "") {
      SearchVendorType = "null";
    }
    if (SearchOwnedSupplier === "") {
      SearchOwnedSupplier = "null";
    }
    if (SearchBookingCount === "") {
      SearchBookingCount = "null";
    }
    if (SearchMonthlyTarget === "") {
      SearchMonthlyTarget = "null";
    }
    if (SearchOtherCriteria === "") {
      SearchOtherCriteria = "null";
    }
    if (pickupDate === "") {
      pickupDate = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + servicelocationID + "/" + driverID + "/" + searchDriverName + "/" + DOIN + "/" + supplierName + "/" + searchCategory + "/" + searchVehicle + "/" + searchRegistration + "/" + searchInventoryName + '/' + SearchVendorType + '/' + SearchOwnedSupplier + '/' + SearchBookingCount + '/' + SearchMonthlyTarget + '/' + SearchOtherCriteria + "/" + pickupDate + '/' + searchActivationStatus + '/' + PageNumber + '/driverInventoryAssociationID/Ascending');
  }

  getDataInventoryUnassociation(servicelocationID: any, DOIN: string, supplierName: string, searchCategory: string, searchVehicle: string, searchRegistration: string, searchInventoryName: string, SearchVendorType: string, SearchOwnedSupplier: string, SearchBookingCount: string, SearchMonthlyTarget: string, SearchOtherCriteria: string, pickupDate: string, searchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (DOIN === "") {
      DOIN = "null";
    }
    if (supplierName === "") {
      supplierName = "null";
    }
    if (searchCategory === "") {
      searchCategory = "null";
    }
    if (searchVehicle === "") {
      searchVehicle = "null";
    }
    if (searchRegistration === "") {
      searchRegistration = "null";
    }
    if (searchInventoryName === "") {
      searchInventoryName = "null";
    }
    if (SearchVendorType === "") {
      SearchVendorType = "null";
    }
    if (SearchOwnedSupplier === "") {
      SearchOwnedSupplier = "null";
    }
    if (SearchBookingCount === "") {
      SearchBookingCount = "null";
    }
    if (SearchMonthlyTarget === "") {
      SearchMonthlyTarget = "null";
    }
    if (SearchOtherCriteria === "") {
      SearchOtherCriteria = "null";
    }
    if (pickupDate === "") {
      pickupDate = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + 'SearchForDriverInventoryUnassociation' + "/" + servicelocationID + "/" + DOIN + "/" + supplierName + "/" + searchCategory + "/" + searchVehicle + "/" + searchRegistration + "/" + searchInventoryName + '/' + SearchVendorType + '/' + SearchOwnedSupplier + '/' + SearchBookingCount + '/' + SearchMonthlyTarget + '/' + SearchOtherCriteria + "/" + pickupDate + '/' + searchActivationStatus + '/' + PageNumber + '/driverInventoryAssociationID/Ascending');
  }

  getTableDataSort(driverID: number, searchDriverName: string, searchVehicle: string, searchInventoryName: string, searchVehicleCategory: string, searchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (driverID === 0) {
      driverID = 0;
    }
    if (searchDriverName === "") {
      searchDriverName = "null";
    }
    if (searchVehicle === "") {
      searchVehicle = "null";
    }
    if (searchInventoryName === "") {
      searchInventoryName = "null";
    }
    if (searchVehicleCategory === "") {
      searchVehicleCategory = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/GetCompleteDriverInventoryAssociation' + "/" + driverID + "/" + searchDriverName + "/" + searchVehicle + "/" + searchInventoryName + "/" + searchVehicleCategory + '/' + searchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
    //return this.httpClient.get(this.API_URL +"/"+driverID+ "/" +searchDriverName + '/'+searchInventoryName + '/'+ searchActivationStatus +'/' + PageNumber +'/'+coloumName+ '/' + sortType);
  }
  add(advanceTable: DriverInventoryAssociation) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.driverInventoryAssociationID = -1;
    advanceTable.driverInventoryAssociationStartDateString = this.generalService.getTimeApplicable(advanceTable.driverInventoryAssociationStartDate);
    if (advanceTable.driverInventoryAssociationEndDate) {
      advanceTable.driverInventoryAssociationEndDateString = this.generalService.getTimeApplicable(advanceTable.driverInventoryAssociationEndDate);
    }
    else {
      advanceTable.driverInventoryAssociationEndDate = null;
    }
    advanceTable.activationStatus = true;
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }
  update(advanceTable: DriverInventoryAssociation) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.activationStatus = true;
    advanceTable.driverInventoryAssociationStartDateString = this.generalService.getTimeApplicable(advanceTable.driverInventoryAssociationStartDate);
    if (advanceTable.driverInventoryAssociationEndDate) {
      advanceTable.driverInventoryAssociationEndDateString = this.generalService.getTimeApplicable(advanceTable.driverInventoryAssociationEndDate);
    }
    else {
      advanceTable.driverInventoryAssociationEndDate = null;
    }
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }
  delete(driverInventoryAssociationID: number): Observable<any> {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + driverInventoryAssociationID + '/' + userID);
  }

  getDriverList(supplierID: number, type: any, prefix: string): Observable<any> {
    return this.httpClient.get(this.API_URL_Driver + '/GetDriverList' + "/" + supplierID + "/" + type + "/" + prefix);
  }
  getDriverSupplierID(driverID: number) {
    return this.httpClient.get(this.API_URL + '/GetDriverSupplierID' + "/" + driverID);
  }

  getInventorySupplierID(inventoryID: number) {
    return this.httpClient.get(this.API_URL + '/GetInventorySupplierID' + "/" + inventoryID);
  }
}



