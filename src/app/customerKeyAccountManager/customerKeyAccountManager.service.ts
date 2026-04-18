// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerKeyAccountManager } from './customerKeyAccountManager.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerKeyAccountManagerService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerKeyAccountManager";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerKeyAccountManager:string,SearchEmployeeName:string, SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchCustomerKeyAccountManager==="")
    {
      SearchCustomerKeyAccountManager="null";
    }
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
   
    if(SearchActivationStatus===null)
      {
        SearchActivationStatus=null;
      }
    //console.log(this.API_URL + '/'+CustomerID +'/'+SearchCustomerKeyAccountManager  + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerKeyAccountManagerID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerKeyAccountManager + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerKeyAccountManagerID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerKeyAccountManager:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerKeyAccountManager==="")
    {
      SearchCustomerKeyAccountManager="null";
    }
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
    if(SearchActivationStatus===null)
      {
        SearchActivationStatus=null;
      }
    //console.log(this.API_URL + "/kkk" +SearchCustomerKeyAccountManager + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerKeyAccountManager  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerKeyAccountManager) 
  {
    advanceTable.cityID=0; 
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.customerKeyAccountManagerID=-1;
    if(advanceTable.endDate)
      {
        advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
      }
      else
      {
        advanceTable.endDate=null;
      }
   
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
   // advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerKeyAccountManager)
  {
    advanceTable.cityID=0;
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    if(advanceTable.endDate)
      {
        advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
      }
      else
      {
        advanceTable.endDate=null;
      }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerKeyAccountManagerid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerKeyAccountManagerid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
