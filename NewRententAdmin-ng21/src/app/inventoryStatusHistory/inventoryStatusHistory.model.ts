// @ts-nocheck
import { formatDate } from '@angular/common';
export class InventoryStatusHistory {
  inventoryID: number;
  inventoryStatusHistoryID:number;
  statusDate: Date;
  vehicle:string;
  statusDateString:string;
  statusChangedByID: number;
  inventoryStatus:string;
  statusReason:string;
  supportingDocImage:string; 
  activationStatus:boolean;
  userID:number;
  constructor(inventoryStatusHistory) {
    {
      this.inventoryStatusHistoryID = inventoryStatusHistory.inventoryStatusHistoryID || -1;
      this.inventoryID = inventoryStatusHistory.inventoryID || 0;
      this.inventoryStatus = inventoryStatusHistory.inventoryStatus || '';
      this.vehicle = inventoryStatusHistory.vehicle || '';
      this.statusDate = inventoryStatusHistory.statusDate || '';
      this.statusReason = inventoryStatusHistory.statusReason || '';
      this.statusChangedByID = inventoryStatusHistory.statusChangedByID || 0;
      this.supportingDocImage = inventoryStatusHistory.supportingDocImage || '';
      this.statusDate=new Date();
      this.activationStatus = inventoryStatusHistory.activationStatus || '';
    }
  }
  
}

