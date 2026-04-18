// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeneralBillModel } from './generalBill.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class GeneralBillService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "generalBill";
  }

  /** CRUD METHODS */
  getTableData(invoiceID:number,SearchNarration:string,SearchRate:string,SearchQuantity:string,SearchBaseAmount:string,SearchUOM:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(invoiceID === 0)
    {
      invoiceID = 0;
    }
    if(SearchNarration==="")
    {
      SearchNarration="null";
    }
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(SearchQuantity==="")
    {
      SearchQuantity="null";
    }
    if(SearchBaseAmount==="")
    {
      SearchBaseAmount="null";
    }
    if(SearchUOM==="")
    {
      SearchUOM="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/GetAllGeneralBill/" + invoiceID + '/' + SearchNarration + '/' + SearchRate + '/' + SearchQuantity + '/' + SearchBaseAmount + '/' + SearchUOM + '/' + SearchActivationStatus +'/' + PageNumber + '/InvoiceGeneralLineItemsID/Ascending');
  }
  getTableDataSort(invoiceID:number,SearchNarration:string,SearchRate:string,SearchQuantity:string,SearchBaseAmount:string,SearchUOM:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(invoiceID === 0)
    {
      invoiceID = 0;
    }
    if(SearchNarration==="")
    {
      SearchNarration="null";
    }
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(SearchQuantity==="")
    {
      SearchQuantity="null";
    }
    if(SearchBaseAmount==="")
    {
      SearchBaseAmount="null";
    }
    if(SearchUOM==="")
    {
      SearchUOM="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/GetAllGeneralBill/" + invoiceID + '/' + SearchNarration + '/' + SearchRate + '/' + SearchQuantity + '/' + SearchBaseAmount + '/' + SearchUOM + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: GeneralBillModel) 
  {
    advanceTable.invoiceGeneralLineItemsID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: GeneralBillModel)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(invoiceGeneralLineItemsID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ invoiceGeneralLineItemsID+ '/'+ userID);
  }

}
  

