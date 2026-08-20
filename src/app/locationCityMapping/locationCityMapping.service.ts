// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { LocationCityMappingModel } from './locationCityMapping.model';

@Injectable()
export class LocationCityMappingService {
  private API_URL: string = '';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'locationCityMapping';
  }

  getLocations(searchLocationName: string, searchMappedCities: string, pageNumber: number): Observable<any> {
    if (searchLocationName === '') {
      searchLocationName = 'null';
    }
    if (searchMappedCities === '') {
      searchMappedCities = 'null';
    }
    return this.httpClient.get(this.API_URL + '/locations/' + searchLocationName + '/' + searchMappedCities + '/' + pageNumber + '/LocationName/Ascending');
  }

  getLocationsSort(searchLocationName: string, searchMappedCities: string, pageNumber: number, columnName: string, sortType: string): Observable<any> {
    if (searchLocationName === '') {
      searchLocationName = 'null';
    }
    if (searchMappedCities === '') {
      searchMappedCities = 'null';
    }
    return this.httpClient.get(this.API_URL + '/locations/' + searchLocationName + '/' + searchMappedCities + '/' + pageNumber + '/' + columnName + '/' + sortType);
  }

  getMappedCities(locationID: number, searchCity: string, searchActivationStatus: boolean, pageNumber: number): Observable<any> {
    if (searchCity === '') {
      searchCity = 'null';
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + locationID + '/' + searchCity + '/' + searchActivationStatus + '/' + pageNumber + '/GeoPoint.GeoPointName/Ascending');
  }

  getMappedCitiesSort(locationID: number, searchCity: string, searchActivationStatus: boolean, pageNumber: number, columnName: string, sortType: string): Observable<any> {
    if (searchCity === '') {
      searchCity = 'null';
    }
    return this.httpClient.get(this.API_URL + '/' + locationID + '/' + searchCity + '/' + searchActivationStatus + '/' + pageNumber + '/' + columnName + '/' + sortType);
  }

  getUnmappedCities(locationID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/unmappedCities/' + locationID);
  }

  mapCities(advanceTable: LocationCityMappingModel) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/map', advanceTable);
  }

  unmapCities(advanceTable: LocationCityMappingModel) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/unmap', advanceTable);
  }
}
