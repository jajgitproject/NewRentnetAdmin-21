// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerGroupReservationCappingModel } from './customerGroupReservationCapping.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { CityDropDown } from '../city/cityDropDown.model';
import {
  BulkUpdateRequest,
  BulkUpdateResponse,
  CappingCombinationDisplay,
  CappingImportResult
} from './customerGroupReservationCapping.model';

@Injectable()
export class CustomerGroupReservationCappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerGroupReservationCapping";
  }

  private encodeFilterSegment(value: string): string {
    return encodeURIComponent(value);
  }

  private segmentOrNull(value: number | null | undefined): string {
    if (value == null || value === undefined || Number(value) <= 0) {
      return 'null';
    }
    return String(value);
  }

  private idsListSegment(ids: number[] | null | undefined): string {
    if (!ids?.length) {
      return 'null';
    }
    const normalized = ids.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
    if (!normalized.length) {
      return 'null';
    }
    return encodeURIComponent(normalized.join(','));
  }

  private activationSegment(isActive: boolean): string {
    return isActive ? 'true' : 'false';
  }

  getTableDataFilter(
    customerGroupID: number,
    cappingType: string,
    packageTypeIDs: number[] | null,
    cityIDs: number[] | null,
    vehicleIDs: number[] | null,
    isActive: boolean,
    pageNumber: number,
    orderByColumn: string = 'CustomerGroupReservationCappingID',
    order: string = 'Ascending',
    pageSize: number = 10
  ): Observable<any> {
    const url = `${this.API_URL}/Filter/${customerGroupID}/${this.encodeFilterSegment(cappingType)}/${this.idsListSegment(packageTypeIDs)}/${this.idsListSegment(cityIDs)}/${this.idsListSegment(vehicleIDs)}/${this.activationSegment(isActive)}/${pageNumber}/${orderByColumn}/${order}`;
    return this.httpClient.get(url, { params: { pageSize: String(pageSize) } });
  }

  getTableDataFilterSort(
    customerGroupID: number,
    cappingType: string,
    packageTypeIDs: number[] | null,
    cityIDs: number[] | null,
    vehicleIDs: number[] | null,
    isActive: boolean,
    pageNumber: number,
    orderByColumn: string,
    order: string,
    pageSize: number = 10
  ): Observable<any> {
    return this.getTableDataFilter(customerGroupID, cappingType, packageTypeIDs, cityIDs, vehicleIDs, isActive, pageNumber, orderByColumn, order, pageSize);
  }

  add(payload: any) 
  {
    const body = {
      customerGroupReservationCappingID: -1,
      customerGroupID: Number(payload.customerGroupID),
      packageTypeID: Number(payload.packageTypeID),
      cappingType: payload.cappingType,
      cityID: payload.cityID,
      vehicleID: payload.vehicleID,
      mondayCap: payload.mondayCap,
      tuesdayCap: payload.tuesdayCap,
      wednesdayCap: payload.wednesdayCap,
      thursdayCap: payload.thursdayCap,
      fridayCap: payload.fridayCap,
      saturdayCap: payload.saturdayCap,
      sundayCap: payload.sundayCap,
      activationStatus: payload.activationStatus !== false && payload.activationStatus !== 'false',
      userID: this.generalService.getUserID()
    };
    return this.httpClient.post<any>(this.API_URL, body);
  }

  update(advanceTable: CustomerGroupReservationCappingModel | any) {
    const body = {
      customerGroupReservationCappingID:
        advanceTable.customerGroupReservationCappingID ?? advanceTable.CustomerGroupReservationCappingID,
      customerGroupID: advanceTable.customerGroupID ?? advanceTable.CustomerGroupID,
      mondayCap: advanceTable.mondayCap ?? advanceTable.MondayCap,
      tuesdayCap: advanceTable.tuesdayCap ?? advanceTable.TuesdayCap,
      wednesdayCap: advanceTable.wednesdayCap ?? advanceTable.WednesdayCap,
      thursdayCap: advanceTable.thursdayCap ?? advanceTable.ThursdayCap,
      fridayCap: advanceTable.fridayCap ?? advanceTable.FridayCap,
      saturdayCap: advanceTable.saturdayCap ?? advanceTable.SaturdayCap,
      sundayCap: advanceTable.sundayCap ?? advanceTable.SundayCap,
      activationStatus:
        advanceTable.activationStatus === true ||
        advanceTable.activationStatus === 'true' ||
        advanceTable.activationStatus === 1,
      userID: this.generalService.getUserID()
    };
    return this.httpClient.put<any>(this.API_URL, body);
  }

  bulkActivateCheck(ids: number[]): Observable<{ conflicts: CappingCombinationDisplay[] }> {
    const body = {
      ids,
      userID: this.generalService.getUserID()
    };
    return this.httpClient.post<{ conflicts: CappingCombinationDisplay[] }>(
      `${this.API_URL}/bulk-activate-check`,
      body
    );
  }

  bulkActivate(ids: number[]): Observable<BulkUpdateResponse> {
    const body = {
      ids,
      userID: this.generalService.getUserID()
    };
    return this.httpClient.put<BulkUpdateResponse>(`${this.API_URL}/bulk-activate`, body);
  }

  bulkUpdate(request: BulkUpdateRequest): Observable<BulkUpdateResponse> {
    const body = {
      ids: request.ids,
      mondayCap: request.mondayCap,
      tuesdayCap: request.tuesdayCap,
      wednesdayCap: request.wednesdayCap,
      thursdayCap: request.thursdayCap,
      fridayCap: request.fridayCap,
      saturdayCap: request.saturdayCap,
      sundayCap: request.sundayCap,
      userID: this.generalService.getUserID()
    };
    return this.httpClient.put<BulkUpdateResponse>(`${this.API_URL}/bulk-update`, body);
  }

  delete(customerGroupReservationCappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerGroupReservationCappingID + '/'+ userID);
  }

  GetCityForCustomerGroupCapping(CustomerGroupID:number,PackageTypeID:number,VehicleID:number,CappingType:string): Observable<CityDropDown[]> 
  {
      const capType = CappingType ? encodeURIComponent(CappingType) : 'null';
      return this.httpClient.get<CityDropDown[]>(this.API_URL + '/'+ "GetCityForCustomerGroupCapping/" + CustomerGroupID + '/'+ PackageTypeID + '/'+ VehicleID + '/' + capType);
  }

  importExcel(customerGroupId: number, file: File): Observable<CappingImportResult> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const userId = this.generalService.getUserID();
    return this.httpClient.post<CappingImportResult>(
      `${this.API_URL}/import-excel/${customerGroupId}/${userId}`,
      formData
    );
  }

  downloadImportTemplate(customerGroupId: number): Observable<Blob> {
    return this.httpClient.get(`${this.API_URL}/import-excel-template/${customerGroupId}`, { responseType: 'blob' });
  }

}
  
