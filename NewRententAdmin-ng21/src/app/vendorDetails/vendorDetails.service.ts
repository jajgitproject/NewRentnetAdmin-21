// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorDetails } from './vendorDetails.model';
@Injectable()
export class VendorDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "allotmentLocation/";
  }
  GetVendorForAllotment(AllotmentID:number): Observable<VendorDetails[]> {
    return this.httpClient.get<VendorDetails[]>(this.API_URL + "GetVendorForAllotment/"+AllotmentID);
  }

 
 
}
