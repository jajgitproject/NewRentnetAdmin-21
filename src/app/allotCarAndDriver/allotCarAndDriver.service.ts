// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AllotCarAndDriver } from './allotCarAndDriver.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AllotCarAndDriverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "allotment";
  }

  add(advanceTable: AllotCarAndDriver) 
  {
    this.prepareAllotmentPayload(advanceTable, true);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: AllotCarAndDriver)
  {
    this.prepareAllotmentPayload(advanceTable, false);
    return this.httpClient.put<any>(this.API_URL+'/UpdateAllotment' , advanceTable);
  }

  private prepareAllotmentPayload(advanceTable: any, isCreate: boolean): void {
    const emptyToNull = (value: any) => (value === '' || value === undefined ? null : value);
    const emptyToNumber = (value: any, fallback: number) => {
      if (value === '' || value === undefined || value === null) {
        return fallback;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    advanceTable.userID = this.generalService.getUserID();
    advanceTable.allotmentByEmployeeID = this.generalService.getUserID();
    advanceTable.allotmentRemark = emptyToNull(advanceTable.allotmentRemark);
    advanceTable.dateOfAllotment = null;
    advanceTable.timeofAllotment = null;
    advanceTable.allotmentStatus = 'Alloted';
    advanceTable.allotmentID = isCreate
      ? -1
      : emptyToNumber(advanceTable.allotmentID, -1);
    advanceTable.reservationID = emptyToNumber(advanceTable.reservationID, 0);
    advanceTable.inventoryID = emptyToNumber(advanceTable.inventoryID, 0);
    advanceTable.vehicleID = emptyToNumber(advanceTable.vehicleID, 0);
    advanceTable.vehicleCategoryID = emptyToNumber(advanceTable.vehicleCategoryID, 0);
    advanceTable.inventorySupplierID = emptyToNumber(advanceTable.inventorySupplierID, 0);
    advanceTable.driverInventoryAssociationID = emptyToNumber(advanceTable.driverInventoryAssociationID, 0);
    advanceTable.driverID = emptyToNumber(advanceTable.driverID, 0);
    advanceTable.driverSupplierID = emptyToNumber(advanceTable.driverSupplierID, 0);
    advanceTable.driverAcceptanceEnteredByEmployeeID = emptyToNumber(
      advanceTable.driverAcceptanceEnteredByEmployeeID,
      0
    );
    advanceTable.acceptanceNotificationSentToDriverDate = emptyToNull(
      advanceTable.acceptanceNotificationSentToDriverDate
    );
    advanceTable.acceptanceNotificationSentToDriverTime = emptyToNull(
      advanceTable.acceptanceNotificationSentToDriverTime
    );
    advanceTable.driverAcceptanceDate = emptyToNull(advanceTable.driverAcceptanceDate);
    advanceTable.driverAcceptanceTime = emptyToNull(advanceTable.driverAcceptanceTime);
    if (advanceTable.allotmentType === '') {
      advanceTable.allotmentType = null;
    }
  }
  
}
  

