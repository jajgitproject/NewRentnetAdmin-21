// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryInsurance } from './inventoryInsurance.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InventoryInsuranceService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventoryInsurance";
  }
  /** CRUD METHODS */
  getTableData(InventoryInsuranceID:number,InventoryID:number,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }

    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +InventoryInsuranceID + '/'+InventoryID + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InventoryInsuranceID/Ascending');
  }
  getTableDataSort(InventoryInsuranceID:number,InventoryID:number,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +InventoryInsuranceID + '/'+InventoryID + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: InventoryInsurance) 
  {
    advanceTable.inventoryInsuranceID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.insuranceStartDateString=this.generalService.getTimeApplicable(advanceTable.insuranceStartDate);
    advanceTable.insuranceEndDateString=this.generalService.getTimeApplicableTO(advanceTable.insuranceEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InventoryInsurance)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.insuranceStartDateString=this.generalService.getTimeApplicable(advanceTable.insuranceStartDate);
    advanceTable.insuranceEndDateString=this.generalService.getTimeApplicableTO(advanceTable.insuranceEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(inventoryInsuranceID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ inventoryInsuranceID + '/' + userID);
  }
}
