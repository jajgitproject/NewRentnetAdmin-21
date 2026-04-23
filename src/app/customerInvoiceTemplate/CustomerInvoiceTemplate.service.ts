// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerInvoiceTemplate } from './CustomerInvoiceTemplate.model';
@Injectable()
export class CustomerInvoiceTemplateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerInvoiceTemplate";
  }
  /** CRUD METHODS */
  getTableData(CustomerID:number,SearchInvoiceTemplateName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(CustomerID===0)
      {
        CustomerID=0;
      }
    if(SearchInvoiceTemplateName==="")
    {
      SearchInvoiceTemplateName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerID + '/' +SearchInvoiceTemplateName + '/' + SearchActivationStatus +'/' + PageNumber + '/InvoiceTemplateName/Ascending');
  }
  getTableDataSort(CustomerID:number,SearchInvoiceTemplateName:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(CustomerID===0)
      {
        CustomerID=0;
      }
    if(SearchInvoiceTemplateName==="")
    {
      SearchInvoiceTemplateName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"  +CustomerID + '/' +SearchInvoiceTemplateName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerInvoiceTemplate) 
  {
    advanceTable.customerInvoiceTemplateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicable(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerInvoiceTemplate)
  {
     advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicable(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerInvoiceTemplateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerInvoiceTemplateID+ '/'+ userID);
  }

}
  

