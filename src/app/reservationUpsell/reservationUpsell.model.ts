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
