export class MaxGarageInOutKMMinutes {
  customerContractMaxG2GKMMinutesID: number;
  customerContractID: number;
  packageTypeID: number;
  packageType: string;
  maximumGarageToPickupKMs: number;
  maximumGarageToPickupMinutes: number;
  maximumDropoffToGarageKMs: number;
  maximumDropoffToGarageMinutes: number;
  activationStatus: boolean;
  createdByID: number;
  createdByName: string;
  creationDate: string | Date;
  creationTime: string;
  endDate: string | Date;
  endTime: string;
  confirmReplace: boolean;
  userID: number;

  constructor(item?: Partial<MaxGarageInOutKMMinutes>) {
    this.customerContractMaxG2GKMMinutesID = item?.customerContractMaxG2GKMMinutesID ?? -1;
    this.customerContractID = item?.customerContractID ?? 0;
    this.packageTypeID = item?.packageTypeID ?? 0;
    this.packageType = item?.packageType ?? '';
    this.maximumGarageToPickupKMs = item?.maximumGarageToPickupKMs ?? null;
    this.maximumGarageToPickupMinutes = item?.maximumGarageToPickupMinutes ?? null;
    this.maximumDropoffToGarageKMs = item?.maximumDropoffToGarageKMs ?? null;
    this.maximumDropoffToGarageMinutes = item?.maximumDropoffToGarageMinutes ?? null;
    this.activationStatus = item?.activationStatus ?? true;
    this.createdByID = item?.createdByID ?? 0;
    this.createdByName = item?.createdByName ?? '';
    this.creationDate = item?.creationDate ?? null;
    this.creationTime = item?.creationTime ?? null;
    this.endDate = item?.endDate ?? null;
    this.endTime = item?.endTime ?? null;
    this.confirmReplace = item?.confirmReplace ?? false;
    this.userID = item?.userID ?? 0;
  }
}
