// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CarMasterMISService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "carMasterMIS";
  }
  /** CRUD METHODS */
  getTableData(
    SearchVehcileCategory: string,
    SearchVehicle: string,
    searchcarLocation: string,
    searchownedSupplier: string,
    status: string,
    searchGps: string,
    searchCompany: string,
    SearchActivationStatus: string,
    PageNumber: number): Observable<any> {
    if (SearchVehcileCategory === "") {
      SearchVehcileCategory = "null";
    }
    if (SearchVehicle === "") {
      SearchVehicle = "null";
    }

    if (searchcarLocation === "") {
      searchcarLocation = "null";
    }
    if (searchownedSupplier === "") {
      searchownedSupplier = "null";
    }
    if (status === "") {
      status = "null";
    }
    if (searchGps === "") {
      searchGps = "null";
    }
    if (searchCompany === "") {
      searchCompany = "null";
    }
    if (SearchActivationStatus === "") {
      SearchActivationStatus = "null";
    }
    return this.httpClient.get(this.API_URL + "/" + SearchVehcileCategory + "/" + SearchVehicle + '/' + searchcarLocation + '/'+ searchownedSupplier + '/'+ status + '/'+ searchGps + '/'+ searchCompany + '/' + SearchActivationStatus + '/' + PageNumber + '/InventoryID/Ascending');
  }
  getTableDataSort(
    SearchVehcileCategory: string,
    SearchVehicle: string,
    searchcarLocation: string,
    searchownedSupplier: string,
    status: string,
    searchGps: string,
    searchCompany: string,
    SearchActivationStatus: string,
    PageNumber: number,
    coloumName: string,
    sortType: string): Observable<any> {
      if (SearchVehcileCategory === "") {
        SearchVehcileCategory = "null";
      }
      if (SearchVehicle === "") {
        SearchVehicle = "null";
      }
  
      if (searchcarLocation === "") {
        searchcarLocation = "null";
      }
      if (searchownedSupplier === "") {
        searchownedSupplier = "null";
      }
      if (status === "") {
        status = "null";
      }
      if (searchGps === "") {
        searchGps = "null";
      }
      if (searchCompany === "") {
        searchCompany = "null";
      }
      if (SearchActivationStatus === "") {
        SearchActivationStatus = "null";
      }
    return this.httpClient.get(this.API_URL + "/" + SearchVehcileCategory + "/" + SearchVehicle + '/' + searchcarLocation + '/'+ searchownedSupplier + '/'+ status + '/'+ searchGps + '/'+ searchCompany + '/'+ SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

}
