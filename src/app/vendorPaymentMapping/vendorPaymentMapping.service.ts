// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorPaymentMapping } from './vendorPaymentMapping.model';





@Injectable()
export class VendorPaymentMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorContractPaymentMapping";
  }
  /** CRUD METHODS */
  getTableData(vendorcontractID:number,modeOfPayment:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(vendorcontractID===0)
      {
        vendorcontractID=0;
      }
    if(modeOfPayment==="")
    {
      modeOfPayment="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + vendorcontractID + '/' +modeOfPayment + '/' + SearchActivationStatus +'/' + PageNumber + '/vendorContractPaymentMappingID/Ascending');
  }
  getTableDataSort(vendorcontractID:number,modeOfPayment:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(vendorcontractID===0)
      {
        vendorcontractID=0;
      }
    if(modeOfPayment==="")
    {
      modeOfPayment="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    
    return this.httpClient.get(this.API_URL + "/" + vendorcontractID + '/' +modeOfPayment + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: VendorPaymentMapping) 
  {
    advanceTable.vendorContractPaymentMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VendorPaymentMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(vendorContractPaymentMappingID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorContractPaymentMappingID + '/'+ userID);
  }

  

}
  

