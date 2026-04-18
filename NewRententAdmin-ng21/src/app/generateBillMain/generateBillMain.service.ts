// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { GenerateBillMainModel } from './generateBillMain.model';
@Injectable()
export class GenerateBillMainService 
{
  private API_URL:string = '';
  private API_URL_GetData:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "InvoiceGeneral";
    this.API_URL_GetData=generalService.BaseURL+ "generalBill";
  }

  // Alternative method to get customer address from general customer API
  getCustomerAddressFromGeneral(customerID: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + "generalBillMain/ForCustomerBehalfDataDetails/" + customerID);
  }
  
  /** CRUD METHODS */
  getTableData(SearchCustomer:string, SearchInvoiceNumberWithPrefix:string,SearchGuset:string,SearchBillDate:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    if(SearchCustomer==="")
    {
      SearchCustomer=null;
    }
    if(SearchInvoiceNumberWithPrefix==="")
    {
      SearchInvoiceNumberWithPrefix=null;
    }
    if(SearchGuset==="")
    {
      SearchGuset=null;
    }
    if(SearchBillDate==="")
    {
      SearchBillDate=null;
    }
    if(SearchStartDate==="")
    {
      SearchStartDate=null;
    }
    if(SearchEndDate==="")
    {
      SearchEndDate=null;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    console.log(this.API_URL_GetData +"/GetAllGeneralBillMain" + "/" + SearchCustomer + '/'+ SearchInvoiceNumberWithPrefix + "/" + SearchGuset + "/" + SearchBillDate + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InvoiceID/Ascending');
    
    return this.httpClient.get(this.API_URL_GetData +"/GetAllGeneralBillMain" + "/" + SearchCustomer + '/'+ SearchInvoiceNumberWithPrefix + "/" + SearchGuset + "/" + SearchBillDate + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InvoiceID/Ascending');
  }
  getTableDataSort(SearchCustomer:string,SearchInvoiceNumberWithPrefix:string, SearchGuset:string,SearchBillDate:string,SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
   
    if(SearchCustomer==="")
    {
      SearchCustomer=null;
    }
     if(SearchInvoiceNumberWithPrefix==="")
    {
      SearchInvoiceNumberWithPrefix=null;
    }
    if(SearchGuset==="")
    {
      SearchGuset=null;
    }
    if(SearchBillDate==="")
    {
      SearchBillDate=null;
    }
    if(SearchStartDate==="")
    {
      SearchStartDate=null;
    }
    if(SearchEndDate==="")
    {
      SearchEndDate=null;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL_GetData + "/GetAllGeneralBillMain" + "/"+ SearchCustomer + '/'+ SearchInvoiceNumberWithPrefix + "/" + SearchGuset + "/"+ SearchBillDate + '/' + SearchStartDate + '/' + SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: GenerateBillMainModel) 
  {
    advanceTable.invoiceID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.invoiceNumberIssuedByID=this.generalService.getUserID();
    advanceTable.invoiceDateString=this.generalService.getTimeApplicable(advanceTable.invoiceDate).toString().slice(0, 19);
    advanceTable.billFromDateString=this.generalService.getTimeApplicable(advanceTable.billFromDate).toString().slice(0, 19);
    advanceTable.billToDateString=this.generalService.getTimeApplicable(advanceTable.billToDate).toString().slice(0, 19);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: GenerateBillMainModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.invoiceNumberIssuedByID=this.generalService.getUserID();
    advanceTable.invoiceDateString=this.generalService.getTimeApplicable(advanceTable.invoiceDate).toString().slice(0, 19);
    advanceTable.billFromDateString=this.generalService.getTimeApplicable(advanceTable.billFromDate).toString().slice(0, 19);
    advanceTable.billToDateString=this.generalService.getTimeApplicable(advanceTable.billToDate).toString().slice(0, 19);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(invoiceID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ invoiceID+ '/'+ userID);
  }

}
  

