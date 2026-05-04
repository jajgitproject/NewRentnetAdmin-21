// @ts-nocheck
import { ClosingDutySlipModel } from "./closingDutySlip.model";
import { ClosingDutySlipByAppModel } from "./closingDutySlipByApp.model";
import { ClosingDutySlipByDriverModel } from "./closingDutySlipByDriver.model";
import { ClosingDutySlipByGPSModel } from "./closingDutySlipByGPS.model";
import { ClosingDutySlipForBillingModel } from "./closingDutySlipForBilling.model";
import { ClosingReservationForPickupDataModel } from "./closingReservationForPickupData.model";
import { KMComparisionModel } from "./kmComparision.model";


export class ClosingModel {
  closingReservationForPickupDataModel: ClosingReservationForPickupDataModel;
  closingDutySlipModel: ClosingDutySlipModel;
  closingDutySlipByDriverModel: ClosingDutySlipByDriverModel;
  closingDutySlipByAppModel: ClosingDutySlipByAppModel;
  closingDutySlipByGPSModel: ClosingDutySlipByGPSModel;
  closingDutySlipForBillingModel: ClosingDutySlipForBillingModel;
  kmComparisionModel: KMComparisionModel;
  invoiceID:number;
  action:string;

  constructor(closingModel) {
    this.closingReservationForPickupDataModel = new ClosingReservationForPickupDataModel(closingModel.closingReservationForPickupDataModel);
    this.closingDutySlipModel = new ClosingDutySlipModel(closingModel.closingDutySlipModel);
    this.closingDutySlipByDriverModel = new ClosingDutySlipByDriverModel(closingModel.closingDutySlipByDriverModel);
    this.closingDutySlipByAppModel = new ClosingDutySlipByAppModel(closingModel.closingDutySlipByAppModel);
    this.closingDutySlipByGPSModel = new ClosingDutySlipByGPSModel(closingModel.closingDutySlipByGPSModel);
    this.closingDutySlipForBillingModel = new ClosingDutySlipForBillingModel(closingModel.closingDutySlipForBillingModel);
    this.kmComparisionModel = new KMComparisionModel(closingModel.kmComparisionModel);
  }
}


export class TotalTollParInStDisputeModel {
  totalTollParking:number;
  totalInterStateTax:number;
  totalDutyExpenseModel:TotalDutyExpenseModel;

  constructor(totalTollParInStDisputeModel) {
    this.totalTollParking = totalTollParInStDisputeModel.totalTollParking || '';
    this.totalInterStateTax = totalTollParInStDisputeModel.totalInterStateTax || '';
    this.totalDutyExpenseModel = new TotalDutyExpenseModel(totalTollParInStDisputeModel.totalDutyExpenseModel);
  }
}

export class TotalDutyExpenseModel {
  totalDEChargeableAmount:number;
  totalDENonChargeableAmount:number;

  constructor(totalDutyExpenseModel) {
    this.totalDEChargeableAmount = totalDutyExpenseModel.totalDEChargeableAmount || '';
    this.totalDENonChargeableAmount = totalDutyExpenseModel.totalDENonChargeableAmount || '';
  }
}