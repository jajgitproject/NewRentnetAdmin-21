// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CarPaidTaxMIS } from './carPaidTaxMIS.model';
@Injectable()
export class CarPaidTaxMISService 
{
  private API_URL:string = '';
  private VehicleInterStateTAX_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "carPaidTaxMIS";
   
  }
  /** CRUD METHODS */
  getTableData(RegistrationNumber:string,VehicleCategory:string,Vehicle:string,State:string,StartDate:string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(RegistrationNumber==="")
    {
      RegistrationNumber="null";
    }
    if(VehicleCategory==="")
      {
        VehicleCategory="null";
      }
      if(Vehicle==="")
        {
          Vehicle="null";
        }
    if(State==="")
    {
      State="null";
    }
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
    return this.httpClient.get(this.API_URL + "/" +RegistrationNumber+ "/" +VehicleCategory+ "/" +Vehicle+ "/" +State+ "/" +StartDate+ "/" +EndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InterstateTaxID/Ascending');
  }
  getTableDataSort(RegistrationNumber:string,VehicleCategory:string,Vehicle:string, State:string,StartDate:string,EndDate:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(RegistrationNumber==="")
    {
      RegistrationNumber="null";
    }
    if(VehicleCategory==="")
      {
        VehicleCategory="null";
      }
      if(Vehicle==="")
        {
          Vehicle="null";
        }
    if(State==="")
    {
      State="null";
    }
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
    //console.log(this.API_URL + "/" +RegistrationNumber + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +RegistrationNumber+ "/" +VehicleCategory+ "/" +Vehicle+ "/" +State+ "/" +StartDate+ "/" +EndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  // add(advanceTable: CarPaidTaxMIS) 
  // {
  //   advanceTable.interstateTaxID=-1;
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  // update(advanceTable: CarPaidTaxMIS)
  // { 
  //   advanceTable.userID=this.generalService.getUserID();
  //   advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
  //   advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
  //   advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
  //   advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn); 
  //   return this.httpClient.put<any>(this.API_URL , advanceTable);
  // }
  // delete(interstateTaxID: number):  Observable<any> 
  // {
  //   let userID=this.generalService.getUserID();
  //   return this.httpClient.delete(this.API_URL + '/'+ interstateTaxID + '/' + userID);
  // }

}
  

