// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeSaleForCustomers} from './changeSaleForCustomers.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ChangeSaleForCustomersService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerSalesManagerChange";
    //this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData(SearchCustomerSalesManager:string,SearchEmployeeName:string,SearchFromDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
  if(SearchCustomerSalesManager==="")
    {
      SearchCustomerSalesManager="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
     if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
     if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
 
    
   
    //console.log(this.API_URL + '/'+CustomerID +'/'+SearchnewSalesManagerActivationFromDate  + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/changeSaleForCustomersID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+SearchCustomerSalesManager +'/'+SearchEmployeeName +'/' + SearchFromDate +'/' + SearchActivationStatus +'/' + PageNumber + '/salesManagerUpdateID/Ascending');
  }

  getTableDataSort(SearchCustomerSalesManager:string,SearchEmployeeName:string,SearchFromDate:string, SearchnewSalesManagerActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
     if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
    if(SearchnewSalesManagerActivationStatus===null)
    {
      SearchnewSalesManagerActivationStatus=null;
    }
 
    //console.log(this.API_URL + "/kkk" +SearchChangeSaleForCustomers  + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+SearchCustomerSalesManager +'/'+SearchEmployeeName +'/' + SearchFromDate +'/' + SearchnewSalesManagerActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ChangeSaleForCustomers ) 
  {
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.customerSalesManagerID=-1;
    advanceTable.newSalesManagerActivationFromDateString=this.generalService.getTimeApplicable(advanceTable.newSalesManagerActivationFromDate);
   // advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ChangeSaleForCustomers )
  {
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.newSalesManagerActivationFromDateString=this.generalService.getTimeApplicable(advanceTable.newSalesManagerActivationFromDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(changeSaleForCustomersid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ changeSaleForCustomersid+ '/'+ userID);
  }
  // GetEmployeeData(employeeID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  // }
}
