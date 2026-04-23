// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddDiscount } from './addDiscount.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AddDiscountService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "addDiscount";
  }
  /** CRUD METHODS */
  getTableData(SearchAddDiscount:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchAddDiscount==="")
    {
      SearchAddDiscount="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAddDiscount + '/' + SearchActivationStatus +'/' + PageNumber + '/AddDiscount/Ascending');
  }
  getTableDataSort(SearchAddDiscount:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchAddDiscount==="")
    {
      SearchAddDiscount="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchAddDiscount + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: AddDiscount) 
  {
    advanceTable.addDiscountID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AddDiscount)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(addDiscountID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ addDiscountID);
  }

  
}
  

