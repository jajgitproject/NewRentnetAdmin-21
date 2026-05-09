// @ts-nocheck
import { formatDate } from '@angular/common';


export class  AllotmentLogDetails {
allotmentLogID: number;
  allotmentID: number;
  dutySlipID: number;
  reservationID: number;
  allotmentByUserID: number;
  allotmentDate?: Date | null;
  allotmentTime?: string | null;
  allotmentType: string;
  allotmentActionCreateEditCancel: string;
  reason: string;
  isAutoAllotment?: boolean;
  inventoryID: number;
  registrationNumber: string;
  vehicleID: number;
  vehicleName: string;
  vehicleCategoryID: number;
  vehicleCategoryName: string;
  inventoryOwnedSupplied: string;
  inventorySupplierID?: number;
  inventorySupplierName: string;
  driverID?: number;
  driverName: string;
  driverOwnedSupplier: string;
  driverSupplierID?: number;
  driverSupplierName: string;
  allotmentBy: string;
  allotmentStatus: string;
  
  
 constructor(allotmentLogDetails) {
   {
    allotmentLogID = allotmentLogDetails.allotmentLogID || 0;
    allotmentID = allotmentLogDetails.allotmentID || 0;
    dutySlipID = allotmentLogDetails.dutySlipID || 0;
    reservationID = allotmentLogDetails.reservationID || 0;
    allotmentByUserID = allotmentLogDetails.allotmentByUserID || 0;
    allotmentDate = allotmentLogDetails.allotmentDate ? new Date(allotmentLogDetails.allotmentDate) : null;
    allotmentTime = allotmentLogDetails.allotmentTime || null;
    allotmentType = allotmentLogDetails.allotmentType || '';
    allotmentActionCreateEditCancel = allotmentLogDetails.allotmentActionCreateEditCancel || '';
    reason = allotmentLogDetails.reason || '';
    isAutoAllotment = allotmentLogDetails.isAutoAllotment || null;
    inventoryID = allotmentLogDetails.inventoryID || 0;
    registrationNumber = allotmentLogDetails.registrationNumber || '';
    vehicleID = allotmentLogDetails.vehicleID || 0;
    vehicleName = allotmentLogDetails.vehicleName || '';
    vehicleCategoryID = allotmentLogDetails.vehicleCategoryID || 0;
    vehicleCategoryName = allotmentLogDetails.vehicleCategoryName || '';
    inventoryOwnedSupplied = allotmentLogDetails.inventoryOwnedSupplied || '';
    inventorySupplierID = allotmentLogDetails.inventorySupplierID || null;
    inventorySupplierName = allotmentLogDetails.inventorySupplierName || '';
    driverID = allotmentLogDetails.driverID || null;
    driverName = allotmentLogDetails.driverName || '';
    driverOwnedSupplier = allotmentLogDetails.driverOwnedSupplier || '';
    driverSupplierID = allotmentLogDetails.driverSupplierID || null;
    driverSupplierName = allotmentLogDetails.driverSupplierName || '';
    allotmentBy = allotmentLogDetails.allotmentBy || '';
    allotmentStatus = allotmentLogDetails.allotmentStatus || '';
      
   }
 }
}
