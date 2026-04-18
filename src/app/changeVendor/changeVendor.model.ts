// @ts-nocheck
export class ChangeEntityModel {
  reservationID: number;
  reservationGroupID: number;
  dutySlipID: number;
  customerTypeID: number;
  customerType: string;
  customerID: number;
  customerName: string;
  customerGroupID: number;
  customerGroup: string;
  packageTypeID: number;
  packageType: string;
  packageID: number;
  package: string;
  vehicleCategoryID: number;
  vehicleCategory: string;
  vehicleID: number;
  vehicle: string;
  pickupCityID: number;
  pickupCity: string;
  pickupDate: Date | null;
  pickupDateString: string;
  pickupTime: Date | null;
  pickupTimeString: string;
  primaryBookerID: number;
  primaryBooker: string;
  primaryPassengerID: number;
  primaryPassenger: string;
  pickupAddress: string;
  pickupAddressDetails: string;
  customerContractID: number;
  userID: number;
  checked:boolean;

  constructor(changeEntityModel) {
    {
      this.reservationID = changeEntityModel.reservationID || -1;
      this.dutySlipID = changeEntityModel.dutySlipID || '';
      this.customerID = changeEntityModel.customerID || '';
      this.customerName = changeEntityModel.customerName || '';      
      this.customerGroupID = changeEntityModel.customerGroupID || '';
      this.customerGroup = changeEntityModel.customerGroup || ''; 
      this.packageTypeID = changeEntityModel.packageTypeID || '';
      this.packageType = changeEntityModel.packageType || '';
      this.packageID = changeEntityModel.packageID || '';
      this.package = changeEntityModel.package || '';
      this.pickupCityID = changeEntityModel.pickupCityID || '';
      this.pickupCity = changeEntityModel.pickupCity || '';
      this.vehicleCategoryID = changeEntityModel.vehicleCategoryID || '';
      this.vehicleCategory = changeEntityModel.vehicleCategory || '';
      this.vehicleID = changeEntityModel.vehicleID || '';
      this.vehicle = changeEntityModel.vehicle || '';
      this.primaryPassengerID = changeEntityModel.primaryPassengerID || '';
      this.primaryPassenger = changeEntityModel.primaryPassenger || '';      
      this.primaryBookerID = changeEntityModel.primaryBookerID || '';
      this.primaryBooker = changeEntityModel.primaryBooker || '';       
      this.pickupAddress = changeEntityModel.pickupAddress || '';
    }
  }  
}


export class ChangeVendorModel {
  reservationChangeLogID:number;
  reservationID:number[]=[];
  changeDate:Date;
  changeTime:Date;
  changeEmployeeID:number;
  changeType:string;
  previousRecordID:number;
  previousRecordName:string;
  newRecordID:number;
  newRecordName:string;
  reason:string;
  userID: number;
  inventoryID: number;
  inventory: string;
  constructor(changeVendorModel) {
    {
      this.reservationChangeLogID = changeVendorModel.reservationChangeLogID || -1;
      this.reservationID = changeVendorModel.reservationID || '';
      this.changeEmployeeID = changeVendorModel.changeEmployeeID || '';
      this.changeType = changeVendorModel.changeType || '';      
      this.previousRecordID = changeVendorModel.previousRecordID || '';
      this.previousRecordName = changeVendorModel.previousRecordName || ''; 
      this.newRecordID = changeVendorModel.newRecordID || '';
      this.newRecordName = changeVendorModel.newRecordName || '';
      this.reason = changeVendorModel.reason || '';
      this.inventoryID = changeVendorModel.inventoryID || '';
      this.inventory = changeVendorModel.inventory || '';
    }
  }
}


export class InventoryDropDown { 
  inventoryID: number;
  inventory: string;

  constructor(inventoryDropDown) {
    {
      this.inventoryID = inventoryDropDown.inventoryID || -1;
      this.inventory = inventoryDropDown.inventory || '';
    }
  }
}
