// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { SetAsCustomerKAM } from './setAsCustomerKAM.model';
@Injectable()
export class SetAsCustomerKAMService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "setAsCustomerKAM";
  }
  /** CRUD METHODS */
  getTableData(employeeID:number,
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + employeeID + "/" +searchCustomerName + '/'+searchCustomerType+ '/'+searchcustomerGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }
  getTableDataSort(employeeID:number,
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + employeeID + "/" +searchCustomerName + '/'+searchCustomerType + '/'+searchcustomerGroup + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
addList(advanceTableList: SetAsCustomerKAM[]) {

  advanceTableList.forEach(element => {

    element.cityID = 0;
    element.userID = this.generalService.getUserID();
    element.customerKeyAccountManagerID = -1;

    if (element.endDate) {
      element.endDateString =
        this.generalService.getTimeApplicableTO(element.endDate);
    } else {
      element.endDate = null;
    }

    element.fromDateString =
      this.generalService.getTimeApplicable(element.fromDate);

  });

  return this.httpClient.post<any>(this.API_URL, advanceTableList);
}
  
  
}
