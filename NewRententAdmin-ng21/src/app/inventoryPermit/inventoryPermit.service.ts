// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryPermit } from './inventoryPermit.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InventoryPermitService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventoryPermit";
  }
  /** CRUD METHODS */
  getTableData(InventoryPermitID:number,InventoryID:number,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
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
    return this.httpClient.get(this.API_URL + "/" +InventoryPermitID + '/'+InventoryID + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber + '/InventoryPermitID/Ascending');
  }
  getTableDataSort(InventoryPermitID:number,InventoryID:number,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
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
    return this.httpClient.get(this.API_URL + "/" +InventoryPermitID + '/'+InventoryID + '/'+SearchStartDate + '/'+SearchEndDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: InventoryPermit) 
  {
    advanceTable.inventoryPermitID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InventoryPermit)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(inventoryPermitID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ inventoryPermitID + '/' + userID);
  }
}
