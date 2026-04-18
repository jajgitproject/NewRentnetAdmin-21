// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerCredit } from './customerCredit.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerCreditService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCredit";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData(CustomerContractMappingID:number,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    //console.log(this.API_URL + '/'+CustomerContractMappingID + '/' + SearchEmployeeName +'/' + SearchActivationStatus +'/' + PageNumber + '/customerCreditID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+CustomerContractMappingID + '/' + SearchEmployeeName +'/' + SearchStartDate +'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerCreditID/Ascending');
  }

  getTableDataSort(CustomerContractMappingID:number,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string,  SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    //console.log(this.API_URL + "/kkk" +SearchCustomerCredit + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+CustomerContractMappingID + '/' + SearchEmployeeName +'/' + SearchStartDate +'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerCredit) 
  {
     
    advanceTable.customerCreditID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerCreditStartDateString=this.generalService.getTimeApplicable(advanceTable.customerCreditStartDate);
    advanceTable.customerCreditEndDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreditEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerCredit)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerCreditStartDateString=this.generalService.getTimeApplicable(advanceTable.customerCreditStartDate);
    advanceTable.customerCreditEndDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreditEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerCreditid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerCreditid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
