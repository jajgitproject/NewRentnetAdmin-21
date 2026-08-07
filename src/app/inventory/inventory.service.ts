// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inventory } from './inventory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InventoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventory";
  }

  private pathSegment(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return encodeURIComponent(String(value));
  }

  /** CRUD METHODS */
  getTableData( RegistrationNumber:string,
    InventoryID:number,
    SearchVehcileCategory:string,
    SearchVehicle:string,
    SearchSupplier:string,
    searchLocationHub:string,
    SearchActivationStatus:string, 
    PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(
      this.API_URL + "/" + this.pathSegment(RegistrationNumber) + "/" + (InventoryID || 0) + '/' +
      this.pathSegment(SearchVehcileCategory) + '/' + this.pathSegment(SearchVehicle) + '/' +
      this.pathSegment(SearchSupplier) + '/' + this.pathSegment(searchLocationHub) + '/' +
      this.pathSegment(SearchActivationStatus) + '/' + PageNumber + '/InventoryID/Ascending'
    );
  }
  getTableDataSort(
    RegistrationNumber:string,InventoryID:number, 
    SearchVehcileCategory:string,
    SearchVehicle:string,
    SearchSupplier:string,
    searchLocationHub:string,
    SearchActivationStatus:string, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    return this.httpClient.get(
      this.API_URL + "/" + this.pathSegment(RegistrationNumber) + "/" + (InventoryID || 0) + '/' +
      this.pathSegment(SearchVehcileCategory) + '/' + this.pathSegment(SearchVehicle) + '/' +
      this.pathSegment(SearchSupplier) + '/' + this.pathSegment(searchLocationHub) + '/' +
      this.pathSegment(SearchActivationStatus) + '/' + PageNumber + '/' + coloumName + '/' + sortType
    );
  }
  downloadCsv(
    RegistrationNumber:string,InventoryID:number,
    SearchVehcileCategory:string,
    SearchVehicle:string,
    SearchSupplier:string,
    searchLocationHub:string,
    SearchActivationStatus:string): Observable<Blob>
  {
    return this.httpClient.get(
      this.API_URL + "/export/" + this.pathSegment(RegistrationNumber) + "/" + (InventoryID || 0) + '/' +
      this.pathSegment(SearchVehcileCategory) + '/' + this.pathSegment(SearchVehicle) + '/' +
      this.pathSegment(SearchSupplier) + '/' + this.pathSegment(searchLocationHub) + '/' +
      this.pathSegment(SearchActivationStatus),
      { responseType: 'blob' }
    );
  }
  add(advanceTable: Inventory) 
  {
    advanceTable.inventoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.inventoryCreatedBy=this.generalService.getUserID();
    advanceTable.registrationNumber = String(advanceTable.registrationNumber || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    advanceTable.fuelCardNo = advanceTable.fuelCardNo ?? advanceTable.FuelCardNo ?? '';
    if(advanceTable.isGPSAvailable){
      advanceTable.isGPSAvailable=true;
    }
    else{
     advanceTable.isGPSAvailable=false;
    }
    advanceTable.registrationFromDateString=this.generalService.getTimeApplicable(advanceTable.registrationFromDate);
    advanceTable.registrationTillDateString=this.generalService.getTimeApplicableTO(advanceTable.registrationTillDate);
    advanceTable.purchaseDateString=this.generalService.getTimeApplicable(advanceTable.purchaseDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Inventory)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.inventoryCreatedBy=this.generalService.getUserID();
    advanceTable.registrationNumber = String(advanceTable.registrationNumber || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
    advanceTable.fuelCardNo = advanceTable.fuelCardNo ?? advanceTable.FuelCardNo ?? '';
    advanceTable.registrationFromDateString=this.generalService.getTimeApplicable(advanceTable.registrationFromDate);
    advanceTable.registrationTillDateString=this.generalService.getTimeApplicableTO(advanceTable.registrationTillDate);
    advanceTable.purchaseDateString=this.generalService.getTimeApplicable(advanceTable.purchaseDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(inventoryID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ inventoryID + '/' + userID);
  }
  checkRegistrationNumberDuplicate(registrationNumber: string, excludeInventoryID: number): Observable<boolean>
  {
    const regNo = encodeURIComponent(registrationNumber || '');
    return this.httpClient.get<boolean>(this.API_URL + '/CheckRegistrationNumberDuplicate/' + regNo + '/' + (excludeInventoryID || 0));
  }
}
