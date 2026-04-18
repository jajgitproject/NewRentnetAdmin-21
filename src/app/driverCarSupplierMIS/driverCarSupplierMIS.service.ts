// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverCarSupplierMISService {
  private API_URL: string = '';
  private API_URL1: string = '';
  private API_URL2: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "supplierMIS";
    this.API_URL1 = generalService.BaseURL + "driverMIS";
    this.API_URL2 = generalService.BaseURL + "carMasterMIS";
  }

  /** CRUD METHODS */
  getTableData(SearchdriverName: string, searchlocation: string, searchdateofjoiningfrom: string, searchdateofjoiningto: string, searchSupplierType: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (SearchdriverName === "") {
      SearchdriverName = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }

    if (searchdateofjoiningfrom === "") {
      searchdateofjoiningfrom = "null";
    }
    if (searchdateofjoiningto === "") {
      searchdateofjoiningto = "null";
    }
    if (searchSupplierType === "") {
      searchSupplierType = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    console.log(this.API_URL1 + "/" + SearchdriverName + '/' + searchlocation + '/' + searchdateofjoiningfrom + '/' + searchSupplierType + '/' + SearchActivationStatus + '/' + PageNumber + '/driverID/Dscending')
    return this.httpClient.get(this.API_URL1 + "/" + SearchdriverName + '/' + searchlocation + '/' + searchdateofjoiningfrom + '/' + searchdateofjoiningto + '/' + searchSupplierType + '/' + SearchActivationStatus + '/' + PageNumber + '/driverID/Dscending');
  }
  getTableDataSort(SearchdriverName: string, searchlocation: string, searchdateofjoiningfrom: string, searchdateofjoiningto: string, searchSupplierType: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchdriverName === "") {
      SearchdriverName = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
    if (searchdateofjoiningfrom === "") {
      searchdateofjoiningfrom = "null";
    }
    if (searchdateofjoiningto === "") {
      searchdateofjoiningto = "null";
    }
    if (searchSupplierType === "") {
      searchSupplierType = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchdriverName + '/' + searchlocation + '/' + searchdateofjoiningfrom + '/' + searchdateofjoiningto + '/' + searchSupplierType + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  //carData///
 /** CRUD METHODS */
 getTableData1(
  SearchVehcileCategory: string,
  SearchVehicle: string,
  searchcarLocation: string,
  searchownedSupplier: string,
  status: string,
  searchGps: string,
  searchCompany: string,
  SearchActivationStatus: boolean,
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
  if (SearchActivationStatus === null) {
    SearchActivationStatus = null;
  }
  return this.httpClient.get(this.API_URL2 + "/" + SearchVehcileCategory + "/" + SearchVehicle + '/' + searchcarLocation + '/'+ searchownedSupplier + '/'+ status + '/'+ searchGps + '/'+ searchCompany + '/' + SearchActivationStatus + '/' + PageNumber + '/InventoryID/Ascending');
}
getTableDataSort1(
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
  return this.httpClient.get(this.API_URL2 + "/" + SearchVehcileCategory + "/" + SearchVehicle + '/' + searchcarLocation + '/'+ searchownedSupplier + '/'+ status + '/'+ searchGps + '/'+ searchCompany + '/'+ SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
}

  //SupplierData//

  /** CRUD METHODS */
  getTableData3(SearchName: string,
    SearchCity: string,
    SearchAddress: string,
    SearchPin: string,
    SearchPhone: string,
    SearchFax: string,
    SearchEmail: string,
    SearchSupplierStatus: string,
    SearchSupplierVerificationStatus: string,
    SearchSupplierRegistrationDate: string,
    PageNumber: number): Observable<any> {
    if (SearchName === "") {
      SearchName = "null";
    }
    if (SearchCity === "") {
      SearchCity = "null";
    }
    if (SearchAddress === "") {
      SearchAddress = "null";
    }
    if (SearchPin === "") {
      SearchPin = "null";
    }
    if (SearchPhone === "") {
      SearchPhone = "null";
    }
    if (SearchFax === "") {
      SearchFax = "null";
    }
    if (SearchEmail === "") {
      SearchEmail = "null";
    }
    if (SearchSupplierStatus === "") {
      SearchSupplierStatus = "null";
    }
    if (SearchSupplierVerificationStatus === "") {
      SearchSupplierVerificationStatus = "null";
    }
    if (SearchSupplierRegistrationDate === "") {
      SearchSupplierRegistrationDate = "null";
    }
    console.log(this.API_URL + "/" + SearchName + "/" + SearchCity + "/" + SearchAddress + "/" + SearchPin + "/" + SearchPhone + "/" + SearchFax + '/' + SearchEmail + '/' + SearchSupplierStatus + '/' + SearchSupplierVerificationStatus + '/' + SearchSupplierRegistrationDate + '/' + PageNumber + '/supplierID/Dscending')
    return this.httpClient.get(this.API_URL + "/" + SearchName + "/" + SearchCity + "/" + SearchAddress + "/" + SearchPin + "/" + SearchPhone + "/" + SearchFax + '/' + SearchEmail + '/' + SearchSupplierStatus + '/' + SearchSupplierVerificationStatus + '/' + SearchSupplierRegistrationDate + '/' + PageNumber + '/supplierID/Ascending');
  }
  getTableDataSort3(SearchName: string,
    SearchCity: string,
    SearchAddress: string,
    SearchPin: string,
    SearchPhone: string,
    SearchFax: string,
    SearchEmail: string,
    SearchSupplierStatus: string,
    SearchSupplierVerificationStatus: string,
    SearchSupplierRegistrationDate: string,
    PageNumber: number,
    coloumName: string,
    sortType: string): Observable<any> {
    if (SearchName === "") {
      SearchName = "null";
    }
    if (SearchCity === "") {
      SearchCity = "null";
    }
    if (SearchAddress === "") {
      SearchAddress = "null";
    }
    if (SearchPin === "") {
      SearchPin = "null";
    }
    if (SearchPhone === "") {
      SearchPhone = "null";
    }
    if (SearchFax === "") {
      SearchFax = "null";
    }
    if (SearchEmail === "") {
      SearchEmail = "null";
    }
    if (SearchSupplierStatus === "") {
      SearchSupplierStatus = "null";
    }
    if (SearchSupplierVerificationStatus === "") {
      SearchSupplierVerificationStatus = "null";
    }
    if (SearchSupplierRegistrationDate === "") {
      SearchSupplierRegistrationDate = "null";
    }

    return this.httpClient.get(this.API_URL + "/" + SearchName + "/" + SearchCity + "/" + SearchAddress + "/" + SearchPin + "/" + SearchPhone + "/" + SearchFax + '/' + SearchEmail + '/' + SearchSupplierStatus + '/' + SearchSupplierVerificationStatus + '/' + SearchSupplierRegistrationDate + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }
}
