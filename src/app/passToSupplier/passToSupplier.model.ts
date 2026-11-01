// @ts-nocheck
import { formatDate } from '@angular/common';
export class PassToSupplierModel {
  reservationPassedToSupplierID:number;
  reservationID:number;
  supplierID:number;
  supplierName:string;
  oldRentnetCode:number;
  supplierAddress:string;
  supplierReservationNumber:string;
  supplierEmail:string;
  supplierConcernedPerson:string;
  supplierConcernedPersonMobile:string;
  userID:number;
  activationStatus: boolean;

  constructor(passToSupplierModel) {
    {
      this.reservationPassedToSupplierID = passToSupplierModel.reservationPassedToSupplierID || -1;
      this.reservationID = passToSupplierModel.reservationID || '';
      this.supplierID = passToSupplierModel.supplierID || '';
      this.supplierName = passToSupplierModel.supplierName || '';
      this.oldRentnetCode = passToSupplierModel.oldRentnetCode || null;
      this.supplierAddress = passToSupplierModel.supplierAddress || '';
      this.supplierReservationNumber = passToSupplierModel.supplierReservationNumber || '';
      this.supplierEmail = passToSupplierModel.supplierEmail || '';
      this.supplierConcernedPerson = passToSupplierModel.supplierConcernedPerson || '';
      this.supplierConcernedPersonMobile = passToSupplierModel.supplierConcernedPersonMobile || '';
      this.activationStatus = passToSupplierModel.activationStatus || '';
    }
  }
}

export class SupplierDropDownModel {
  supplierID: number;
  supplierName: string;
  oldRentnetCode: number;
  address:string;
  phone:string;
  email:string;

  constructor(supplierDropDown) {
    {
      this.supplierID = supplierDropDown.supplierID || -1;
      this.supplierName = supplierDropDown.supplierName || '';
      this.oldRentnetCode = (supplierDropDown.oldRentnetCode && supplierDropDown.oldRentnetCode !== 0)
        ? Number(supplierDropDown.oldRentnetCode)
        : null;
      this.address = supplierDropDown.address || '';
      this.phone = supplierDropDown.phone || '';
      this.email = supplierDropDown.email || '';
    }
  }
  
}
