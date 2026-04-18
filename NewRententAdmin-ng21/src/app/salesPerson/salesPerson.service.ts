// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { SalesPersonModel } from './salesPerson.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ReservationSalesPersonModel } from './salesPerson.model';
@Injectable()
export class SalesPersonService 
{
  private API_SalesPerson:string = '';
  private API_URL_Closing:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
   this.API_SalesPerson =generalService.BaseURL+ "ReservationSalesPerson";
    this.API_URL_Closing=generalService.BaseURL+ "reservationSalesPersonForClosing";
  }
  /** CRUD METHODS */
 getSalesPerson(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
     {
       return this.httpClient.get(this.API_SalesPerson + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationSalesPersonID/Ascending');
     }

   getTableDataforClosing(dutySlipID: number): Observable<any> {
        return this.httpClient.get(this.API_URL_Closing + '/ForReservationSalesPersonForClosing/' + dutySlipID);
    }
  
 addSalesPerson(advanceTable: ReservationSalesPersonModel) 
     {
       advanceTable.reservationSalesPersonID=-1;
       advanceTable.userID=this.generalService.getUserID();
       return this.httpClient.post<any>(this.API_SalesPerson , advanceTable);
     }
     updateSalesPerson(advanceTable: ReservationSalesPersonModel)
     {
       advanceTable.userID=this.generalService.getUserID();
       return this.httpClient.put<any>(this.API_SalesPerson , advanceTable);
     }
 
     deleteSalesPerson(reservationSalesPersonID: number):  Observable<any> 
     {
       let userID = this.generalService.getUserID();
       return this.httpClient.delete(this.API_SalesPerson + '/'+ reservationSalesPersonID  + '/'+ userID);
     }
 
}
  

