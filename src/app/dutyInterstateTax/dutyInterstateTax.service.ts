// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DutyInterstateTax } from './dutyInterstateTax.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DutyInterstateTaxService 
{
  private API_URL:string = '';
  private API_URL_Info:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutyInterstateTax";
    this.API_URL_Info=generalService.BaseURL+ "dutyInterstateTaxEntryDetails";
  }

  /** CRUD METHODS */

  LoadInterstateTaxData(InterStateTaxStartDate:string,InterStateTaxEndDate:string,RegistrationNumber:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'getInterstateTax'+ "/"+InterStateTaxStartDate+ "/"+InterStateTaxEndDate+ "/" +RegistrationNumber);
  }

  LoadInterstateData(InterStateTaxStartDate:string,InterStateTaxEndDate:string,GeoPointName:string,registrationNumber:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'getInterstate'+ "/"+InterStateTaxStartDate+ "/"+InterStateTaxEndDate+ "/" +GeoPointName+ "/" +registrationNumber);
  }

  // LoadInterstateTaxImage(InterStateTaxID:number)
  // {
  //   return this.httpClient.get(this.API_URL + "/"+'InterStateTaxImage'+ "/"+InterStateTaxID);
  // }

  getTableData(DutyInterstateTaxID:number,DutySlipID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/"+ DutyInterstateTaxID + "/" + DutySlipID + '/' + SearchActivationStatus +'/' + PageNumber + '/dutyInterstateTaxID/Ascending');
  }
  getTableDataSort(SearchDutyInterstateTax:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchDutyInterstateTax==="")
    {
      SearchDutyInterstateTax="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    //console.log(this.API_URL + "/" +SearchDutyInterstateTax + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchDutyInterstateTax + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DutyInterstateTax) 
  {
    advanceTable.dutyInterstateTaxID=-1;
    advanceTable.approvalRemark = null;
    advanceTable.userID=this.generalService.getUserID();
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.taxStartDateString=this.generalService.getTimeApplicable(advanceTable.taxStartDate);
    advanceTable.approvalDateString=this.generalService.getTimeApplicable(advanceTable.approvalDate);
    advanceTable.taxEndDateString=this.generalService.getTimeApplicable(advanceTable.taxEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DutyInterstateTax)
  {
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(dutyInterstateTaxID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ dutyInterstateTaxID+ '/'+ userID);
  }

  getDutyInterstateTaxEntryDetails(DutySlipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Info + "/"+'GetDutyInterstateTaxEntryDetails'+ "/"+ DutySlipID);
  }
}
  

