// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VehicleInterStateTax } from './vehicleInterStateTax.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class VehicleInterStateTaxService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vehicleInterStateTax";
  }
  /** CRUD METHODS */
  getTableData(InventoryInterStateTaxID:number,RegistrationNumber:string,State:string,InventoryID:number,StateID:number,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
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
    return this.httpClient.get(this.API_URL + "/" +InventoryInterStateTaxID + '/'+RegistrationNumber+ '/'+State + '/'+InventoryID+ '/'+StateID + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InventoryInterStateTaxID/Ascending');
  }
  getTableDataSort(InventoryInterStateTaxID:number,InventoryID:number,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
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
    return this.httpClient.get(this.API_URL + "/" +InventoryInterStateTaxID + '/'+InventoryID + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: VehicleInterStateTax) 
  {
    advanceTable.inventoryInterStateTaxID=-1;
    advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
    advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VehicleInterStateTax)
  {
    advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
    advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(inventoryInterStateTaxID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ inventoryInterStateTaxID);
  }
}
