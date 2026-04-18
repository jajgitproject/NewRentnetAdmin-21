// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { TollParkingISTImages } from './TollParkingISTImages.model';

@Injectable()
export class TollParkingISTImagesService {
  private API_URL: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'Reservation';
  }

  getTollImages(ltrStatementID:any)
  {
    return this.httpClient.get(this.API_URL+"/"+'getTollImages/' + ltrStatementID);
  }

  getTParkingImages(ltrStatementID:any)
  {
    return this.httpClient.get(this.API_URL+"/"+'getParkingImages/' + ltrStatementID);
  }

  getISTImages(ltrStatementID:any)
  {
    return this.httpClient.get(this.API_URL+"/"+'getISTImages/' + ltrStatementID);
  }
}

