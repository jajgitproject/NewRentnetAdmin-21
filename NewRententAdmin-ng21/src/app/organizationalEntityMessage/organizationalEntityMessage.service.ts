// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrganizationalEntityMessage } from './organizationalEntityMessage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class OrganizationalEntityMessageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "organizationalEntityMessage";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchMessageType:string,
    SearchMessage:string,
    SearchStartDate:string,
    SearchEndDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchMessageType==="")
    {
      SearchMessageType="null";
    }
    if(SearchMessage==="")
    {
      SearchMessage="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchMessageType+ "/" +SearchMessage+ "/" +SearchStartDate+ "/" +SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/organizationalEntityMessageID/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchMessageType:string,
    SearchMessage:string,
    SearchStartDate:string,
    SearchEndDate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchMessageType==="")
    {
      SearchMessageType="null";
    }
    if(SearchMessage==="")
    {
      SearchMessage="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName+ "/" +SearchMessageType+ "/" +SearchMessage+ "/" +SearchStartDate+ "/" +SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: OrganizationalEntityMessage) 
  {
    advanceTable.organizationalEntityMessageID=-1;
    if(advanceTable.includeChildren){
      advanceTable.includeChildren=true;
    }
    else{
     advanceTable.includeChildren=false;
    }
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: OrganizationalEntityMessage)
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(organizationalEntityMessageID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ organizationalEntityMessageID);
  }
}
