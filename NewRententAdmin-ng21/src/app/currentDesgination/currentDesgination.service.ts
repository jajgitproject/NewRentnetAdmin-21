// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentDesgination } from './currentDesgination.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CurrentDesginationService 
{
  private API_URL:string = '';
  private API_URLL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "currentDesgination";
    this.API_URLL=generalService.BaseURL+ "organizationalEntityStakeHolders";
  }
  /** CRUD METHODS */
  getTableData(SearchEntityType:string, SearchOrganizationalEntityStakeHolders:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    
    if(SearchEntityType==="")
    {
      SearchEntityType="null";
    }
    if(SearchOrganizationalEntityStakeHolders==="")
    {
      SearchOrganizationalEntityStakeHolders="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL +"/" +SearchEntityType + '/'+SearchOrganizationalEntityStakeHolders + '/' + SearchActivationStatus +'/' + PageNumber + '/organizationalEntityName/Ascending');
  }
  

  getTableDataSort(SearchCurrentDesgination:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCurrentDesgination==="")
    {
      SearchCurrentDesgination="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCurrentDesgination + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CurrentDesgination) 
  {
    advanceTable.currentDesginationID=-1;
    if(advanceTable.isHOD){
      advanceTable.isHOD=true;
    }
    else{
     advanceTable.isHOD=false;
    }
    
    if(advanceTable.isResponsibleForChildEntities){
      advanceTable.isResponsibleForChildEntities=true;
    }
    else{
     advanceTable.isResponsibleForChildEntities=false;
    }
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CurrentDesgination)
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(currentDesginationid: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ currentDesginationid);
  }
}
