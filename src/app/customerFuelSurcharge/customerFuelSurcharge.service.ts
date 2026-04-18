// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerFuelSurcharge } from './customerFuelSurcharge.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerFuelSurchargeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerFuelSurcharge";
  }
  /** CRUD METHODS */
  getTableData(CustomerFuelSurchargeID:number,CustomerContractMappingID:number,StartDate:string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(StartDate==="")
    {
      StartDate="null";
    }
    if(EndDate==="")
    {
      EndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerFuelSurchargeID + '/'+CustomerContractMappingID + '/'+StartDate + '/'+EndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/customerFuelSurchargeID/Ascending');
  }
  getTableDataSort(CustomerFuelSurchargeID:number,CustomerContractMappingID:number,StartDate:string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(StartDate==="")
    {
      StartDate="null";
    }
    if(EndDate==="")
    {
      EndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerFuelSurchargeID + '/'+CustomerContractMappingID + '/'+StartDate + '/'+EndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerFuelSurcharge) 
  {
    advanceTable.customerFuelSurchargeID=-1;
    advanceTable.fuelSurchargePercentageStartDateString=this.generalService.getTimeApplicable(advanceTable.fuelSurchargePercentageStartDate);
    advanceTable.fuelSurchargePercentageEndDateString=this.generalService.getTimeApplicableTO(advanceTable.fuelSurchargePercentageEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerFuelSurcharge)
  {
    advanceTable.fuelSurchargePercentageStartDateString=this.generalService.getTimeApplicable(advanceTable.fuelSurchargePercentageStartDate);
    advanceTable.fuelSurchargePercentageEndDateString=this.generalService.getTimeApplicableTO(advanceTable.fuelSurchargePercentageEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerFuelSurchargeID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerFuelSurchargeID);
  }
}
