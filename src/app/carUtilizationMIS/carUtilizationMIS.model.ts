// @ts-nocheck
export class CarUtilizationReportSearchCriteria {
  pickupDateFrom: string | Date | null;
  pickupDateTo: string | Date | null;
  carNumbers: string;
  customerName: string;
  dutySlipIds: string;
  reservationIds: string;
  pageNumber: number;
}

export class CarUtilizationReportPagedResult {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  reportDates: string[];
  carRecords: CarUtilizationReportCarRow[];
  records: CarUtilizationReportRow[];
}

export class CarUtilizationReportCarRow {
  location: string;
  carNo: string;
  carName: string;
  carStatus: string;
  modeOfCar: string;
  dayMetrics: CarUtilizationReportDayMetric[];
}

export class CarUtilizationReportDayMetric {
  pickupDate: string | Date;
  numberOfDuties: number;
  totalKM: number;
  hrs: number;
  gpsKm: number;
}

export class CarUtilizationReportRow {
  location: string;
  carNo: string;
  carName: string;
  carStatus: string;
  modeOfCar: string;
  pickupDate: string | Date;
  numberOfDuties: number;
  totalKM: number;
  hrs: number;
  gpsKm: number;

  constructor(item?: Partial<CarUtilizationReportRow>) {
    this.location = item?.location ?? '';
    this.carNo = item?.carNo ?? '';
    this.carName = item?.carName ?? '';
    this.carStatus = item?.carStatus ?? '';
    this.modeOfCar = item?.modeOfCar ?? '';
    this.pickupDate = item?.pickupDate ?? null;
    this.numberOfDuties = item?.numberOfDuties ?? 0;
    this.totalKM = item?.totalKM ?? 0;
    this.hrs = item?.hrs ?? 0;
    this.gpsKm = item?.gpsKm ?? 0;
  }
}

/** @deprecated Legacy duty-level MIS row; retained for compatibility. */
export class CarUtilizationMIS {
  reservationID: number;
  bookingNo: string;
  dutySlipNo: string;
  registrationNumber: string;
  dutyDate: Date;
  dispatchLocation: string;
  driverName: string;
  carLocation: string;
  carNo: string;
  vehicle: string;
  ownedSupplier: string;
  locationHubID: number;
  locationHub: string;
  customerName: string;
  customerID: number;
  dutySlipID: number;
  supplierName: string;
  supplierType: string;
  guestName: string;
  serviceLocation: string;
  organizationalEntityName: string;

  constructor(carUtilizationMIS: any) {
    this.reservationID = carUtilizationMIS?.reservationID || 0;
    this.bookingNo = carUtilizationMIS?.bookingNo || '';
    this.dutySlipNo = carUtilizationMIS?.dutySlipNo || '';
    this.registrationNumber = carUtilizationMIS?.registrationNumber || '';
    this.dutyDate = carUtilizationMIS?.dutyDate ? new Date(carUtilizationMIS.dutyDate) : null;
    this.dispatchLocation = carUtilizationMIS?.dispatchLocation || '';
    this.driverName = carUtilizationMIS?.driverName || '';
    this.carLocation = carUtilizationMIS?.carLocation || '';
    this.carNo = carUtilizationMIS?.carNo || '';
    this.vehicle = carUtilizationMIS?.vehicle || '';
    this.ownedSupplier = carUtilizationMIS?.ownedSupplier || '';
    this.locationHubID = carUtilizationMIS?.locationHubID || 0;
    this.locationHub = carUtilizationMIS?.locationHub || '';
    this.customerName = carUtilizationMIS?.customerName || '';
    this.customerID = carUtilizationMIS?.customerID || 0;
    this.dutySlipID = carUtilizationMIS?.dutySlipID || 0;
    this.supplierName = carUtilizationMIS?.supplierName || '';
    this.supplierType = carUtilizationMIS?.supplierType || '';
    this.guestName = carUtilizationMIS?.guestName || '';
    this.serviceLocation = carUtilizationMIS?.serviceLocation || '';
    this.organizationalEntityName = carUtilizationMIS?.organizationalEntityName || '';
  }
}
