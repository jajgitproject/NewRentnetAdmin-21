// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InvoiceTemplate } from './invoiceTemplate.model';
@Injectable()
export class InvoiceTemplateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "invoiceTemplate";
  }
  /** CRUD METHODS */
  getTableData(SearchInvoiceTemplateName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchInvoiceTemplateName==="")
    {
      SearchInvoiceTemplateName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchInvoiceTemplateName + '/' + SearchActivationStatus +'/' + PageNumber + '/InvoiceTemplateName/Ascending');
  }
  getTableDataSort(SearchInvoiceTemplateName:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchInvoiceTemplateName==="")
    {
      SearchInvoiceTemplateName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchInvoiceTemplateName + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchInvoiceTemplateName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InvoiceTemplate) 
  {
    advanceTable.invoiceTemplateID=-1;
   advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InvoiceTemplate)
  {
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(invoiceTemplateID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ invoiceTemplateID+ '/'+ userID);
  }

}
  

