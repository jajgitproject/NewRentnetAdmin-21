// @ts-nocheck
import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IproofDocuments } from './IProofDocument';
import { DepartmentDropDown } from './departmentDropDown.model';
import { DesignationDropDown } from './designationDropDown.model';
import { ServiceTypeDropDown } from './serviceTypeDropDown.model';
import { SalutationDropDown } from './salutationDropDown.model';
import { VehicleCategoryDropDown } from './vehicleCategoryDropDown.model';
import { AdditionalServiceDropDown } from './additionalServiceDropDown.model';
import { CityGroupDropDown } from './cityGroupDropDown.model';
import { CurrencyDropDown } from './currencyDropDown.model';

import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { QualificationDropDown } from './qualificationDropDown.model';
import { GeoCountryDropDown } from './geoCountryDropDown.model';
import { SpotTypeDropDown } from '../spotInCity/spotTypeDropDown.model';
import { SpotInCityDropDown } from '../spotInCity/spotInCityDropDown.model';
import { GeoPointTypeDropDown } from '../geoPointType/geoPointTypeDropDown.model';
import { CountryDropDown } from './countryDropDown.model';
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';
import { SupplierDropDown } from '../organizationalEntity/supplierDropDown.model';
import { BankDropDown } from '../bankChargeConfig/bankDropDown.model';
import { BankBranchDropDown } from '../bankChargeConfig/bankBranchDropDown.model';
import { CardDropDown } from '../bankChargeConfig/cardDropDown.model';
import { CardProcessingChargeDropDown } from '../bankChargeConfig/cardProcessingChargeDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { OrganizationalEntityTypeDropDown } from '../organizationalEntityMessage/organizationalEntityTypeDropDown.model';
import { MessageTypeDropDown } from '../organizationalEntityMessage/messageTypeDropDown.model';
import { VehicleManufacturerDropDown } from '../vehicleManufacturer/vehicleManufacturerDropDown.model';
import { EmployeeDropDown, LocationDropDown } from '../employee/employeeDropDown.model';
import { UomDropDown } from './uomDropDown.model';
import { PaymentNetworkDropDown } from '../paymentNetwork/paymentNetworkDropDown.model';
import { CardTypeDropDown } from '../cardType/cardTypeDropDown.model';
import { BankBranchesDropDown } from './bankBranchesDropDown.model';
import { DocumentDropDown } from './documentDropDown.model';
import { CustomerDropDown } from '../supplierCustomerFixedForAllPercentage/customerDropDown.model';
import { ModeOfPaymentDropDown } from '../supplierContract/modeOfPaymentDropDown.model';
import { PaymentCycleDropDown } from '../supplierContract/paymentCycleDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierContractForDropDownModel, SupplierRateCardDropDown } from '../supplierRateCard/supplierRateCardDropDown.model';
import { CityTierDropDown } from '../cityTier/cityTierDropDown.model';
import { PackageDropDown } from './packageDropDown.model';
import { ColorDropDown } from '../color/colorDropDown.model';
import { FuelTypeDropDown } from '../fuelType/fuelTypeDropDown.model';
import { StateDropDown } from '../state/stateDropDown.model';
//import { DocumentDropDown } from './documentDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { CustomerDepartmentDropDown } from '../customerDepartment/customerDepartmentDropDown.model';
import { CustomerDesignationDropDown } from '../customerDesignation/customerDesignationDropDown.model';
import { CustomerContractDropDown } from '../customerContract/customerContractDropDown.model';
//import { CustomerContractCarCategoryDropDown } from '../customerContractCDCLocalRate/customerContractCarCategoryDropDown.model';
import { CustomerContractCityTiersDropDown } from '../customerContractCDCLocalRate/customerContractCityTiersDropDown.model';
import { CustomerContractCarCategoryDropDown } from '../customerContractCarCategory/customerContractCarCategoryDropDown.model';
import { CustomerContractCityTiers } from '../customerContractCityTiers/customerContractCityTiers.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { DriverGradeDropDown } from '../driverGrade/driverGradeDropDown.model';
import { SupplierVerificationDocumentsDropDown } from '../supplierVerificationDocuments/supplierVerificationDocumentsDropDown.model';
import { CustomerCustomerGroupDropDown } from '../customer/customerCustomerGroupDropDown.model';
import { CustomerPersonDropDown } from '../customerPerson/customerPersonDropDown.model';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
import { VehicleVehicleCategoryDropDown } from '../vehicle/vehicleVehicleCategoryDropDown.model';
import { ReservationSourceDropDown } from '../reservation/reservationSourceDropDown.model';
import { GoogleAddressDropDown } from '../reservation/googleAddressDropDown.model';
import { CustomerPersonDetailsDropDown } from '../passengerDetails/customerPersonDetailsDropDown.model';
import { ReservationStopDropDown } from '../passengerDetails/reservationStopDropDown.model';
import { SavedAddressDataDropDown } from '../reservation/savedAddressDataDropDown.model';
import { AcrisCodeDropDown } from '../acrisCode/acrisCodeDropDown.model';
import { ReservationCustomerDetails } from './reservationCustomerDetailsDropDown.model';
import { AllotmentDetails } from '../dutySlipQualityCheck/dutySlipQualityCheck.model';
import { DutyAllotmentDetails } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.model';
import { AuthService } from '../core/service/auth.service';
import { ParentMenuDropDown } from './parentMenuDropDown.model';
import { PageDropDown } from './pageDropDown.model';
import { PageAuditDropDown } from '../auditTrail/pageAuditDropDown.model';
import { RoleDropDown } from '../role/roleDropDown.model';
import { Reservation } from '../reservation/reservation.model';
import { CustomerReservationFields } from '../reservation/customerReservationField.model';
import { TollParkingTypeDropDown } from '../dutyTollParkingEntry/tollParkingDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';
import { CountryCodeDropDown } from './countryCodeDropDown.model';
import { CustomerConfigurationMessaging } from '../sendSMS/sendSMS.model';
import { MessageSourceDropDown } from './sourceDropDown.model';
import { ExpenseDropDown} from '../dutyExpense/expenseDropDown.model';
import { GSTPercentageDropDown } from '../dutyGSTPercentage/gSTPercentageDropDownModel';
import { InvoiceTemplateDropDown } from '../invoiceTemplate/invoiceTemplateDropDown.model';
import { DutySACCDropDown } from '../dutySAC/dutySACDropDownModel';
import { MobileEmailModel } from '../employee/employee.model';
import { CustomerAlertMessageTypeForDropDown } from '../customerAlertMessage/customerAlertMessage.model';
//import { AllotmentDetails } from '../dutySlipQualityChecked/dutySlipQualityCheckedBy.model';
import { TransmissionTypeDropDown } from '../transmissionType/transmissionTypeDropDown.model';
import { PaymentModel } from '../contractPaymentMapping/contractPaymentMappingDropDown.model';
import { AES, Utf8 } from 'crypto-es';
import { EmployeesDropDown } from '../feedBack/employeeDropDown.model';
import { DisputeTypeDropDown } from '../dispute/disputeTypeDropDown.model';
import { DriverInventoryAssociation } from '../driverInventoryAssociation/driverInventoryAssociation.model';
import { DriverInventoryAssociationDropDown } from '../driverInventoryAssociation/driverInventoryAssociationDropDown';
import { CSGSTPercentageDropDown, IGSTPercentageDropDown } from '../generateBillMain/generateBillMain.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { SalesPersonDropDownModel } from '../dutyRegister/dutyRegister.model';
import { SalesPersonModel } from '../bookingBackupMIS/bookingBackupMIS.model';
import { MonthlyBusinessReportDropDown } from '../monthlyBusinessReport/monthlyBusinessReportDropDown.model';
import moment from 'moment';
import { DutySlipDropDown } from '../incidence/dutySlipDropDown.model';
import { FuelTypeDropDwonModel } from '../fuelRate/fuelRate.model';
import { DriverOfficialIdentityNumberDD } from './driverOfficialIdentityNumberDD.model';
import { InventoryDropDown } from '../inventory/inventoryDropDown.model';
import { DebitTypeModel } from '../resolution/resolution.model';
import { AmenitieDropDown } from '../amenitie/amenitieDropDown.model';
import { VendorContractCityTiersDropDown } from '../vendorOutStationRoundTripRate/vendorContractCityTiersDropDown.model';
import { VendorContractCarCategoryDropDown } from '../vendorOutStationRoundTripRate/vendorContractCarCategoryDropDown.model';
import { BillingCycleNameDropDown } from '../billingCycleName/billingCycleNameDropDown.model';
import { BillingTypeDropDown } from '../billingType/billingTypeDropDown.model';
import { BusinessTypeDropDown } from '../customer/businessTypeDropDown.model';
import { LocationGroupDropDown } from '../locationGroup/locationGroupDropDown.model';
import { RuntimeConfigService } from '../core/service/runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  @Input() timeFrom;

  BaseURL: string;
  ImageURL: string;
  FormURL: string;
  UnlockEmployeeUrl: string;

  // In-memory cache for read-only dropdown/lookup endpoints. Populated lazily
  // on first call per key and reused across the whole app session to avoid
  // re-hitting the server on every page visit. Call `invalidateCache(key)` (or
  // `invalidateCache()` for all) after a create/update/delete that could make
  // the cached list stale.
  private _dropdownCache = new Map<string, Observable<any>>();

  private cachedGet<T>(key: string, factory: () => Observable<T>): Observable<T> {
    let cached = this._dropdownCache.get(key) as Observable<T> | undefined;
    if (!cached) {
      cached = factory().pipe(shareReplay({ bufferSize: 1, refCount: false }));
      this._dropdownCache.set(key, cached);
    }
    return cached;
  }

  public invalidateCache(key?: string): void {
    if (key) {
      this._dropdownCache.delete(key);
    } else {
      this._dropdownCache.clear();
    }
  }

  private subjectName = new Subject<any>(); //need to create a subject
  // User_API_URL: string;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private runtimeConfig: RuntimeConfigService
  ) {
    this.BaseURL = this.runtimeConfig.getBaseUrl();
    this.ImageURL = this.runtimeConfig.getImageUrl();
    this.FormURL = this.runtimeConfig.getFormUrl();
    this.UnlockEmployeeUrl = this.runtimeConfig.getUnlockEmployeeUrl();
  }

  getUserID(): number {
    return this.authService?.currentUserValue?.employee?.EmployeeID ?? 0;
  }

  getRoleID(): number {
    return 25;
  }

  getBaseURL(): string {
    return this.BaseURL;
  }

  getImageURL(): string {
    return this.ImageURL;
  }

  getTodaysDate(): Date {
    return new Date();
  }

  //---------- Convert Hours To Minutes ---------
  convertHoursToMinutes(hours: number)
  {
    if (hours < 0) 
    {
      throw new Error('Hours cannot be negative.');
    }
    else
    {
      return hours * 60;
    }
  }

  //---------- Convert Minutes To Hours ---------
  convertMinutesToHours(minutes: number)
  {
    if (minutes < 0) 
    {
      throw new Error('Minutes cannot be negative.');
    }
    else
    {
      return minutes / 60;
    }
  }
  
  resetDateiflessthan12(value : string)
{
  let toArray =  value.split("/");
  if(parseInt(toArray[0]) > 12)
  {
    return value;
  }
  if(parseInt(toArray[1]) <= 12)
  {

    let newDate = toArray[1]+ '/' + toArray[0] + '/' + toArray[2];
    return newDate;
  }
  return value;

}

dateValidator() {
  return (control: any) => {
    if (!control.value) {
      return null;
    }
    const isValid = moment(control.value, 'DD/MM/YYYY', true).isValid();
    return isValid ? null : { invalidDate: true };
  };
}

  customDateValidator = (control: any): { [key: string]: any } | null => {
    const dateValue = control.value;
    if (dateValue && !this.isValidCustomDate(dateValue)) {
      return { invalidDate: true };
    }
    return null;
  };
  
// Helper function to parse DD/MM/YYYY date format
public parseCustomDate(value: string): Date | null {
  const dateParts = value.split('/');
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are zero-indexed
    const year = parseInt(dateParts[2], 10);
    const parsedDate = new Date(year, month, day);
    // Check if the parsed date is valid and matches the input
    if (
      parsedDate.getDate() === day &&
      parsedDate.getMonth() === month &&
      parsedDate.getFullYear() === year
    ) {
      return parsedDate;
    }
  }
  return null;
}

// Helper function to validate date format without parsing
public isValidCustomDate(value: string): boolean {
  const regex = /^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return regex.test(value);
}
  
encrypt(value: string): string{
  return AES.encrypt(value, this.runtimeConfig.getCryptoSecretKey()).toString();
}

decrypt(textToDecrypt: string): string{
  // Guard against missing/invalid ciphertext. decoding garbage (or the
  // literal string "undefined" from decodeURIComponent(undefined)) throws
  // "Malformed UTF-8 data" and aborts whichever callback invoked decrypt.
  if (textToDecrypt === null || textToDecrypt === undefined || textToDecrypt === '' || textToDecrypt === 'undefined') {
    return '';
  }
  try {
    return AES.decrypt(textToDecrypt, this.runtimeConfig.getCryptoSecretKey()).toString(Utf8);
  } catch {
    return '';
  }
}

  getCurrentTime() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let time = hours +':'+ minutes +':'+ seconds
    return time;
  }

  getTimeFromS(validTo: Date) {
    var timeFrom = validTo.toString().split(' ');
    let dateTimeFrom = new Date(validTo);
    return dateTimeFrom.toString();
  }

  getTimeS(validFrom: Date) {
    var timeFrom = validFrom.toString().split(' ');
    let dateTimeFrom = new Date(validFrom);
    return dateTimeFrom.toString();
  }

  getTimeFrom(nightChargesTimeFrom: Date) {
    var timeFrom = nightChargesTimeFrom.toString().split(" ");
    let dateTimeFrom = new Date(nightChargesTimeFrom);
    return dateTimeFrom.toString();
  }

  getTimeTo(nightChargesTimeTo: Date) {
    var timeTo = nightChargesTimeTo.toString().split(" ");
    let dateTimeTo = new Date(nightChargesTimeTo);
    return dateTimeTo.toString();
  }

  getDateFrom(suggestiveRatesFromDate: Date) {
    var dateFrom = suggestiveRatesFromDate.toString().split(" ");
    let fromDate = new Date(suggestiveRatesFromDate);
    return fromDate.toString();
  }

  getDateTo(suggestiveRatesToDate: Date) {
    var timeTo = suggestiveRatesToDate.toString().split(" ");
    let toDate = new Date(suggestiveRatesToDate);
    return toDate.toString();
  }

  GetPackgeType(): Observable<PackageTypeDropDown[]> {
    return this.http.get<PackageTypeDropDown[]>(
      this.BaseURL + 'PackageType/ForDropDown'
    );
  }

  getTimeFromTo(nightChargeTimeFrom: Date) {
    var timeFrom = nightChargeTimeFrom.toString().split(" ");
    let dateTimeFrom = new Date(nightChargeTimeFrom);
    return dateTimeFrom.toString();
  }

  getTimeFroms(nightChargeTimeFrom: Date) {
    var timeFrom = nightChargeTimeFrom.toString().split(" ");
    let dateTimeFrom = new Date(nightChargeTimeFrom);
    return dateTimeFrom.toString();
  }
  getTimeToo(nightChargeTimeTo: Date) {
    var timeTo = nightChargeTimeTo.toString().split(" ");
    let dateTimeTo = new Date(nightChargeTimeTo);
    return dateTimeTo.toString();
  }

 getCityTiers(): Observable<CustomerContractCityTiers[]> {
    return this.http.get<CustomerContractCityTiers[]>(this.BaseURL + "CustomerContractCityTiers/ForDropDown");
  }

 getVehicleCategories(): Observable<CustomerContractCarCategoryDropDown[]> {
    return this.http.get<CustomerContractCarCategoryDropDown[]>(this.BaseURL + "CustomerContractCarCategory/ForDropDown");
  }

  getFromDate(fromDate: Date) {
    var timeFrom = fromDate.toString().split(' ');
    let dateTimeFrom = new Date(fromDate);
    return dateTimeFrom.toString();
  }
  getToDate(toDate: Date) {
    var timeFrom = toDate.toString().split(' ');
    let dateTimeFrom = new Date(toDate);
    return dateTimeFrom.toString();
  }

GetCitiessAl(): Observable<CityDropDown[]> {
    return this.http.get<CityDropDown[]>(this.BaseURL + "supplierContractCityPercentage/ForDropDownss");
  }
  GetCountryCode(): Observable<CountryCodeDropDown[]> {
    return this.http.get<CountryCodeDropDown[]>(this.BaseURL + "country/getCountryISDForDropDown");
  }

  GetCountryCodes(): Observable<CountryCodeDropDown[]> {
    return this.cachedGet('getCountryCodes', () =>
      this.http.get<CountryCodeDropDown[]>(this.BaseURL + "country/getCountryISOForDropDown"));
  }
  GetDisputeType(): Observable<DisputeTypeDropDown[]> {
    return this.http.get<DisputeTypeDropDown[]>(this.BaseURL + "dutySlipForBilling/DisputeTypeDropDown");
  }
  
  GetStatesAl(): Observable<StateDropDown[]> {
    return this.http.get<StateDropDown[]>(this.BaseURL + "state/ForDropDown");
  }

  GetFuelType(): Observable<FuelTypeDropDwonModel[]> {
    return this.http.get<FuelTypeDropDwonModel[]>(this.BaseURL + "fuelRate/getFuelTypeForDropDown");
  }

  GetPackageTypes(): Observable<PackageTypeDropDown[]> {
    return this.http.get<PackageTypeDropDown[]>(this.BaseURL + "PackageType/ForPackageTypeDropDown");
  }

  GetCurrency(): Observable<CurrencyDropDown[]> {
    return this.http.get<CurrencyDropDown[]>(this.BaseURL + "currency/ForDropDown");
  }

  GetExpense(): Observable<ExpenseDropDown[]> {
    return this.http.get<ExpenseDropDown[]>(this.BaseURL + "expense/ExpenseForDropDown");
  }

  GetTollParkingType(): Observable<TollParkingTypeDropDown[]> {
    return this.http.get<TollParkingTypeDropDown[]>(this.BaseURL + "dutyTollParkingEntry/ForDropDown");
  }

  GetViewRequiredDocument(supplierID: number): Observable<DocumentDropDown[]> {
     
    if (supplierID == 0) {
      return this.http.get<DocumentDropDown[]>(this.BaseURL + "supplierVerificationStatusHistory/ForDropDowns");
    }
    else {
     
      return this.http.get<DocumentDropDown[]>(this.BaseURL + "supplierVerificationStatusHistory/ForDropDowns/" + supplierID);
    }

  }

  GetCustomerKAMForRG(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(
      this.BaseURL + 'employee/ForCustomerKAMDropDowns'
    );
  }

  GetSalesManagerForRG(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(
      this.BaseURL + 'employee/ForSalesExecutiveDropDowns'
    );
  }
  GetSalesManager(customerID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customer/GetSalesManager/"+customerID);
  }
  GetCustomerKam(customerID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customer/GetCustomerKAM/"+customerID);
  }

  GetCustomerAlertMessage(customerID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customer/GetCustomerAlertMessage/"+customerID);
  }
  getMessageSource(): Observable<MessageSourceDropDown[]> {
    return this.http.get<MessageSourceDropDown[]>(this.BaseURL + "messagingLogs/GetMessageSource");
  }

  getTransmissionType():Observable<TransmissionTypeDropDown[]>{
    return this.http.get<TransmissionTypeDropDown[]>(this.BaseURL + "TransmissionType/ForDropDown");
  }

  GetPackages(): Observable<PackageDropDown[]> {
    return this.http.get<PackageDropDown[]>(this.BaseURL + "Package/ForDropDown");
  }

  GetPackageForCDC(PackageType:number): Observable<PackageDropDown[]> {
    return this.http.get<PackageDropDown[]>(this.BaseURL + "Package/PackageForCDCLocalRate/"+PackageType);
  }
  GetRegNoForDropDown(): Observable<InventoryDropDown[]> {
    return this.http.get<InventoryDropDown[]>(this.BaseURL + "Inventory/ForDropDown");
  }

  GetInventoryForDropDown(): Observable<VehicleDropDown[]> {
    return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/getInventoryForDropDown");
  }
  
 GetRegistrationForDropDown(): Observable<RegistrationDropDown[]> {
  return this.http.get<RegistrationDropDown[]>(this.BaseURL + "interstateTaxEntry/ForDropDown");
}

  GetPackagesForReservation(packageTypeID:number,packageType:string,contractID:any): Observable<PackageDropDown[]> {
    const words = packageType.split(' ');
    const lastWord = words.pop(); // Remove and get the last word
    const restOfString = words.join(' ');
    console.log(this.BaseURL + "Package/getPackagesForReservation/"+packageTypeID+"/"+restOfString+"/"+contractID)
    return this.http.get<PackageDropDown[]>(this.BaseURL + "Package/getPackagesForReservation/"+packageTypeID+"/"+restOfString+"/"+contractID);
  }

  GetCityTiers(): Observable<CityTierDropDown[]> {
    return this.http.get<CityTierDropDown[]>(this.BaseURL + "CityTier/ForDropDown");
  }

  GetCCCityTiers(): Observable<CustomerContractCityTiersDropDown[]> {
    return this.http.get<CustomerContractCityTiersDropDown[]>(this.BaseURL + "CustomerContractCityTiers/ForDropDown");
  }

  GetCCCityTiersForCD(CustomerContractID:number): Observable<CustomerContractCityTiersDropDown[]> {
    return this.http.get<CustomerContractCityTiersDropDown[]>(this.BaseURL + "CustomerContractCityTiers/ForCityTiers/"+CustomerContractID);
  }
   GetVendorCityTiersForCD(VendorContractID:number): Observable<VendorContractCityTiersDropDown[]> {
    return this.http.get<VendorContractCityTiersDropDown[]>(this.BaseURL + "CustomerContractCityTiers/ForVendorCityTiers/"+VendorContractID);
  }
  getPaymentModeByContractID(ContractID:number): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(this.BaseURL + "ContractPaymentMapping/GetAllModeOfPayment/"+ContractID);
  }
 
    getPaymentModeByVendorContractID(VendorContractID:number): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(this.BaseURL + "VendorContractPaymentMapping/GetAllModeOfPayment/"+VendorContractID);
  }

  GetSpotInCity(): Observable<SpotInCityDropDown[]> {
      return this.http.get<SpotInCityDropDown[]>(this.BaseURL + "spotInCity/ForDropDown");
    }
  GetRateList(): Observable<SupplierRateCardDropDown[]> {
    return this.http.get<SupplierRateCardDropDown[]>(this.BaseURL + "supplierRateCard/ForDropDown");
    
  }

  GetSupplierContract(): Observable<SupplierContractForDropDownModel[]> {
    return this.http.get<SupplierContractForDropDownModel[]>(this.BaseURL + "supplierRateCardSupplierMapping/ForDropDown");
    
  }
  getDocument(): Observable<DocumentDropDown[]>{
    return this.http.get<DocumentDropDown[]>(this.BaseURL + "document/ForDropDown");
  }

  GetSpotCity(): Observable<SpotTypeDropDown[]> {
    return this.http.get<SpotTypeDropDown[]>(this.BaseURL + "spotInCity/ForDropDowns");
  }

  GetGeoPointTypes(): Observable<GeoPointTypeDropDown[]> {
    return this.http.get<GeoPointTypeDropDown[]>(this.BaseURL + "geoPointType/ForDropDown");
  }

  GetGeoPointTypeForReservation(): Observable<GeoPointTypeDropDown[]> {
    return this.http.get<GeoPointTypeDropDown[]>(this.BaseURL + "geoPointType/getGeoPointTypeForReservation");
  }

  GetBank(): Observable<BankDropDown[]>{
    return this.http.get<BankDropDown[]>(this.BaseURL + "bank/ForDropDown");
  }

  GetReservationSource(): Observable<ReservationSourceDropDown[]>{
    return this.http.get<ReservationSourceDropDown[]>(this.BaseURL + "reservationSource/ForDropDown");
  }

  GetGeoPointName(geoPointTypeID: number): Observable<StatesDropDown[]> {
    if (geoPointTypeID == 0) {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/ForPickupSpotDropDown");
    }
    else {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/ForPickupSpotDropDown/" + geoPointTypeID);
    }

  }
  GetSalesPersonForBookingMIS(): Observable<SalesPersonModel[]>{
    return this.http.get<SalesPersonModel[]>(this.BaseURL + "bookingBackupMIS/getSalesPerson");
  }

  GetPickupSpotForReservation(GeoPointTypeID:number): Observable<StatesDropDown[]> {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/PickupSpotForReservation/" + GeoPointTypeID);

  }
  //  GetVendorData(vendorID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.User_API_URL + '/'+ vendorID);
  // }
  
  getSeviceName(serviceID: number): Observable<AdditionalServiceDropDown[]> {
    if (serviceID === 0 || serviceID === undefined) {
      return this.http.get<AdditionalServiceDropDown[]>(this.BaseURL + "additionalService/AdditionalServiceDropDown");
    }
    else {
      return this.http.get<AdditionalServiceDropDown[]>(this.BaseURL + "additionalService/AdditionalServiceDropDown/" + serviceID);
    }

  }
  GetAllotmentInfo(): Observable<AllotmentDetails[]> {
    return this.http.get<AllotmentDetails[]>(this.BaseURL + "dutySlipQualityCheck/getAllotmentInfo");
  }
  GetDutyAllotmentInfo(dutyQualityCheckList:number): Observable<DutyAllotmentDetails[]> {
    return this.http.get<DutyAllotmentDetails[]>(this.BaseURL + "dutySlipQualityCheckByExecutive/getAllotmentInfo/"+dutyQualityCheckList);
  }
  GetDutyQualityCheckID(allotmentID:number): Observable<DutyAllotmentDetails> {
    return this.http.get<DutyAllotmentDetails>(this.BaseURL + "dutySlipQualityCheckByExecutive/getDutyQualityCheckID/"+allotmentID);
  }

  getPickupStop(reservationID:number): Observable<ReservationStopDropDown[]> {
    return this.http.get<ReservationStopDropDown[]>(this.BaseURL + "ReservationPassenger/ForPickupStopDropDown/"+reservationID);
  }
  getGoogleAddress(): Observable<GoogleAddressDropDown[]> {
    return this.http.get<GoogleAddressDropDown[]>(this.BaseURL + "GoogleAddress/ForDropDown");
  }
  
  getCustomerPersonDetails(): Observable<CustomerPersonDetailsDropDown[]> {
    return this.http.get<CustomerPersonDetailsDropDown[]>(this.BaseURL + "ReservationPassenger/ForCustomerPersonDetailsDropDown");
  }

  GetEmployeeMobile(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "employee/GetEmployeeMobile");
  }
  
  GetCustomerPersonMobileNo(): Observable<CustomerPersonDropDown[]> {
    return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "customerPerson/GetCustomerPersonMobile");
  }
  
  getDropOffStop(): Observable<ReservationStopDropDown[]> {
    return this.http.get<ReservationStopDropDown[]>(this.BaseURL + "ReservationPassenger/ForDropOffStopDropDown");
  }
  
  GetCityID(name: string): any {
      const xhr = new XMLHttpRequest();
      let result;
      var url = this.BaseURL + 'Reservation/getCityID/' + name;
      xhr.open('GET', url, false); // Set the third parameter to 'false' for synchronous request
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          result = JSON.parse(xhr.responseText);
        }
      };
      xhr.send();
      return result;
    }

    GetsCityID(cityName: string): any {
      //return this.http.get<CityDropDown[]>(this.BaseURL + "ReservationStopDetails/getCityID/" + cityName);
      const xhr = new XMLHttpRequest();
      let result;
      var url = this.BaseURL + 'ReservationStopDetails/getCityID/' + cityName;
      xhr.open('GET', url, false); // Set the third parameter to 'false' for synchronous request
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          result = JSON.parse(xhr.responseText);
        }
      };
      xhr.send();
      return result;
    }

  getUOM(uomID: number): Observable<UomDropDown[]> {
    if (uomID == 0) {
      return this.http.get<UomDropDown[]>(this.BaseURL + "uOM/UomForDropDown");
    }
    else {
      return this.http.get<UomDropDown[]>(this.BaseURL + "uOM/UomForDropDown/" + uomID);
    }

  }

  getPassengerData(passengerID: number): Observable<SavedAddressDataDropDown[]> {
    if (passengerID == 0) {
      return this.http.get<SavedAddressDataDropDown[]>(this.BaseURL + "savedAddress/ForSavedAddressDropDown");
    }
    else {
      return this.http.get<SavedAddressDataDropDown[]>(this.BaseURL + "savedAddress/ForSavedAddressDropDown/" + passengerID);
    }

  }
  getCustomerDepartments(): Observable<CustomerDepartmentDropDown[]> {
    return this.http.get<CustomerDepartmentDropDown[]>(this.BaseURL + "CustomerDepartment/ForDropDown");
  }
  GetCustomerPersonMobile(): Observable<CustomerPersonDropDown[]> {
    return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/getPassengerForMobile");
  }

  getEmployeeMobile(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "Employee/getPassengerForMobile");
  }

  getEmployeeEmail(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "Employee/GetPassengerGorEmail");
  }

  getCustomerPersonEmail(): Observable<CustomerPersonDropDown[]> {
    return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/getPassengerForEmail");
  }
  getCustomerDesignations(): Observable<CustomerDesignationDropDown[]> {
    return this.http.get<CustomerDesignationDropDown[]>(this.BaseURL + "customerDesignation/ForDropDown");
  }

  getEmployeeID(employeeID: number): Observable<EmployeeDropDown[]> {
    if (employeeID == 0) {
      return this.http.get<EmployeeDropDown[]>(this.BaseURL + "employee/EmployeeForDropDown");
    }
    else {
      
      return this.http.get<EmployeeDropDown[]>(this.BaseURL + "employee/EmployeeForDropDown/" + employeeID);
    }

  }
  GetBankBranch(): Observable<BankBranchDropDown[]>{
    return this.http.get<BankBranchDropDown[]>(this.BaseURL + "bankChargeConfig/ForBankBranchDropDown");
  }
  GetBankBranches(bankID: number): Observable<BankBranchDropDown[]> {
    if (bankID == 0) {
      return this.http.get<BankBranchDropDown[]>(this.BaseURL + "bankBranch/BankBranchForDropDown");
    }
    else {
      
      return this.http.get<BankBranchDropDown[]>(this.BaseURL + "bankBranch/BankBranchForDropDown/" + bankID);
    }

  }
  GetDriverGrade(): Observable<DriverGradeDropDown[]>{
    return this.http.get<DriverGradeDropDown[]>(this.BaseURL + "driverGrade/ForDropDown");
  }

  GetCard(): Observable<CardDropDown[]>{
    return this.http.get<CardDropDown[]>(this.BaseURL + "card/ForDropDown");
  }

  GetCustomers(): Observable<CustomerDropDown[]>{
    return this.http.get<CustomerDropDown[]>(this.BaseURL + "supplierCustomerFixedForAllPercentage/ForDropDown");
  }

  GetCustomersForCP(customerGroupID:number): Observable<CustomerDropDown[]>{
    return this.http.get<CustomerDropDown[]>(this.BaseURL + "customer/getCustomerForCP/"+customerGroupID);
  }

  GetCustomersGroups(): Observable<CustomerGroupDropDown[]>{
    return this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "customerGroup/ForDropDown");
  }

  getCustomers(): Observable<CustomerDropDown[]>{
    return this.http.get<CustomerDropDown[]>(this.BaseURL + "customer/ForDropDown");
  }

  GetCustomersForCPSearch(customerGroupID:number): Observable<CustomerDropDown[]>{
    return this.http.get<CustomerDropDown[]>(this.BaseURL + "customer/getCustomerForCPSearch/"+customerGroupID);
  }

  GetOrganizationalEntity(): Observable<OrganizationalEntityDropDown[]>{
    return this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForDropDown");
  }

  getVehicleBasedOnInventoryID(inventoryID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "vehicle/getVehicleBasedOnInventoryID/" +inventoryID);
  }

  GetLutForBranch(organizationalEntityID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "organizationalEntity/getLutForCompanyBranch/"+organizationalEntityID);
  }

  getPackageTypeByContractID(customerContractID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "contractPackageTypeMapping/getPackageType/" +customerContractID);
  }
   getPackageTypeByVendorID(vendorContractID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "contractPackageTypeMapping/GetVendorPackageType/" +vendorContractID);
  }

  GetCustomerFieldsBasedOnCustomerID(customerID:number): Observable<CustomerReservationFields[]> 
  {
    return this.http.get<CustomerReservationFields[]>(this.BaseURL + "customerReservationFields/getCustomerFieldsBasedOnCustomerID/"+customerID);
  }

  GetCustomerRentNetFieldsBasedOnCustomerID(customerID:number): Observable<CustomerReservationFields[]> 
  {
    return this.http.get<CustomerReservationFields[]>(this.BaseURL + "customerReservationFields/getCustomerRentNetFieldsBasedOnCustomerID/"+customerID);
  }

  GetFeedBack(reservationID:number): Observable<EmployeesDropDown[]> 
  {
    return this.http.get<EmployeesDropDown[]>(this.BaseURL + "feedBack/GetFeedbackByEmployee/"+reservationID);
  }

  SupplierForOwnershipOfOE(): Observable<SupplierDropDown[]>{
    return this.http.get<SupplierDropDown[]>(this.BaseURL + "supplier/supplierForOwnershipOfOE");
  }
   SupplierForInternal(): Observable<SupplierDropDown[]>{
    return this.http.get<SupplierDropDown[]>(this.BaseURL + "supplier/GetSupplierForOwned");
  }
   SupplierForExternal(): Observable<SupplierDropDown[]>{
    return this.http.get<SupplierDropDown[]>(this.BaseURL + "supplier/GetSupplierForSupplier");
  }

  EmployeeDropDownBasedOnLocation(EmployeeID:number): Observable<LocationDropDown[]>{
    return this.http.get<LocationDropDown[]>(this.BaseURL + "employee/getLocationForDropDown/" + EmployeeID);
  }

  DuplicateMobile(Mobile:string): Observable<MobileEmailModel>{
    return this.http.get<MobileEmailModel>(this.BaseURL + "employee/checkDuplicateMobile/" + Mobile);
  }
nameEmailDuplicateMobile(payload: {
  name: string;
  mobile: string;
  email: string;
  customerGroupID: string;
}): Observable<MobileEmailModel> {
  return this.http.post<MobileEmailModel>(
    this.BaseURL + "customerperson/check-duplicate",
    payload
  );
}

   DuplicateMobileForDriver(Mobile1:string): Observable<MobileEmailModel>{
    return this.http.get<MobileEmailModel>(this.BaseURL + "driver/checkDuplicateMobile/" + Mobile1);
  }

  DuplicateEmail(Email:string): Observable<MobileEmailModel>{
    return this.http.get<MobileEmailModel>(this.BaseURL + "employee/checkDuplicateEmail/" + Email);
  }
  
  // GetDocumentRequired(): Observable<SupplierVerificationDocumentsDropDown[]> {
  //   return this.http.get<SupplierVerificationDocumentsDropDown[]>(this.BaseURL + "SupplierVerificationDocuments/ForDropDown");
  // } 

  GetDocumentRequired(): Observable<DocumentDropDown[]> {
    return this.http.get<DocumentDropDown[]>(this.BaseURL + "Document/ForDropDownRequired");
  } 

  // GetOrganizationalEntityType(): Observable<OrganizationalEntityTypeDropDown[]>{
  //   return this.http.get<OrganizationalEntityTypeDropDown[]>(this.BaseURL + "organizationalEntity/ForDropDown");
  // }

  GetMessageType(): Observable<MessageTypeDropDown[]>{
    return this.http.get<MessageTypeDropDown[]>(this.BaseURL + "messageType/ForDropDown");
  }

  GetCardProcessingCharge(): Observable<CardProcessingChargeDropDown[]>{
    return this.http.get<CardProcessingChargeDropDown[]>(this.BaseURL + "cardProcessingCharge/ForDropDown");
  }

  GetCountries(parentID: number): Observable<CountryDropDown[]> {
    if (parentID == 0) {
      return this.http.get<CountryDropDown[]>(this.BaseURL + "city/CountryForDropDown");
    }
    else {
      return this.http.get<CountryDropDown[]>(this.BaseURL + "City/CountryForDropDown/" + parentID);
    }

  }

  GetCountryForOE(stateID: number): Observable<CountryDropDown[]> {
    if (stateID == 0) {
      return this.http.get<CountryDropDown[]>(this.BaseURL + "State/ForCountryDropdownInOE");
    }
    else {
      return this.http.get<CountryDropDown[]>(this.BaseURL + "State/ForCountryDropdownInOE/" + stateID);
    }

  }

  GetCity(stateID: number): Observable<CityDropDown[]> {
    if (stateID == 0) {
      return this.http.get<CityDropDown[]>(this.BaseURL + "city/CityDropDown");
    }
    else {
      return this.http.get<CityDropDown[]>(this.BaseURL + "city/CityDropDown/" + stateID);
    }

  }

  // getTimeFromS(dob: Date) {
  //   var timeFrom = dob.toString().split(' ');
  //   let dateTimeFrom = new Date(dob);
  //   return dateTimeFrom.toString();
  // }
  getTimeApplicable(applicableFrom: Date) {
    var timeFrom = applicableFrom?.toString().split(' ');
    let dateTimeFrom = new Date(applicableFrom);
    return dateTimeFrom.toString();
  }
  getTimeApplicableTO(applicableTo: Date) {
    var timeFrom = applicableTo?.toString().split(' ');
    let dateTimeFrom = new Date(applicableTo);
    return dateTimeFrom.toString();
  }
  GetGeoPoint(): Observable<GeoCountryDropDown[]> {
    return this.http.get<GeoCountryDropDown[]>(this.BaseURL + "State/ForDropDowns");
  }
  GetAllGeoPointData(): Observable<CountryDropDown[]> {
    return this.http.get<CountryDropDown[]>(this.BaseURL + "Country/ForDropDown");
  }
  GetQualification(): Observable<QualificationDropDown[]> {
    return this.http.get<QualificationDropDown[]>(
      this.BaseURL + 'Qualification/ForDropDown'
    );
  }
  GetCurrencies(): Observable<CurrencyDropDown[]> {
    return this.http.get<CurrencyDropDown[]>(
      this.BaseURL + 'Currency/ForDropDown'
    );
  }

  GetDesignations(): Observable<DesignationDropDown[]> {
    return this.http.get<DesignationDropDown[]>(this.BaseURL + "Designation/ForDropDown");
  }

  GetDepartments(): Observable<DepartmentDropDown[]> {
    return this.http.get<DepartmentDropDown[]>(this.BaseURL + "Department/ForDropDown");
  }

  GetIncidenceTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "IncidenceType/ForDropDown");
  }
  GetEmployee(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(
      this.BaseURL + 'employee/ForDropDowns'
    );
  }

  GetEmployeesForSupplierContract(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(
      this.BaseURL + 'supplierContract/ForEmployeeDropDown'
    );
  }
  GetCustomerContract(): Observable<CustomerContractDropDown[]> {
    return this.http.get<CustomerContractDropDown[]>(
      this.BaseURL + 'customerContract/ForDropDown'
    );
  }

  GetDriver(): Observable<DriverDropDown[]> {
    return this.http.get<DriverDropDown[]>(
      this.BaseURL + 'customerPersonDriverRestriction/ForDropDown'
    );
  }

  getDriverMIS(): Observable<DriverDropDown[]> {
    return this.http.get<DriverDropDown[]>(
      this.BaseURL + 'driverMIS/ForDropDown'
    );
  }

  GetGSTPercentage(): Observable<GSTPercentageDropDown[]> {
    return this.http.get<GSTPercentageDropDown[]>(
      this.BaseURL + 'dutyGSTPercentage/GSTPercentageForDropDown/');
  }

  GetSAC(): Observable<DutySACCDropDown[]> {
    return this.http.get<DutySACCDropDown[]>(
      this.BaseURL + 'sac/getSACForDropDown/');
  }

  GetEmployeesForVehicleCategory(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(
      this.BaseURL + 'supplierContract/ForEmployeeDropDown'
    );
  }
  GetModeOfPayment(): Observable<ModeOfPaymentDropDown[]> {
    return this.http.get<ModeOfPaymentDropDown[]>(
      this.BaseURL + 'supplierContract/ForModeOfPaymentDropDown'
    );
  }

  GetPaymentCycle(): Observable<PaymentCycleDropDown[]> {
    return this.http.get<PaymentCycleDropDown[]>(
      this.BaseURL + 'supplierContract/ForPaymentCycleDropDown'
    );
  }

  GetUOM(): Observable<UomDropDown[]> {
    return this.http.get<UomDropDown[]>(this.BaseURL + 'uOM/ForDropDown');
  }

  GetCitiessAll(): Observable<CityDropDown[]> {
    return this.http.get<CityDropDown[]>(this.BaseURL + "additionalServiceRate/ForDropDowns" );
  }

  GetCitiessAlls(CustomerContractCityTiersID:number): Observable<CityDropDown[]> {
    return this.http.get<CityDropDown[]>(this.BaseURL + "additionalServiceRate/ForDropsDowns/" +CustomerContractCityTiersID);
  }

  GetDutySlip(reservationID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "incidence/ForDropsDowns/" +reservationID);
  }

   getPassenger(reservationID:number): Observable<any[]> {

    return this.http.get<any[]>(this.BaseURL + "incidence/ForDropsDown/" +reservationID);
  }

  GetPaytmentNetwork(): Observable<PaymentNetworkDropDown[]> {
    return this.http.get<PaymentNetworkDropDown[]>(this.BaseURL + "PaymentNetwork/ForDropDown");
  }

  getIncidenceType(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "incidenceType/ForDropDown");
  }

  getIssueCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "issueCategory/ForDropDown");
  }
  GetCarType(): Observable<CardTypeDropDown []> {
    return this.http.get<CardTypeDropDown []>(this.BaseURL + "CardType/ForDropDown");
  }

  GetBranch(): Observable<BankBranchesDropDown []> {
    return this.http.get<BankBranchesDropDown []>(this.BaseURL + "bankBranch/ForDropDown");
  }

  GetReportingManager(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "Employee/ForDropDowns");
  }

  GetSupplier(): Observable<SupplierDropDown[]> {
    return this.http.get<SupplierDropDown[]>(
      this.BaseURL + 'Employee/ForDropDown'
    );
  }

  GetRole(): Observable<RoleDropDown[]> {
    return this.http.get<RoleDropDown[]>(
      this.BaseURL + 'Role/ForDropDowns'
    );
  }

GetPages(): Observable<PageDropDown[]> {
  return this.http.get<ParentMenuDropDown[]>(
    this.BaseURL + 'page/ForDropDown'
  );
}

GetPagesForAudit(): Observable<PageAuditDropDown[]> {
  return this.http.get<PageAuditDropDown[]>(
    this.BaseURL + 'page/ForAuditDropDown'
  );
}

GetRoleForPage(RoleID: any): Observable<any[]> 
{
  return this.http.get<any[]>(this.BaseURL + "role/GetRoleForPage/" + RoleID);
}
GetRoleForPageGroup(RoleID: any,PageGroupID:any): Observable<any[]> 
{
  return this.http.get<any[]>(this.BaseURL + "role/GetRoleForPageGroup/" + RoleID +'/'+PageGroupID);
}

GetParentMenus(): Observable<ParentMenuDropDown[]> {
  return this.http.get<ParentMenuDropDown[]>(
    this.BaseURL + 'page/ParentMenuForDropDown'
  );
}

  getDocumentRequired(): Observable<DocumentDropDown[]> {
    return this.http.get<DocumentDropDown[]>(this.BaseURL + "Document/ForDropDown");
  } 

    getDocumentRequiredforDriver(): Observable<DocumentDropDown[]> {
    return this.http.get<DocumentDropDown[]>(this.BaseURL + "Document/GetDocumentForDropDowns");
  } 
  GetAllSuppliers(): Observable<SupplierDropDown[]> {
    return this.http.get<SupplierDropDown[]>(
      this.BaseURL + 'Supplier/ForDropDown'
    );
  }

  GetCities(stateID: number): Observable<CityDropDown[]> {
    if (stateID == 0) {
      return this.http.get<CityDropDown[]>(this.BaseURL + "city/CityDropDown");
    }
    else {
      return this.http.get<CityDropDown[]>(this.BaseURL + "city/CityDropDown/" + stateID);
    }

  }

  GetPickupAndDropOffCities(contractID: any,packageID:any): Observable<CityDropDown[]>
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCities/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForLocalLumpsum(contractID: any,packageID:any ): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForLocalLumpsum/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForLocalOnDemand(contractID: any,packageID:any): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForLocalOnDemand/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForLocalTransfer(contractID: any,packageID:any): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForLocalTransfer/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForLongTermRental(contractID: any,packageID:any  ): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForLongTermRental/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForOutStationLumpsum(contractID: any,packageID:any): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForOutStationLumpsum/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForOutStationOneWayTrip(contractID: any,packageID:any): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForOutStationOneWayTrip/" + contractID +"/"+packageID);
  }

  GetPickupAndDropOffCitiesForOutStationRoundTrip(contractID: any,packageID:any): Observable<CityDropDown[]> 
  {
    return this.http.get<CityDropDown[]>(this.BaseURL + "city/getPickupAndDropOffCitiesForOutStationRoundTrip/" + contractID +"/"+packageID);
  }

  GetVehicleBasedOnContractID(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]>
  {
    return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractID/" + contractID+"/"+PackageID);
  }

GetVehicleBasedOnContractIDForLocalLumpsum(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForLocalLumpsum/" + contractID+"/"+PackageID);
}

GetVehicleBasedOnContractIDForLocalOnDemand(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForLocalOnDemand/" + contractID+"/"+PackageID);
}

GetVehicleBasedOnContractIDForLocalTransfer(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForLocalTransfer/" + contractID+"/"+PackageID);
}

GetVehicleBasedOnContractIDForLongTermRental(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForLongTermRental/" + contractID+"/"+PackageID);
}

GetVehicleBasedOnContractIDForOutStationLumpsum(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForOutStationLumpsum/" + contractID+"/"+PackageID);
}

GetVehicleBasedOnContractIDForOutStationOneWayTrip(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForOutStationOneWayTrip/" + contractID+"/"+PackageID);
}

GetVehicleBasedOnContractIDForOutStationRoundTrip(contractID: any,PackageID:number): Observable<VehicleVehicleCategoryDropDown[]> 
{
  return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "vehicle/getVehicleBasedOnContractIDForOutStationRoundTrip/" + contractID+"/"+PackageID);
}

  GetDDLData(DLID: number): Observable<CityDropDown[]> {
     
    if (DLID == 0) {
      return this.http.get<CityDropDown[]>(this.BaseURL + "driverDrivingLicenseVerification/ForDropDown");
    }
    else {
      return this.http.get<CityDropDown[]>(this.BaseURL + "driverDrivingLicenseVerification/" + DLID);
    }

  }

  GetAdditionalServices(): Observable<AdditionalServiceDropDown[]> {
    return this.http.get<AdditionalServiceDropDown[]>(this.BaseURL + "AdditionalService/ForDropDown");
  }
  GetServiceType(): Observable<ServiceTypeDropDown[]> {
    return this.http.get<ServiceTypeDropDown[]>(this.BaseURL + "ServiceType/ForDropDown");
  } 
  GetDocument(): Observable<DocumentDropDown[]> {
    return this.http.get<DocumentDropDown[]>(this.BaseURL + "Document/ForDropDown");
  } 
  GetSalutations(): Observable<SalutationDropDown[]> {
    return this.http.get<SalutationDropDown[]>(this.BaseURL + "Salutation/ForDropDown");
  }

  GetCustomerDesignation(): Observable<CustomerDesignationDropDown[]> {
    return this.http.get<CustomerDesignationDropDown[]>(this.BaseURL + "CustomerDesignation/ForDropDown");
  }

  GetCustomerDepartment(): Observable<CustomerDepartmentDropDown[]> {
    return this.http.get<CustomerDepartmentDropDown[]>(this.BaseURL + "CustomerDepartment/ForDropDown");
  }

  // GetDesignations(): Observable<DesignationDropDown[]> {
  //   return this.http.get<DesignationDropDown[]>(this.BaseURL + "Designation/ForDropDown");
  // }

  // GetDepartments(): Observable<DepartmentDropDown[]> {
  //   return this.http.get<DepartmentDropDown[]>(this.BaseURL + "Department/ForDropDown");
  // }
  getPackageForSettleRate(packageTypeID: number): Observable<PackageDropDown[]> {
    if (packageTypeID == 0) {
      return this.http.get<PackageDropDown[]>(this.BaseURL + "Package/ForPackageDropDown");
    }
    else {
     
      return this.http.get<PackageDropDown[]>(this.BaseURL + "Package/ForPackageDropDown/" + packageTypeID);
    }

  }
  
   GetEmployees(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "employee/ForDropDowns");
  }
    GetCustomerChangesKam(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "customerKAMChange/ForOLDKAMDropDown");
  }

    GetSalesChangesKam(): Observable<EmployeeDropDown[]> {
    return this.http.get<EmployeeDropDown[]>(this.BaseURL + "customerSalesManagerChange/ForOLDSalesManagerDropDown");
  }

  GetVehicleManufacturer(): Observable<VehicleManufacturerDropDown[]> {
    return this.http.get<VehicleManufacturerDropDown[]>(this.BaseURL + "VehicleManufacturer/ForDropDown");
  }

  getState(): Observable<CountryDropDown[]> {
    return this.http.get<CountryDropDown[]>(this.BaseURL + "city/ForDropDowns");
  }
  getInvoice(): Observable<InvoiceTemplateDropDown[]> {
    return this.http.get<InvoiceTemplateDropDown[]>(this.BaseURL + "customerInvoiceTemplate/GetinvoiceTemplate");
  }

  getStateForInterstateTax(): Observable<StateDropDown[]> {
    return this.http.get<StateDropDown[]>(this.BaseURL + "city/ForDropDowns");
  }

  GetStates(countryID: number): Observable<StatesDropDown[]> {
    
    if (countryID == 0) {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/ForDropDownStates");
    }
    else {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/ForDropDownStates/" + countryID);
    }

  }

  GetStateOnCity(cityID: number): Observable<StatesDropDown[]> {
    if (cityID == 0) {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/ForStateDropdownInOE");
    }
    else {
      return this.http.get<StatesDropDown[]>(this.BaseURL + "State/ForStateDropdownInOE/" + cityID);
    }

  }

  GetContractIDBasedOnDate(CustomerID: number,EndDate:string): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customerContractMapping/getContractIDBasedOnDate/" + CustomerID+"/"+ EndDate);
  }

  GetCustomerAndPassenger(reservationID: number): Observable<ReservationCustomerDetails[]> {
    return this.http.get<ReservationCustomerDetails[]>(this.BaseURL + "reservation/GetCustomerDetailsAndPassenger/" + reservationID);
  }

  GetCustomerAndBooker(reservationID: number): Observable<ReservationCustomerDetails[]> {
    return this.http.get<ReservationCustomerDetails[]>(this.BaseURL + "reservation/GetCustomerDetailsAndBooker/" + reservationID);
  }

  getCountries(): Observable<CountryDropDown[]> {
    return this.cachedGet('getCountries', () =>
      this.http.get<CountryDropDown[]>(this.BaseURL + "city/ForDropDownCountry"));
  }

  getBusniessType(): Observable<BusinessTypeDropDown[]> {
    return this.cachedGet('getBusniessType', () =>
      this.http.get<BusinessTypeDropDown[]>(this.BaseURL + "customer/ForDropDownBusinessType"));
  }
  GetCustomerID(): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customer/getCustomerID");
  }

  GetCompanyIDBasedOnCustomer(customerID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customer/getCompanyID/"+customerID);
  }

  getSupplier(): Observable<SupplierDropDown[]> {
    return this.cachedGet('getSupplier', () =>
      this.http.get<SupplierDropDown[]>(this.BaseURL + "organizationalEntity/ForDropDownSupplier"));
  }

  getSupplierOfOE(): Observable<SupplierDropDown[]> {
    return this.http.get<SupplierDropDown[]>(this.BaseURL + "supplier/supplierOfOE");
  }

  GetVehicle(): Observable<VehicleDropDown[]> {
    return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/ForDropDown");
  }

  GetVehicles(vehicleCategoryID:number): Observable<VehicleDropDown[]> {
    
    //return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/ForDropDown");
 
    return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/getForDropDown/" + vehicleCategoryID);
  
}

  GetVehicleAsInventory(): Observable<VehicleDropDown[]> {
    return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/getVehicleAsInventoryForDropDown");
  }

  getMonthYear(): Observable<MonthlyBusinessReportDropDown[]> {
    return this.http.get<MonthlyBusinessReportDropDown[]>(this.BaseURL + "monthlyBusinessReport/ForDropDown");
  }

  GetVehicleVehicleCategory(): Observable<VehicleVehicleCategoryDropDown[]> {
    return this.http.get<VehicleVehicleCategoryDropDown[]>(this.BaseURL + "Vehicle/ForVehicleVehicleCategoryDropDown");
  }

  getPackage(): Observable<PackageDropDown[]> {
    return this.http.get<PackageDropDown[]>(this.BaseURL + "Package/ForDropDown");
  }

  getCityTier(): Observable<CityTierDropDown[]> {
    return this.http.get<CityTierDropDown[]>(this.BaseURL + "cityTier/ForDropDown");
  }

  GetCitys(): Observable<CityDropDown[]> {
    return this.http.get<CityDropDown[]>(this.BaseURL + "City/ForDropDown");
  }

  GetCitiesAll(): Observable<CityGroupDropDown[]> {
    return this.http.get<CityGroupDropDown[]>(
      this.BaseURL + 'CityGroup/ForDropDown'
    );
  }
  
  GetSupplierType(): Observable<SupplierTypeDropDownModel[]> 
  {
    return this.http.get<SupplierTypeDropDownModel[]>(this.BaseURL + "supplierType/getSupplierTypeDropDown");
  }

  GetSalesPerson(): Observable<SalesPersonDropDownModel[]> 
  {
    return this.http.get<SalesPersonDropDownModel[]>(this.BaseURL + "dutyRegister/getSalesPerson");
  }

  GetRegistrationNumber(): Observable<VehicleDropDown[]> 
  {
    return this.http.get<VehicleDropDown[]>(this.BaseURL + "dutyRegister/getRegistrationNumber");
  }

  getCustomerGroup(): Observable<CustomerGroupDropDown[]> {
    return this.cachedGet('getCustomerGroup', () =>
      this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "CustomerGroup/ForDropDown"));
  }
  GetCustomerForIndividual(): Observable<CustomerGroupDropDown[]> {
    return this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "CustomerGroup/GetCustomerForIndividual");
  }
  
  GetCustomerGroup(CustomerTypeID: number): Observable<CustomerGroupDropDown[]> {
    
    if (CustomerTypeID == 0) {
      return this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "CustomerGroup/ForDropDownCustomer");
    }
    else {
      return this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "CustomerGroup/ForDropDownCustomer/" + CustomerTypeID);
    }

  }
  GetCustomerForCorporate(CustomerTypeID: number): Observable<CustomerGroupDropDown[]> {
    
    if (CustomerTypeID == 0) {
      return this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "CustomerGroup/GetCustomerForCorporate");
    }
    else {
      return this.http.get<CustomerGroupDropDown[]>(this.BaseURL + "CustomerGroup/GetCustomerForCorporate/" + CustomerTypeID);
    }

  }
  
  getCustomerTypes(): Observable<CustomerTypeDropDown[]> {
    return this.http.get<CustomerTypeDropDown[]>(this.BaseURL + "CustomerType/ForDropDownCustomer");
  }
  getCustomerTypeForReservation(): Observable<CustomerTypeDropDown[]> {
    return this.http.get<CustomerTypeDropDown[]>(this.BaseURL + "CustomerType/CustomerType");
  }
getCountry(): Observable<CountryDropDown[]> {
  return this.http.get<CountryDropDown[]>(this.BaseURL + "city/ForDropDowns");
}

getCustomerType(): Observable<CustomerTypeDropDown[]> {
  return this.cachedGet('getCustomerType', () =>
    this.http.get<CustomerTypeDropDown[]>(this.BaseURL + "CustomerType/ForDropDown"));
}

getCustomerPerson(): Observable<CustomerPersonDropDown[]> {
  return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/ForDropDown");
}

GetCPForBooker(customerGroupID:number): Observable<CustomerPersonDropDown[]> {
  return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/getCPForBooker/"+customerGroupID);
}

GetDriverInventoryForCpSearch(supplierID:number): Observable<DriverInventoryAssociationDropDown[]> {
  return this.http.get<DriverInventoryAssociationDropDown[]>(this.BaseURL + "driverInventoryAssociation/GetDriverInventoryAssociation/"+supplierID);
}

GetDriverOfficialIdentityNumber(supplierID:number): Observable<DriverOfficialIdentityNumberDD[]> {
  return this.http.get<DriverOfficialIdentityNumberDD[]>(this.BaseURL + "driverInventoryAssociation/GetDriverOfficialIdentityNumber/"+supplierID);
}

GetDOIN(): Observable<DriverOfficialIdentityNumberDD[]> {
  return this.http.get<DriverOfficialIdentityNumberDD[]>(this.BaseURL + "driver/GetDOINForDropDown");
}

GetDriverInventoryVehicleForCpSearch(): Observable<DriverInventoryAssociationDropDown[]> {
  return this.http.get<DriverInventoryAssociationDropDown[]>(this.BaseURL + "driverInventoryAssociation/GetDriverInventoryVehicleAssociation");
}

GetDisputes(): Observable<DisputeTypeDropDown[]> {
  return this.http.get<DisputeTypeDropDown[]>(this.BaseURL + "dutySlipForBilling/DisputeTypeDropDown");
}

GetCPForPassenger(customerGroupID:number): Observable<CustomerPersonDropDown[]> {
  return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/getCPForPassenger/"+customerGroupID);
}

GetCPForBookerInCPSearch(): Observable<CustomerPersonDropDown[]> {
  return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/GetCPASBookerCPSearch");
}

GetCPForPassengerInCPSearch(): Observable<CustomerPersonDropDown[]> {
  return this.http.get<CustomerPersonDropDown[]>(this.BaseURL + "CustomerPerson/GetCPASPassengerForCPSearch");
}

GetPermission(ReservationID:number): Observable<CustomerConfigurationMessaging[]> {
  return this.http.get<CustomerConfigurationMessaging[]>(this.BaseURL + "customerConfigurationMessaging/getSendSMSWhatsApp/"+ReservationID);
}
getCustomerCustomerGroup(customerTypeID:number): Observable<any[]> {
  return this.http.get<any[]>(this.BaseURL + "Customer/ForCustomerCustomerGroupDropDown/"+customerTypeID);
}

GetCustomerCustomerGroup(): Observable<any[]> 
{
  return this.http.get<any[]>(this.BaseURL + "Customer/ForCustomerCustomerGroupDD");
}
getCustomerCustomerGroupForRD(customerGroupID:number): Observable<any[]> {
  return this.http.get<any[]>(this.BaseURL + "Customer/GetCustomerCustomerGroupForRD/"+customerGroupID);
}
getCustomersForRD(): Observable<any[]> {
  return this.http.get<any[]>(this.BaseURL + "Customer/GetCustomersForRD");
}
GetIGSTPercentage(): Observable<IGSTPercentageDropDown[]> {
  return this.http.get<IGSTPercentageDropDown[]>(
    this.BaseURL + 'dutyGSTPercentage/IGSTPercentageForDropDown/');
}

getCustomer(): Observable<CustomerCustomerGroupDropDown[]> {
  return this.cachedGet('getCustomer', () =>
    this.http.get<CustomerCustomerGroupDropDown[]>(this.BaseURL + "Customer/ForDropDown"));
}

GetCSGSTPercentage(): Observable<CSGSTPercentageDropDown[]> {
  return this.http.get<CSGSTPercentageDropDown[]>(
    this.BaseURL + 'dutyGSTPercentage/CSGSTPercentageForDropDown/');
}

GetOrganizationalBranch(): Observable<OrganizationalEntityDropDown[]>{
  return this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForBranchDropDown");
}

// getCustomer(): Observable<CustomerDropDown[]> {
//   return this.http.get<CustomerDropDown[]>(this.BaseURL + "Customer/ForDropDown");
// }

getCustomerForCPSearch(): Observable<CustomerCustomerGroupDropDown[]> {
  return this.http.get<CustomerCustomerGroupDropDown[]>(this.BaseURL + "Customer/ForCPSearchDropDown");
}

getCustomerAlertMessgaeType(): Observable<CustomerAlertMessageTypeForDropDown[]> {
  return this.http.get<CustomerAlertMessageTypeForDropDown[]>(this.BaseURL + "customerAlertMessageType/getCustomerAlertMessageTypeForDropDown");
}

getDriverGrade(): Observable<DriverGradeDropDown[]> {
  return this.http.get<DriverGradeDropDown[]>(this.BaseURL + "DriverGrade/ForDropDown");
}

GetCustomerDepartmentBasedOnCG(CustomerGroupID:number): Observable<CustomerDepartmentDropDown[]> {
  return this.http.get<CustomerDepartmentDropDown[]>(this.BaseURL + "CustomerDepartment/getCustomerDepartmentForCG/"+CustomerGroupID);
}

GetCustomerDesignationBasedOnCG(CustomerGroupID:number): Observable<CustomerDesignationDropDown[]> {
  return this.http.get<CustomerDesignationDropDown[]>(this.BaseURL + "CustomerDesignation/getCustomerDesignationForCG/"+CustomerGroupID);
}

getCustomerCategory(): Observable<CustomerCategoryDropDown[]>{
  return this.cachedGet('getCustomerCategory', () =>
    this.http.get<CustomerCategoryDropDown[]>(this.BaseURL + "CustomerCategory/ForDropDown"));
}
 
  GetVehicleCategories(): Observable<VehicleCategoryDropDown[]> {
    return this.cachedGet('GetVehicleCategories', () =>
      this.http.get<VehicleCategoryDropDown[]>(this.BaseURL + "VehicleCategory/ForDropDown"));
  }
   GetVehicleCategoryByVehicleID(vehicleID:number): Observable<VehicleCategoryDropDown[]> {
    return this.http.get<VehicleCategoryDropDown[]>(this.BaseURL + "vehicle/GetVehicleCategoryByVehicleID/" + vehicleID);
  }

  GetDebitTypes(): Observable<DebitTypeModel[]> {
    return this.http.get<DebitTypeModel[]>(this.BaseURL + "incidenceEdit/DebitTypeForDropDown");
  }

  GetAmenities(): Observable<AmenitieDropDown[]> {
    return this.http.get<AmenitieDropDown[]>(this.BaseURL + "amenitie/ForDropDown");
  }

  GetAccrisCode(): Observable<AcrisCodeDropDown[]> {
    return this.http.get<AcrisCodeDropDown[]>(this.BaseURL + "AcrisCode/ForDropDown");
  }
  GetCarCategories(): Observable<CustomerContractCarCategoryDropDown[]> {
    return this.http.get<CustomerContractCarCategoryDropDown[]>(this.BaseURL + "customerContractCarCategory/ForDropDown");
  }

  GetCarCategory(CustomerContractID:number): Observable<CustomerContractCarCategoryDropDown[]> {
    return this.http.get<CustomerContractCarCategoryDropDown[]>(this.BaseURL + "customerContractCarCategory/ForCarCategories/"+CustomerContractID);
  }

   getVendorCarCategory(VendorContractID:number): Observable<VendorContractCarCategoryDropDown[]> {
    return this.http.get<VendorContractCarCategoryDropDown[]>(this.BaseURL + "customerContractCarCategory/ForVendorCarCategories/"+VendorContractID);
  }
  GetPackageType(): Observable<PackageTypeDropDown[]> {
    return this.http.get<PackageTypeDropDown[]>(
      this.BaseURL + 'PackageType/ForDropDown'
    );
  }

  GetCompany(): Observable<OrganizationalEntityDropDown[]>{
    return this.cachedGet('GetCompany', () =>
      this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForCompanyDropDown"));
  }

  GetHub(): Observable<OrganizationalEntityDropDown[]>{
    return this.cachedGet('GetHub', () =>
      this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForHubDropDown"));
  }

  GetLocation(): Observable<OrganizationalEntityDropDown[]>{
    return this.cachedGet('GetLocation', () =>
      this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForLocationDropDown"));
  }

  GetLocationBasedOnCity(CityID:number): Observable<OrganizationalEntityDropDown[]>{
    return this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForLocationBasedOnCity/"+CityID);
  }
  
  GetLocationHub(): Observable<OrganizationalEntityDropDown[]>{
    return this.cachedGet('GetLocationHub', () =>
      this.http.get<OrganizationalEntityDropDown[]>(this.BaseURL + "organizationalEntity/ForLocationHubDropDown"));
  }
  
   GetLocationGroup(): Observable<LocationGroupDropDown[]>{
    return this.cachedGet('GetLocationGroup', () =>
      this.http.get<LocationGroupDropDown[]>(this.BaseURL + "locationGroup/ForDropDown"));
  }
  getSuppliersForInventory(): Observable<SupplierDropDown[]> {
    return this.http.get<SupplierDropDown[]>(this.BaseURL + "supplier/ForDropDown");
  }

  getColorsForInventory():Observable<ColorDropDown[]>{
    return this.http.get<ColorDropDown[]>(this.BaseURL + "color/ForDropDown");
  }

  getFuleTypesForInventory():Observable<FuelTypeDropDown[]>{
    return this.http.get<FuelTypeDropDown[]>(this.BaseURL + "fuelType/ForDropDown");
  }

  getBillingCycleName():Observable<BillingCycleNameDropDown[]>{
    return this.http.get<BillingCycleNameDropDown[]>(this.BaseURL + "billingCycleName/ForDropDown");
  }
  getBillingType():Observable<BillingTypeDropDown[]>{
    return this.http.get<BillingTypeDropDown[]>(this.BaseURL + "billingType/ForDropDown");
  }


  GetStateAgainstCity(cityID: number): Observable<StateDropDown[]> {
    if (cityID == 0) {
      return this.http.get<StateDropDown[]>(this.BaseURL + "city/CityStateDropDown");
    }
    else {
      return this.http.get<StateDropDown[]>(this.BaseURL + "city/CityStateDropDown/" + cityID);
    }

  }

// GetVehicle(): Observable<VehicleDropDown[]> {
  
//   return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/ForDropDown");

//  // return this.http.get<VehicleDropDown[]>(this.BaseURL + "Vehicle/ForDropDown/" + vehicleCategoryID);

// }

  sendUpdate(message: string) {
    //the component that wants to update something, calls this fn
    this.subjectName.next({ text: message }); //next() will feed the value in Subject
  }
  getUpdate(): Observable<any> {
    //the receiver component calls this function 
    return this.subjectName.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
  }

  getCustomerID(): number {
    return 1;
  }
  getCustomerName(): string {
    return "Adobe Inc.";
  }
  getUserName(): string {
    return "Amit Prakash";
  }
  GetProofDocuments(proofType: string): Observable<IproofDocuments[]> {
    return this.http.get<IproofDocuments[]>(this.BaseURL + "proofDocument/ForDropDownByProofType/" + proofType);
  }

  GetDriverDropDown(supplierID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customerPersonDriverRestriction/GetDriverDropDown/"+supplierID);
  }

  GetRegistrationNumberDropDown(supplierID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customerPersonDriverRestriction/GetRegistrationNumberDropDown/"+supplierID);
  }
  GetVehicleBasedOnCategory(vehicleCategoryID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "vehicle/getVehicleBasedOnCategory/"+vehicleCategoryID);
  }
  GetVehicleCategoryBasedOnRegistrationNumber(supplierID:number): Observable<any[]> {
    return this.http.get<any[]>(this.BaseURL + "customerPersonDriverRestriction/getVehicleCategoryBasedOnRegistrationNumber/"+supplierID);
  }
}

