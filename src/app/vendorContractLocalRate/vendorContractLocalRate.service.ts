// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorContractCityTiersDropDownModel, VendorContractLocalRateModel, VendorLocalFixedDetailsModel } from './vendorContractLocalRate.model';
import { VendorContractCarCategoryDropDownModel } from '../vendorContractCarCategory/vendorContractCarCategory.model';
@Injectable()
export class VendorContractLocalRateService 
{
  private API_URL:string = '';
  private API_URL_CarCat:string = '';
  private API_URL_CityTier:string = '';
  private API_URL_Fixed:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorContractLocalRate";
    this.API_URL_CarCat=generalService.BaseURL+ "vendorContractCarCategory";
    this.API_URL_CityTier=generalService.BaseURL+ "vendorContractCityTiers";
    this.API_URL_Fixed=generalService.BaseURL+ "vendorLocalFixedDetails";
  }
  /** CRUD METHODS */
  getTableData(
    VendorContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCityTier==="")
    {
      SearchCityTier="null";
    }
    if(SearchPackage==="")
    {
      SearchPackage="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + VendorContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/VendorLocalRateID/Ascending');
  }
  getTableDataSort(
    VendorContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCityTier==="")
    {
      SearchCityTier="null";
    }
    if(SearchPackage==="")
    {
      SearchPackage="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + VendorContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: VendorContractLocalRateModel) 
  {
    advanceTable.vendorLocalRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  duplicateInsert(advanceTable: VendorContractLocalRateModel) 
  {
    advanceTable.vendorLocalRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL+"/"+"Duplicate" , advanceTable);
  }

  update(advanceTable: VendorContractLocalRateModel)
  {         
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(vendorLocalRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorLocalRateID + '/'+ userID);
  }

  GetCarCategory(VendorContract_ID:number): Observable<VendorContractCarCategoryDropDownModel[]> 
  {
    return this.httpClient.get<VendorContractCarCategoryDropDownModel[]>(this.API_URL_CarCat + "/ForCarCategories/" + VendorContract_ID);
  }

  GetCityTiersForCV(VendorContract_ID:number): Observable<VendorContractCityTiersDropDownModel[]>
  {
    return this.httpClient.get<VendorContractCityTiersDropDownModel[]>(this.API_URL_CityTier + "/GetCityTierFromVendorContract/" + VendorContract_ID);
  }


  addFixedRate(advanceTable: VendorLocalFixedDetailsModel) 
  {
    advanceTable.vendorLocalFixedDetailsID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL_Fixed , advanceTable);
  }

  updateFixedRate(advanceTable: VendorLocalFixedDetailsModel)
  {         
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL_Fixed , advanceTable);
  }


  getTableDataForFixedRate(VendorContract_ID:number, SearchBillFromTo:string,SearchPackageJumpCriteria:string, SearchNextPackageCriteria:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBillFromTo==="")
    {
      SearchBillFromTo=null;
    }
    if(SearchPackageJumpCriteria==="")
    {
      SearchPackageJumpCriteria=null;
    }
    if(SearchNextPackageCriteria==="")
    {
      SearchNextPackageCriteria=null;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL_Fixed + "/" +VendorContract_ID + '/' + SearchBillFromTo + '/' + SearchPackageJumpCriteria + '/' + SearchNextPackageCriteria + '/' + SearchActivationStatus +'/' + PageNumber + '/billFromTo/Ascending');
  }

}
