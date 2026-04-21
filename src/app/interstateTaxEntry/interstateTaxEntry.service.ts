// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InterstateTaxEntry } from './interstateTaxEntry.model';
@Injectable()
export class InterstateTaxEntryService 
{
  private API_URL:string = '';
  private VehicleInterStateTAX_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "interstateTaxEntry";
    this.VehicleInterStateTAX_API_URL=generalService.BaseURL+ "vehicleInterstateTax";
  }
  /** CRUD METHODS */
  getTableData(RegistrationNumber:string,State:string,StartDate:string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(RegistrationNumber==="")
    {
      RegistrationNumber="null";
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
    return this.httpClient.get(this.API_URL + "/" +RegistrationNumber+ "/" +State+ "/" +StartDate+ "/" +EndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InterstateTaxID/Ascending');
  }
  getTableDataSort(RegistrationNumber:string, State:string,StartDate:string,EndDate:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(RegistrationNumber==="")
    {
      RegistrationNumber="null";
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
    return this.httpClient.get(this.API_URL + "/" +RegistrationNumber+ "/" +State+ "/" +StartDate+ "/" +EndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InterstateTaxEntry) 
  {
    advanceTable.interstateTaxID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
    advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
    advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
    advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InterstateTaxEntry)
  { 
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.interStateTaxStartDateString=this.generalService.getTimeApplicable(advanceTable.interStateTaxStartDate);
    advanceTable.interStateTaxEndDateString=this.generalService.getTimeApplicableTO(advanceTable.interStateTaxEndDate);
    advanceTable.paidOnString=this.generalService.getTimeApplicable(advanceTable.paidOn);
    advanceTable.uploadedOnString=this.generalService.getTimeApplicableTO(advanceTable.uploadedOn); 
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(interstateTaxID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ interstateTaxID + '/' + userID);
  }

  getTaxDetails(RegistrationNumber:string, StateID:number, StartDate: string,EndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.VehicleInterStateTAX_API_URL + "/" +RegistrationNumber + '/' + StateID +'/' + StartDate + '/' + EndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InventoryInterStateTaxID/Ascending' );
  }

}
  

