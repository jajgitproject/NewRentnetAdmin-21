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
  irn:string;
  hasActiveEInvoice:boolean;

  constructor(closingModel) {
    if (!closingModel) {
      closingModel = {};
    }
    const billingRaw =
      closingModel.closingDutySlipForBillingModel ??
      closingModel.ClosingDutySlipForBillingModel ??
      {};
    const dutySlipRaw =
      closingModel.closingDutySlipModel ??
      closingModel.ClosingDutySlipModel ??
      {};

    // Prefer billing flags; fall back to DutySlip flags (both tables are updated by BillingHistoryProc).
    const billingWithFallback = {
      ...billingRaw,
      goodForBilling:
        billingRaw.goodForBilling ??
        billingRaw.GoodForBilling ??
        dutySlipRaw.goodForBilling ??
        dutySlipRaw.GoodForBilling,
      verifyDuty:
        billingRaw.verifyDuty ??
        billingRaw.VerifyDuty ??
        dutySlipRaw.verifyDuty ??
        dutySlipRaw.VerifyDuty,
    };

    this.closingReservationForPickupDataModel = new ClosingReservationForPickupDataModel(
      closingModel.closingReservationForPickupDataModel ?? closingModel.ClosingReservationForPickupDataModel ?? {}
    );
    this.closingDutySlipModel = new ClosingDutySlipModel(dutySlipRaw);
    this.closingDutySlipByDriverModel = new ClosingDutySlipByDriverModel(
      closingModel.closingDutySlipByDriverModel ?? closingModel.ClosingDutySlipByDriverModel ?? {}
    );
    this.closingDutySlipByAppModel = new ClosingDutySlipByAppModel(
      closingModel.closingDutySlipByAppModel ?? closingModel.ClosingDutySlipByAppModel ?? {}
    );
    this.closingDutySlipByGPSModel = new ClosingDutySlipByGPSModel(
      closingModel.closingDutySlipByGPSModel ?? closingModel.ClosingDutySlipByGPSModel ?? {}
    );
    this.closingDutySlipForBillingModel = new ClosingDutySlipForBillingModel(billingWithFallback);
    this.kmComparisionModel = new KMComparisionModel(
      closingModel.kmComparisionModel ?? closingModel.KmComparisionModel ?? {}
    );
    this.invoiceID = (closingModel.invoiceID ?? closingModel.InvoiceID) || 0;
    this.action = (closingModel.action ?? closingModel.Action) || '';
    this.irn = (closingModel.irn ?? closingModel.IRN) || '';
    this.hasActiveEInvoice =
      closingModel.hasActiveEInvoice === true || closingModel.HasActiveEInvoice === true;
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


export class ChangeSupplierForInventoryModel {
  dutySlipID: number;
  supplierID:number;
  supplierName:string;
  reservationID:number;
  allotmentID:number;
  userID:number;

  constructor(changeSupplierForInventoryModel) {
    this.dutySlipID = changeSupplierForInventoryModel.dutySlipID || '';
    this.supplierID = changeSupplierForInventoryModel.supplierID || '';
    this.supplierName = changeSupplierForInventoryModel.supplierName || '';
    this.reservationID = changeSupplierForInventoryModel.reservationID || '';
    this.allotmentID = changeSupplierForInventoryModel.allotmentID || '';
    this.userID = changeSupplierForInventoryModel.userID || '';
  }
}