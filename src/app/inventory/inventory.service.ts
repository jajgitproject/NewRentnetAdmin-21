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
    if(RegistrationNumber==="")
      {
        RegistrationNumber="null";
      }
    if(InventoryID===0)
    {
      InventoryID=0;
    }

    if(SearchVehcileCategory==="")
    {
      SearchVehcileCategory="null";
    }

    if(SearchVehicle==="")
    {
      SearchVehicle="null";
    }

    if(SearchSupplier==="")
    {
      SearchSupplier="null";
    }
    if(searchLocationHub==="")
    {
      searchLocationHub="null";
    }

    if(SearchActivationStatus==="")
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" + RegistrationNumber + "/" + InventoryID + '/'+ SearchVehcileCategory + '/'+ SearchVehicle + '/'+ SearchSupplier + '/'+ searchLocationHub + '/' + SearchActivationStatus +'/' + PageNumber + '/InventoryID/Ascending');
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
    if(RegistrationNumber==="")
      {
        RegistrationNumber="null";
      }
    if(InventoryID===0)
    {
      InventoryID=0;
    }
    if(SearchVehcileCategory==="")
    {
      SearchVehcileCategory="null";
    }

    if(SearchVehicle==="")
    {
      SearchVehicle="null";
    }

    if(SearchSupplier==="")
    {
      SearchSupplier="null";
    }
     if(searchLocationHub==="")
    {
      searchLocationHub="null";
    }
    if(SearchActivationStatus==="")
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/"+ RegistrationNumber + "/" + InventoryID + '/'+ SearchVehcileCategory + '/'+ SearchVehicle + '/'+ SearchSupplier + '/' + searchLocationHub + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Inventory) 
  {
    advanceTable.inventoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.inventoryCreatedBy=this.generalService.getUserID();
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
}
