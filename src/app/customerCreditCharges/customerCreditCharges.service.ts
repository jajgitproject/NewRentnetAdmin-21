// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerCreditChargesModel } from './customerCreditCharges.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerCreditChargesService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCreditCharges";
  }

  /** CRUD METHODS */
  getTableData(customerID:number,SearchCustomerCreditCharges:string, SearchIGSTPercentage:string, SearchCGSTPercentage:string, SearchSGStPercentage:string, SearchCessPercentage:string, SearchStartDate:string, SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    if(SearchCustomerCreditCharges === "")
    {
      SearchCustomerCreditCharges = null;
    }
    if(SearchIGSTPercentage === "")
    {
      SearchIGSTPercentage = null;
    }
    if(SearchCGSTPercentage === "")
    {
      SearchCGSTPercentage = null;
    }
    if(SearchSGStPercentage === "")
    {
      SearchSGStPercentage = null;
    }
    if(SearchCessPercentage === "")
    {
      SearchCessPercentage = null;
    }
    if(SearchStartDate === "")
    {
      SearchStartDate = null;
    }
    if(SearchEndDate === "")
    {
      SearchEndDate = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL +"/" + customerID +  '/' + SearchCustomerCreditCharges + '/' + SearchIGSTPercentage + '/' + SearchCGSTPercentage + '/' + SearchSGStPercentage + '/' + SearchCessPercentage + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/customerCreditCardCharges/Ascending');
  }

  getTableDataSort(customerID:number,SearchCustomerCreditCharges:string, SearchIGSTPercentage:string, SearchCGSTPercentage:string, SearchSGStPercentage:string, SearchCessPercentage:string, SearchStartDate:string, SearchEndDate:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCustomerCreditCharges === "")
    {
      SearchCustomerCreditCharges = "null";
    }
    if(SearchIGSTPercentage === "")
    {
      SearchIGSTPercentage = null;
    }
    if(SearchCGSTPercentage === "")
    {
      SearchCGSTPercentage = null;
    }
    if(SearchSGStPercentage === "")
    {
      SearchSGStPercentage = null;
    }
    if(SearchCessPercentage === "")
    {
      SearchCessPercentage = null;
    }
    if(SearchStartDate === "")
    {
      SearchStartDate = null;
    }
    if(SearchEndDate === "")
    {
      SearchEndDate = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + customerID +  '/' + SearchCustomerCreditCharges + '/'+ SearchIGSTPercentage + '/' + SearchCGSTPercentage + '/' + SearchSGStPercentage + '/' + SearchCessPercentage + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerCreditChargesModel) 
  {
    advanceTable.customerCreditCardChargesID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerCreditCardChargesStartDateString=this.generalService.getTimeApplicable(advanceTable.customerCreditCardChargesStartDate);
    advanceTable.customerCreditCardChargesEndDateString=this.generalService.getTimeApplicable(advanceTable.customerCreditCardChargesEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: CustomerCreditChargesModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerCreditCardChargesStartDateString=this.generalService.getTimeApplicable(advanceTable.customerCreditCardChargesStartDate);
    advanceTable.customerCreditCardChargesEndDateString=this.generalService.getTimeApplicable(advanceTable.customerCreditCardChargesEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(customerCreditCardChargesID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerCreditCardChargesID+ '/'+ userID);
  }

}
  

