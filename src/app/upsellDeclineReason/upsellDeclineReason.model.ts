// @ts-nocheck
export class UpsellDeclineReason {
  reasonID: number;
  reasonName: string;
  displayOrder: number;
  isActive: boolean;
  userID: number;

  constructor(item?: any) {
    this.reasonID = item?.reasonID ?? item?.ReasonID ?? -1;
    this.reasonName = item?.reasonName ?? item?.ReasonName ?? '';
    this.displayOrder = item?.displayOrder ?? item?.DisplayOrder ?? 0;
    this.isActive = item?.isActive ?? item?.IsActive ?? item?.activationStatus ?? true;
    this.userID = item?.userID ?? item?.UserID ?? 0;
  }
}
