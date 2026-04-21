// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from './card.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CardService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "card";
  }
  /** CRUD METHODS */
  getTableData(SearchCard:string,SearchPaymentNetwork:string,SearchCardType:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCard==="")
    {
      SearchCard="null";
    }
    if(SearchPaymentNetwork==="")
    {
      SearchPaymentNetwork="null";
    }
    if(SearchCardType==="")
    {
      SearchCardType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCard + '/' + SearchPaymentNetwork +'/'+ SearchCardType +'/' + SearchActivationStatus +'/' + PageNumber + '/Card/Ascending');
    
  }

  getTableDataSort(SearchCard:string,SearchPaymentNetwork:string,SearchCardType:string,  SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCard==="")
    {
      SearchCard="null";
    }
    if(SearchPaymentNetwork==="")
    {
      SearchPaymentNetwork="null";
    }
    if(SearchCardType==="")
    {
      SearchCardType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCard + '/'+ SearchPaymentNetwork +'/'+ SearchCardType +'/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
    
  }
  add(advanceTable: Card) 
  {
    advanceTable.cardID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Card)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cardID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cardID + '/'+ userID);
  }

}
  

