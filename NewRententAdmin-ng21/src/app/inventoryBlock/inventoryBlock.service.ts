// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryBlock } from './inventoryBlock.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InventoryBlockService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "inventoryBlock";
  }
  /** CRUD METHODS */
  getTableData(inventoryID:number, SearchStartDate:string,
    SearchEndDate:string,SearchName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL +  "/"+inventoryID + "/" +SearchStartDate + '/' + SearchEndDate +'/'  +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/inventoryBlockID/Ascending');
  }
  getTableDataSort(inventoryID:number, SearchStartDate:string,
    SearchEndDate:string,SearchName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL +  "/"+inventoryID + "/" +SearchStartDate + '/' + SearchEndDate +'/'  +SearchName + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: InventoryBlock) 
  {
    advanceTable.inventoryBlockID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.inventoryBlockStartDateString=this.generalService.getTimeApplicable(advanceTable.inventoryBlockStartDate);
    advanceTable.inventoryBlockEndDateString=this.generalService.getTimeApplicableTO(advanceTable.inventoryBlockEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: InventoryBlock)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.inventoryBlockStartDateString=this.generalService.getTimeApplicable(advanceTable.inventoryBlockStartDate);
    advanceTable.inventoryBlockEndDateString=this.generalService.getTimeApplicableTO(advanceTable.inventoryBlockEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(inventoryBlockID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ inventoryBlockID + '/' + userID);
  }
}
