// @ts-nocheck
export class ReservationCappingLogModel {
  reservationCappingLogID: number;
  cappingType: string;
  userID: number;
  userName: string;
  vehicleID: number;
  vehicle: string;
  cityID: number;
  city: string;
  packageTypeID: number;
  packageType: string;
  pickUpDate: string;
  dateOfAttempt: string;
  customerGroupID: number;
  customerGroup: string;

  constructor(row) {
    this.reservationCappingLogID = row?.reservationCappingLogID ?? 0;
    this.cappingType = row?.cappingType ?? '';
    this.userID = row?.userID ?? 0;
    this.userName = row?.userName ?? '';
    this.vehicleID = row?.vehicleID ?? 0;
    this.vehicle = row?.vehicle ?? '';
    this.cityID = row?.cityID ?? 0;
    this.city = row?.city ?? '';
    this.packageTypeID = row?.packageTypeID ?? 0;
    this.packageType = row?.packageType ?? '';
    this.pickUpDate = row?.pickUpDate ?? '';
    this.dateOfAttempt = row?.dateOfAttempt ?? '';
    this.customerGroupID = row?.customerGroupID ?? 0;
    this.customerGroup = row?.customerGroup ?? '';
  }
}
