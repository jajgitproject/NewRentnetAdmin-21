// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContractMapping } from './customerContractMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContractMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContractMapping";
  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerContractMapping:string,SearchEmployeeName:string, customerContractID:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerContractMapping==="")
    {
      SearchCustomerContractMapping="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(customerContractID==="")
    {
      customerContractID="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    //console.log(this.API_URL + '/'+CustomerID +'/'+SearchCustomerContractMapping  + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerContractMappingID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerContractMapping + '/' + SearchEmployeeName + '/' + customerContractID+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerContractMappingID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerContractMapping:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerContractMapping==="")
    {
      SearchCustomerContractMapping="null";
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
    //console.log(this.API_URL + "/kkk" +SearchCustomerContractMapping + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerContractMapping  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerContractMapping) 
  {
     
    advanceTable.customerContractMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContractMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerContractMappingid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContractMappingid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }

  GetDateBasedOnEndDate(customerID:number,endDate: any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/' + 'getNextDateBasedOnPreviousDate' + '/' + customerID + '/'+ endDate);
  }

  GetLastDateOfCustomer(customerID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/' + 'getLastDateOfCustomer' + '/' + customerID);
  }
}
