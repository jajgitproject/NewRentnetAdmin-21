// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CardType } from './cardType.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CardTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cardType";
  }
  /** CRUD METHODS */
  getTableData(SearchCardType:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCardType==="")
    {
      SearchCardType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCardType + '/' + SearchActivationStatus +'/' + PageNumber + '/CardType/Ascending');
  }

  getTableDataSort(SearchCardType:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCardType==="")
    {
      SearchCardType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCardType + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CardType) 
  {
   
    advanceTable.cardTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CardType)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cardTypeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cardTypeID + '/'+ userID);
  }

}
  

