// @ts-nocheck
export class ReservationUpsellStatus {
  isAuthorized: boolean;
  canUpsell: boolean;
  hasActiveUpsell: boolean;
  disabledReason: string;
  currentVehicleCategoryID: number;
  currentVehicleCategoryName: string;
  currentContractRate: number;

  constructor(item?: any) {
    this.isAuthorized = item?.isAuthorized ?? item?.IsAuthorized ?? false;
    this.canUpsell = item?.canUpsell ?? item?.CanUpsell ?? false;
    this.hasActiveUpsell = item?.hasActiveUpsell ?? item?.HasActiveUpsell ?? false;
    this.disabledReason = item?.disabledReason ?? item?.DisabledReason ?? '';
    this.currentVehicleCategoryID = item?.currentVehicleCategoryID ?? 0;
    this.currentVehicleCategoryName = item?.currentVehicleCategoryName ?? '';
    this.currentContractRate = item?.currentContractRate ?? 0;
  }
}

export class EligibleUpsellCategory {
  vehicleCategoryID: number;
  carCategory: string;
  vehicleID: number;
  vehicleName: string;
  customerContractCarCategoryID: number;
  contractRate: number;
  difference: number;

  constructor(item?: any) {
    this.vehicleCategoryID = item?.vehicleCategoryID ?? item?.VehicleCategoryID ?? 0;
    this.carCategory = item?.carCategory ?? item?.CarCategory ?? '';
    this.vehicleID = item?.vehicleID ?? item?.VehicleID ?? 0;
    this.vehicleName = item?.vehicleName ?? item?.VehicleName ?? '';
    this.customerContractCarCategoryID = item?.customerContractCarCategoryID ?? item?.CustomerContractCarCategoryID ?? 0;
    this.contractRate = item?.contractRate ?? item?.ContractRate ?? 0;
    this.difference = item?.difference ?? item?.Difference ?? 0;
  }
}

export class UpsellDeclineReason {
  reasonID: number;
  reasonName: string;
  displayOrder: number;

  constructor(item?: any) {
    this.reasonID = item?.reasonID ?? item?.ReasonID ?? 0;
    this.reasonName = item?.reasonName ?? item?.ReasonName ?? '';
    this.displayOrder = item?.displayOrder ?? item?.DisplayOrder ?? 0;
  }
}

export class ReservationUpsellDeclineLog {
  declineID: number;
  reservationID: number;
  reasonID: number;
  reasonName: string;
  comment: string;
  username: string;
  userID: number;
  createdOn: Date | null;

  constructor(item?: any) {
    this.declineID = item?.declineID ?? item?.DeclineID ?? 0;
    this.reservationID = item?.reservationID ?? item?.ReservationID ?? 0;
    this.reasonID = item?.reasonID ?? item?.ReasonID ?? 0;
    this.reasonName = item?.reasonName ?? item?.ReasonName ?? '';
    this.comment = item?.comment ?? item?.Comment ?? '';
    this.username = item?.username ?? item?.Username ?? '';
    this.userID = item?.userID ?? item?.UserID ?? 0;
    const rawDate = item?.createdOn ?? item?.CreatedOn ?? item?.createdDate ?? item?.CreatedDate ?? null;
    this.createdOn = rawDate ? new Date(rawDate) : null;
  }
}

export class CancelUpsellOption {
  upsellHistoryID: number;
  vehicleCategoryID: number;
  carCategory: string;
  vehicleID: number;

  constructor(item?: any) {
    this.upsellHistoryID = item?.upsellHistoryID ?? item?.UpsellHistoryID ?? 0;
    this.vehicleCategoryID = item?.vehicleCategoryID ?? item?.VehicleCategoryID ?? 0;
    this.carCategory = item?.carCategory ?? item?.CarCategory ?? '';
    this.vehicleID = item?.vehicleID ?? item?.VehicleID ?? 0;
  }
}

export class ReservationUpsellHistory {
  upsellHistoryID: number;
  reservationID: number;
  oldCarCategoryID: number;
  oldCarCategoryName: string;
  newCarCategoryID: number;
  newCarCategoryName: string;
  oldVehicleID: number | null;
  oldVehicleName: string;
  newVehicleID: number | null;
  newVehicleName: string;
  oldContractRate: number;
  newContractRate: number;
  rateDifference: number;
  upsellTimestamp: Date | null;
  upsellByUsername: string;
  status: string;
  remarks: string;
  cancelReason: string;
  cancelledTimestamp: Date | null;

  constructor(item?: any) {
    this.upsellHistoryID = item?.upsellHistoryID ?? item?.UpsellHistoryID ?? 0;
    this.reservationID = item?.reservationID ?? item?.ReservationID ?? 0;
    this.oldCarCategoryID = item?.oldCarCategoryID ?? item?.OldCarCategoryID ?? 0;
    this.oldCarCategoryName = item?.oldCarCategoryName ?? item?.OldCarCategoryName ?? '';
    this.newCarCategoryID = item?.newCarCategoryID ?? item?.NewCarCategoryID ?? 0;
    this.newCarCategoryName = item?.newCarCategoryName ?? item?.NewCarCategoryName ?? '';
    this.oldVehicleID = item?.oldVehicleID ?? item?.OldVehicleID ?? null;
    this.oldVehicleName = item?.oldVehicleName ?? item?.OldVehicleName ?? '';
    this.newVehicleID = item?.newVehicleID ?? item?.NewVehicleID ?? null;
    this.newVehicleName = item?.newVehicleName ?? item?.NewVehicleName ?? '';
    this.oldContractRate = item?.oldContractRate ?? item?.OldContractRate ?? 0;
    this.newContractRate = item?.newContractRate ?? item?.NewContractRate ?? 0;
    this.rateDifference = item?.rateDifference ?? item?.RateDifference ?? 0;
    const rawDate = item?.upsellTimestamp ?? item?.UpsellTimestamp ?? null;
    this.upsellTimestamp = rawDate ? new Date(rawDate) : null;
    this.upsellByUsername = item?.upsellByUsername ?? item?.UpsellByUsername ?? '';
    this.status = item?.status ?? item?.Status ?? '';
    this.remarks = item?.remarks ?? item?.Remarks ?? '';
    this.cancelReason = item?.cancelReason ?? item?.CancelReason ?? '';
    const rawCancelDate = item?.cancelledTimestamp ?? item?.CancelledTimestamp ?? null;
    this.cancelledTimestamp = rawCancelDate ? new Date(rawCancelDate) : null;
  }
}
