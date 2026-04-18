// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryStatusHistory } from './inventoryStatusHistory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InventoryStatusHistoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventoryStatusHistory";
  }
  /** CRUD METHODS */
  getTableData(inventoryID:number,SearchstatusReason:string,searchInventoryStatus:string, PageNumber: number):  Observable<any> 
  {
    if(inventoryID===undefined)
    {
      inventoryID=null;
    }
    if(SearchstatusReason==="")
    {
      SearchstatusReason="null";
    }
    if(searchInventoryStatus==="")
    {
      searchInventoryStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +inventoryID+ '/'+SearchstatusReason+ '/' +searchInventoryStatus+ '/' +PageNumber + '/inventoryStatusHistoryID/Descending');
  }
  getTableDataSort(inventoryID:number,SearchstatusReason:string,searchInventoryStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(inventoryID===undefined)
    {
      inventoryID=null;
    }
    if(SearchstatusReason==="")
    {
      SearchstatusReason="null";
    }
    if(searchInventoryStatus==="")
    {
      searchInventoryStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/"+inventoryID+ '/' +SearchstatusReason+ "/"+searchInventoryStatus+ '/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InventoryStatusHistory) 
  {
    advanceTable.inventoryStatusHistoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.statusChangedByID=this.generalService.getUserID();
    advanceTable.statusDateString=this.generalService.getTimeFromS(advanceTable.statusDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InventoryStatusHistory)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.statusDateString=this.generalService.getTimeFromS(advanceTable.statusDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  // delete(inventoryStatusHistoryID: number):  Observable<any> 
  // {
  //   return this.httpClient.delete(this.API_URL + '/'+ inventoryStatusHistoryID);
  // }
}
