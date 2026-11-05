// @ts-nocheck
export class BookingRefusal {
  reservationRefusalID: number;
  customerID: number;
  customerName: string;
  cityID: number;
  cityName: string;
  /** DB column PackageTypeID stores PackageType.PackageTypeID */
  packageTypeID: number;
  dutyType: string;
  vehicleID: number;
  vehicle: string;
  pickUpDate: Date | string | null;
  pickUpDateString: string;
  pickUpTime: string;
  pickUpTimeString: string;
  locationID: number;
  locationName: string;
  remarks: string;
  userID: number;
  activationStatus: boolean;

  constructor(item?: any) {
    this.reservationRefusalID = item?.reservationRefusalID ?? item?.ReservationRefusalID ?? -1;
    this.customerID = item?.customerID ?? item?.CustomerID ?? 0;
    this.customerName = item?.customerName ?? item?.CustomerName ?? '';
    this.cityID = item?.cityID ?? item?.CityID ?? 0;
    this.cityName = item?.cityName ?? item?.CityName ?? '';
    this.packageTypeID = item?.packageTypeID ?? item?.PackageTypeID ?? 0;
    this.dutyType = item?.dutyType ?? item?.DutyType ?? '';
    this.vehicleID = item?.vehicleID ?? item?.VehicleID ?? 0;
    this.vehicle = item?.vehicle ?? item?.Vehicle ?? '';
    this.pickUpDate = item?.pickUpDate ?? item?.PickUpDate ?? null;
    this.pickUpDateString = item?.pickUpDateString ?? item?.PickUpDateString ?? '';
    this.pickUpTime = item?.pickUpTime ?? item?.PickUpTime ?? '';
    this.pickUpTimeString = item?.pickUpTimeString ?? item?.PickUpTimeString ?? '';
    if (!this.pickUpTimeString && this.pickUpTime) {
      const t = String(this.pickUpTime);
      this.pickUpTimeString = t.length >= 5 ? t.substring(0, 5) : t;
    }
    this.locationID = item?.locationID ?? item?.LocationID ?? 0;
    this.locationName = item?.locationName ?? item?.LocationName ?? '';
    this.remarks = item?.remarks ?? item?.Remarks ?? '';
    this.userID = item?.userID ?? item?.UserID ?? 0;
    this.activationStatus = this.parseActivationStatus(item);
  }

  private parseActivationStatus(item: any): boolean {
    if (item == null) {
      return true;
    }
    const raw = item.activationStatus ?? item.ActivationStatus;
    if (raw === true || raw === 1 || raw === '1' || raw === 'true' || raw === 'Active') {
      return true;
    }
    if (raw === false || raw === 0 || raw === '0' || raw === 'false' || raw === 'Deactive') {
      return false;
    }
    return true;
  }
}
