// @ts-nocheck

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';



import { GeneralService } from '../general/general.service';

import {

  OdometerResetContextDto,

  OdometerResetDto,

  OdometerResetSaveRequest,

  VehicleFuelHistoryEventDto,

} from './fuelEntry.model';



@Injectable()

export class OdometerResetService {

  private apiBase = '';



  constructor(private httpClient: HttpClient, private generalService: GeneralService) {

    this.apiBase = this.generalService.BaseURL + 'odometerReset';

  }



  getById(resetId: number, performedBy: number): Observable<OdometerResetDto> {

    return this.httpClient.get<OdometerResetDto>(`${this.apiBase}/${resetId}/${performedBy}`);

  }



  getContext(inventoryId: number, performedBy: number): Observable<OdometerResetContextDto> {

    return this.httpClient.get<OdometerResetContextDto>(

      `${this.apiBase}/context/${inventoryId}/${performedBy}`

    );

  }



  getByVehicle(inventoryId: number, performedBy: number): Observable<OdometerResetDto[]> {

    return this.httpClient.get<OdometerResetDto[]>(

      `${this.apiBase}/vehicle/${inventoryId}/${performedBy}`

    );

  }



  getVehicleHistory(inventoryId: number, performedBy: number): Observable<VehicleFuelHistoryEventDto[]> {

    return this.httpClient.get<VehicleFuelHistoryEventDto[]>(

      `${this.apiBase}/vehicle/${inventoryId}/history/${performedBy}`

    );

  }



  create(performedBy: number, request: OdometerResetSaveRequest): Observable<OdometerResetDto> {

    return this.httpClient.post<OdometerResetDto>(`${this.apiBase}/${performedBy}`, this.toApiRequest(request));

  }



  update(resetId: number, performedBy: number, request: OdometerResetSaveRequest): Observable<OdometerResetDto> {

    return this.httpClient.put<OdometerResetDto>(

      `${this.apiBase}/${resetId}/${performedBy}`,

      this.toApiRequest(request)

    );

  }



  delete(resetId: number, performedBy: number): Observable<any> {

    return this.httpClient.delete(`${this.apiBase}/${resetId}/${performedBy}`);

  }



  private toApiRequest(request: OdometerResetSaveRequest): Record<string, unknown> {

    return {

      inventoryID: request.inventoryID,

      resetDate: request.resetDate,

      resetTime: request.resetTime,

      newOdometerReading: request.newOdometerReading,

      odometerResetReasonID: request.odometerResetReasonID,

    };

  }

}

