// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OtherFields } from './otherFields.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class OtherFieldsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "otherFields";
  }
  /** CRUD METHODS */
  getTableData(SearchOtherFields:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchOtherFields==="")
    {
      SearchOtherFields="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchOtherFields + '/' + SearchActivationStatus +'/' + PageNumber + '/OtherFields/Ascending');
  }

  getTableDataSort(SearchOtherFields:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchOtherFields==="")
    {
      SearchOtherFields="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchOtherFields + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: OtherFields) 
  {
    advanceTable.otherFieldsID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: OtherFields)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(otherFieldsID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ otherFieldsID);
  }

  
}
  

