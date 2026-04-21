// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerPersonApprover } from './customerPersonApprover.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerPersonModels } from '../customerCorporateIndividual/customerCorporateIndividual.model';
@Injectable()
export class CustomerPersonApproverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerPersonApprover";
  }
  /** CRUD METHODS */
  getTableData(searchCustomerName:string,CustomerPersonID:number,searchStartDate:string,searchEndDate:string, searchcustomerPersonApproverStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
     if(searchStartDate==="")
    {
      searchStartDate="null";
    }
     if(searchEndDate==="")
    {
      searchEndDate="null";
    }
  
    if(searchcustomerPersonApproverStatus===null)
    {
      searchcustomerPersonApproverStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+CustomerPersonID + '/' + searchStartDate + '/' + searchEndDate + '/' + searchcustomerPersonApproverStatus +'/' + PageNumber + '/customerPersonApproverID/Ascending');
  }
  getTableDataSort(searchCustomerName:string,CustomerPersonID:number, searchStartDate:string, searchEndDate:string, searchcustomerPersonApproverStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
     if(searchStartDate==="")
    {
      searchStartDate="null";
    }
     if(searchEndDate==="")
    {
      searchEndDate="null";
    }

    if(searchcustomerPersonApproverStatus===null)
    {
      searchcustomerPersonApproverStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +searchCustomerName + '/'+CustomerPersonID + '/' + searchStartDate + '/' + searchEndDate + '/' + searchcustomerPersonApproverStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerPersonApprover) 
  {
    advanceTable.userID=this.generalService.getUserID();
     advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    advanceTable.customerPersonApproverID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerPersonApprover)
  {
    advanceTable.userID=this.generalService.getUserID();
         advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerPersonApproverID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerPersonApproverID + '/'+ userID);
  }
    getCustomerPersonForApproval(customerGroupID:number): Observable<CustomerPersonModels[]> {
      return this.httpClient.get<CustomerPersonModels[]>(this.API_URL + "/getCustomerForApproval/"+customerGroupID);
  
    }
}
