// @ts-nocheck
import { formatDate } from '@angular/common';
export class VendorDetails {
  carVendor: string;
  driverVendor: string;
  driverSupplierEmail: string;
  driverSupplierPhone: string;
  inventorySupplierPhone: string;
  inventorySupplierEmail: string;
allotmentID:number;

  constructor(vendorDetails) {
    {
      this.carVendor = vendorDetails.carVendor || '';
      this.driverVendor = vendorDetails.driverVendor || '';
      this.driverSupplierEmail = vendorDetails.driverSupplierEmail || '';
      this.driverSupplierPhone = vendorDetails.driverSupplierPhone || '';
      this.inventorySupplierPhone = vendorDetails.inventorySupplierPhone || '';
      this.inventorySupplierEmail = vendorDetails.inventorySupplierEmail || '';
      this.allotmentID = vendorDetails.allotmentID || '';

    }
  }
}

