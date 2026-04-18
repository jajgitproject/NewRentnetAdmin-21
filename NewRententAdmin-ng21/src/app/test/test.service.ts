// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Test } from './test.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class TestService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "test";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    console.log(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/name/Ascending')
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/name/Ascending');
  }
  getTableDataSort(SearchName:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    console.log(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Test) 
  {
    advanceTable.testID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.dobString=this.generalService.getTimeFromS(advanceTable.dob);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Test)
  {
    debugger;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.dobString=this.generalService.getTimeFromS(advanceTable.dob);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(testID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ testID);
  }
}
