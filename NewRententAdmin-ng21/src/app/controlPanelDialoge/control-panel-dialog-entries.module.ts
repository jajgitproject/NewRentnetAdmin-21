// @ts-nocheck
/**
 * Bundles MatDialog entry components opened from Control Panel (dialog + design).
 * Most other screens open dialogs only from their own feature module; two other
 * global entry points are wired separately: AppModule (ChangePasswordDialogModule)
 * and NewFormModule (imports every feature it opens cross-module).
 *
 * Each imported feature module must export the components opened via MatDialog.
 */
import { NgModule } from '@angular/core';
import { AllotmentStatusDetailsModule } from '../AllotmentStatusDetails/AllotmentStatusDetails.module';
import { AppDataMissingStatusModule } from '../appDataMissingStatus/appDataMissingStatus.module';
import { BookerInfoModule } from '../BookerInfo/BookerInfo.module';
import { CancelAllotmentModule } from '../cancelAllotment/cancelAllotment.module';
import { CancelReservationAndAllotmentModule } from '../cancelReservationAndAllotment/cancelReservationAndAllotment.module';
import { CarMovingStatusByAppModule } from '../carMovingStatusByApp/carMovingStatusByApp.module';
import { DispatchByExecutiveModule } from '../dispatchByExecutive/dispatchByExecutive.module';
import { DriverRemarkModule } from '../driverRemark/driverRemark.module';
import { DropOffByExecutiveModule } from '../dropOffByExecutive/dropOffByExecutive.module';
import { DropOffDetailShowModule } from '../dropOffDetailShow/dropOffDetailShow.module';
import { DutyPostPickUPCallModule } from '../dutyPostPickUPCall/dutyPostPickUPCall.module';
import { DutySlipImageDetailsShowModule } from '../dutySlipImageDetailsShow/dutySlipImageDetailsShow.module';
import { DutySlipImageModule } from '../dutySlipImage/dutySlipImage.module';
import { DutySlipQualityCheckModule } from '../dutySlipQualityCheck/dutySlipQualityCheck.module';
import { DutySlipQualityCheckedByExecutiveModule } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.module';
import { DutySlipQualityCheckDetailsModule } from '../DutySlipQualityCheckDetails/DutySlipQualityCheckDetails.module';
import { DutySlipQualityCheckedByExecutiveDetailsModule } from '../DutySlipQualityCheckedByExecutiveDetails/DutySlipQualityCheckedByExecutiveDetails.module';
import { DutyTrackingModule } from '../dutyTracking/dutyTracking.module';
import { EmailInfoModule } from '../EmailInfo/EmailInfo.module';
import { FeedBackDialogModule } from '../feedBack/feedBack-dialog.module';
import { GarageInModule } from '../garageIn/garageIn.module';
import { GarageOutDetailsModule } from '../GarageOutDetails/GarageOutDetails.module';
import { IncidenceModule } from '../incidence/incidence.module';
import { IntegrationLogModule } from '../integrationLog/integrationLog.module';
import { InterstateTaxEntryModule } from '../interstateTaxEntry/interstateTaxEntry.module';
import { LifeCycleStatusModule } from '../lifeCycleStatus/lifeCycleStatus.module';
import { LocationDetailsModule } from '../locationDetails/locationDetails.module';
import { LocationInDetailShowShowModule as LocationInDetailShowModule } from '../locationInDetailShow/locationInDetailShow.module';
import { MailSupplierModule } from '../mailSupplier/mailSupplier.module';
import { NextDayInstructionModule } from '../nextDayInstruction/nextDayInstruction.module';
import { NextDayInstructionDetailsModule } from '../NextDayInstructionDetails/NextDayInstructionDetails.module';
import { NoDataDialogModule } from '../no-data-dialog/no-data-dialog.module';
import { PackageInfoModule } from '../PackageInfo/PackageInfo.module';
import { PassengerInfoModule } from '../PassengerInfo/PassengerInfo.module';
import { PasswordModule } from '../password/password.module';
import { PassToSupplierModule } from '../passToSupplier/passToSupplier.module';
import { PickUpByExecutiveModule } from '../pickUpByExecutive/pickUpByExecutive.module';
import { PickUpDetailShowModule } from '../pickUpDetailShow/pickUpDetailShow.module';
import { PrintDutySlipModule } from '../PrintDutySlip/PrintDutySlip.module';
import { ReachedByExecutiveModule } from '../reachedByExecutive/reachedByExecutive.module';
import { ReachedByExecutiveDetailsModule } from '../ReachedByExecutiveDetails/ReachedByExecutiveDetails.module';
import { ReservationLocationTransferLogModule } from '../reservationLocationTransferLog/reservationLocationTransferLog.module';
import { ReservationMessagingModule } from '../reservationMessaging/reservationMessaging.module';
import { ReservationModule } from '../reservation/reservation.module';
import { ResolutionModule } from '../resolution/resolution.module';
import { SendEmsAndEmailModule } from '../sendEmsAndEmail/sendEmsAndEmail.module';
import { SendSMSModule } from '../sendSMS/sendSMS.module';
import { SendSmsWhatsappMailModule } from '../sendSmsWhatsappMail/sendSmsWhatsappMail.module';
import { SpecialInstructionInfoModule } from '../SpecialInstructionInfo/SpecialInstructionInfo.module';
import { StopDetailsInfoModule } from '../StopDetailsInfo/StopDetailsInfo.module';
import { StopOnMapInfoModule } from '../StopOnMapInfo/StopOnMapInfo.module';
import { TimeAndAddressInfoModule } from '../TimeAndAddressInfo/TimeAndAddressInfo.module';
import { TotalBookingCountDetailsModule } from '../totalBookingCountDetails/totalBookingCountDetails.module';
import { TrackOnMapInfoModule } from '../trackOnMapInfo/trackOnMapInfo.module';
import { VendorDetailsModule } from '../vendorDetails/vendorDetails.module';
import { VehicleCategoryInfoModule } from '../VehicleCategoryInfo/VehicleCategoryInfo.module';
import { VehicleInfoModule } from '../VehicleInfo/VehicleInfo.module';

const CONTROL_PANEL_DIALOG_ENTRY_IMPORTS = [
  AllotmentStatusDetailsModule,
  AppDataMissingStatusModule,
  BookerInfoModule,
  CancelAllotmentModule,
  CancelReservationAndAllotmentModule,
  CarMovingStatusByAppModule,
  DispatchByExecutiveModule,
  DriverRemarkModule,
  DropOffByExecutiveModule,
  DropOffDetailShowModule,
  DutyPostPickUPCallModule,
  DutySlipImageDetailsShowModule,
  DutySlipImageModule,
  DutySlipQualityCheckModule,
  DutySlipQualityCheckedByExecutiveModule,
  DutySlipQualityCheckDetailsModule,
  DutySlipQualityCheckedByExecutiveDetailsModule,
  DutyTrackingModule,
  EmailInfoModule,
  FeedBackDialogModule,
  GarageInModule,
  GarageOutDetailsModule,
  IncidenceModule,
  IntegrationLogModule,
  InterstateTaxEntryModule,
  LifeCycleStatusModule,
  LocationDetailsModule,
  LocationInDetailShowModule,
  MailSupplierModule,
  NextDayInstructionModule,
  NextDayInstructionDetailsModule,
  NoDataDialogModule,
  PackageInfoModule,
  PassengerInfoModule,
  PasswordModule,
  PassToSupplierModule,
  PickUpByExecutiveModule,
  PickUpDetailShowModule,
  PrintDutySlipModule,
  ReachedByExecutiveModule,
  ReachedByExecutiveDetailsModule,
  ReservationLocationTransferLogModule,
  ReservationMessagingModule,
  ReservationModule,
  ResolutionModule,
  SendEmsAndEmailModule,
  SendSMSModule,
  SendSmsWhatsappMailModule,
  SpecialInstructionInfoModule,
  StopDetailsInfoModule,
  StopOnMapInfoModule,
  TimeAndAddressInfoModule,
  TotalBookingCountDetailsModule,
  TrackOnMapInfoModule,
  VendorDetailsModule,
  VehicleCategoryInfoModule,
  VehicleInfoModule,
];

@NgModule({
  imports: CONTROL_PANEL_DIALOG_ENTRY_IMPORTS,
  exports: CONTROL_PANEL_DIALOG_ENTRY_IMPORTS,
})
export class ControlPanelDialogEntriesModule {}
