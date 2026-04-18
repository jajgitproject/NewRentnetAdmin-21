// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { CityBasedSpots } from './CityBasedSpots.model';

@Injectable()
export class CityBasedSpotsService {
  private API_URL: string = '';
  Result: string = 'Failure';

  constructor(
    private httpClient: HttpClient,
    public generalService: GeneralService
  ) {
    //this.API_URL = generalService.BaseURL + 'controlPanel/';
  }


}

