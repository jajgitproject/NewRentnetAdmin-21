// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerQCModel } from './customerQC.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerQCService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerQC";
  }

  /** CRUD METHODS */
  getTableData(CustomerID:number,SearchIsQCRequired:boolean,SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchIsQCRequired === null)
    {
      SearchIsQCRequired = null;
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + CustomerID + "/" + SearchIsQCRequired + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerQCID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchIsQCRequired:boolean,SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchIsQCRequired === null)
    {
      SearchIsQCRequired = null;
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + CustomerID + "/" +SearchIsQCRequired + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerQCModel) 
  {
    advanceTable.customerQCID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString = this.generalService.getTimeApplicableTO(advanceTable.startDate);
    advanceTable.endDateString = advanceTable.endDate ? this.generalService.getTimeApplicableTO(advanceTable.endDate) : '';
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: CustomerQCModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString = this.generalService.getTimeApplicableTO(advanceTable.startDate);
    advanceTable.endDateString = advanceTable.endDate ? this.generalService.getTimeApplicableTO(advanceTable.endDate) : '';
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(customerQCID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerQCID + '/'+ userID);
  }

}
  

