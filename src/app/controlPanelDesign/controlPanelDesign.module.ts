// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MaterialFileInputModule } from '@compat/material-file-input-shim';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MyUploadModule } from '../myupload/myupload.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ControlPanelDesignService } from './controlPanelDesign.service';
import { ControlPanelDesignRoutingModule } from './controlPanelDesign-routing.module';
import { OtherFilterService } from '../otherFilter/otherFilter.service';
import { TripFilterService } from '../tripFilter/tripFilter.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlPanelDesignComponent } from './controlPanelDesign.component';
import { ReservationService } from '../reservation/reservation.service';
import { NewFormService } from '../newForm/newForm.service';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { ReservationDetailsService } from '../reservationDetails/reservationDetails.service';
import { AdvanceDetailsService } from '../advanceDetails/advanceDetails.service';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { KamCardService } from '../kamCard/kamCard.service';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { LumpsumRateDetailsService } from '../lumpsumRateDetails/lumpsumRateDetails.service';
import { BillingInstructionsDetailsService } from '../billingInstructionsDetails/billingInstructionsDetails.service';
import { OtherDetailsService } from '../otherDetails/otherDetails.service';
import { StopDetailsService } from '../stopDetails/stopDetails.service';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialInstructionService } from '../specialInstruction/specialInstruction.service';
import { CustomerSpecificDetailsService } from '../customerSpecificDetails/customerSpecificDetails.service';
import { AdditionalSMSDetailsService } from '../additionalSMSDetails/additionalSMSDetails.service';
import { AdditionalSMSEmailWhatsappService } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.service';
import { BillToOtherDetailsService } from '../billToOtherDetails/billToOtherDetails.service';
import { BillToOtherService } from '../billToOther/billToOther.service';
import { FeedBackService } from '../feedBack/feedBack.service';
import { TripFeedBackService } from '../tripFeedBack/tripFeedBack.service';
import { DutySlipQualityCheckService } from '../dutySlipQualityCheck/dutySlipQualityCheck.service';
import { DutySlipQualityCheckedByExecutiveService } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.service';
import { PickUpByExecutiveService } from '../pickUpByExecutive/pickUpByExecutive.service';
import { DropOffByExecutiveService } from '../dropOffByExecutive/dropOffByExecutive.service';
import { FetchDataFromAppService } from '../fetchDataFromApp/fetchDataFromApp.service';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { DispatchFetchDataService } from '../dispatchFetchData/dispatchFetchData.service';
import { ReachedByExecutiveService } from '../reachedByExecutive/reachedByExecutive.service';
import { FetchDataRBEService } from '../fetchDataRBE/fetchDataRBE.service';
import { PrintDutySlipService } from '../PrintDutySlip/PrintDutySlip.service';
import { ReservationMessagingService } from '../reservationMessaging/reservationMessaging.service';
import { SendEmsAndEmailService } from '../sendEmsAndEmail/sendEmsAndEmail.service';
import { SendSMSService } from '../sendSMS/sendSMS.service';
import { SingleDutySingleBillForOutstationService } from '../SingleDutySingleBillForOutstation/SingleDutySingleBillForOutstation.service';
import { SingleDutySingleBillForLocalService } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.service';
import { SingleDutySingleBillService } from '../singleDutySingleBill/singleDutySingleBill.service';
import { GarageInService } from '../garageIn/garageIn.service';
import { PickUpDetailShowService } from '../pickUpDetailShow/pickUpDetailShow.service';
import { LocationInDetailShowService } from '../locationInDetailShow/locationInDetailShow.service';
import { DropOffDetailShowService } from '../dropOffDetailShow/dropOffDetailShow.service';
import { DriverRemarkService } from '../driverRemark/driverRemark.service';
import { NextDayInstructionService } from '../nextDayInstruction/nextDayInstruction.service';

import { DutySlipImageDetailsShowService } from '../dutySlipImageDetailsShow/dutySlipImageDetailsShow.service';
import { DutySlipImageService } from '../dutySlipImage/dutySlipImage.service';
import { PasswordService } from '../password/password.service';
import { FeedBackAttachmentService } from '../feedBackAttachment/feedBackAttachment.service';
import { ReservationStopDetailsService } from '../reservationStopDetails/reservationStopDetails.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ReservationLocationTransferLogService } from '../reservationLocationTransferLog/reservationLocationTransferLog.service';
import { ReservationLocationTransferLogModule } from '../reservationLocationTransferLog/reservationLocationTransferLog.module';
import { SendSmsWhatsappMailService } from '../sendSmsWhatsappMail/sendSmsWhatsappMail.service';
import { VendorDetailsService } from '../vendorDetails/vendorDetails.service';
import { LocationDetailsService } from '../locationDetails/locationDetails.service';
import { CarMovingStatusByAppService } from '../carMovingStatusByApp/carMovingStatusByApp.service';
import { AppDataMissingStatusService } from '../appDataMissingStatus/appDataMissingStatus.service';
import { IncidenceService } from '../incidence/incidence.service';
import { ResolutionService } from '../resolution/resolution.service';
import { TrackOnMapInfoService } from '../trackOnMapInfo/trackOnMapInfo.service';
import { TotalBookingCountDetailsService } from '../totalBookingCountDetails/totalBookingCountDetails.service';
import { InterstateTaxEntryService } from '../interstateTaxEntry/interstateTaxEntry.service';
import { LifeCycleStatusService } from '../lifeCycleStatus/lifeCycleStatus.service';
import { PassToSupplierService } from '../passToSupplier/passToSupplier.service';
import { MailSupplierService } from '../mailSupplier/mailSupplier.service';
import { DutyTrackingService } from '../dutyTracking/dutyTracking.service';
import { DutyPostPickUPCallService } from '../dutyPostPickUPCall/dutyPostPickUPCall.service';
import { ClossingOneService } from '../clossingOne/clossingOne.service';
import { CancelAllotmentService } from '../cancelAllotment/cancelAllotment.service';
import { ControlPanelDialogeService } from '../controlPanelDialoge/controlPanelDialoge.service';
import { CancelReservationAndAllotmentService } from '../cancelReservationAndAllotment/cancelReservationAndAllotment.service';
import { EmailInfoService } from '../EmailInfo/EmailInfo.service';
import { PrintBlankDutySlipService } from '../PrintBlankDutySlip/PrintBlankDutySlip.service';
import { DutySlipAccentureService } from '../dutySlipAccenture/dutySlipAccenture.service';
import { PrintDutySlipWithoutMapService } from '../PrintDutySlipWithoutMap/PrintDutySlipWithoutMap.service';
import { IntegrationLogService } from '../integrationLog/integrationLog.service';
import { ControlPanelDialogeModule } from '../controlPanelDialoge/controlPanelDialoge.module';

@NgModule({
  declarations: [ControlPanelDesignComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ControlPanelDesignRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MaterialFileInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    MatProgressBarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReservationLocationTransferLogModule,
    // Re-exports ControlPanelDialogEntriesModule (all MatDialog entry scopes).
    ControlPanelDialogeModule
  ],
  providers: [
    SendSMSService,
    FetchDataRBEService,
    ReachedByExecutiveService,
    DutySlipQualityCheckedByExecutiveService,
    DutySlipQualityCheckService,
    ControlPanelDesignService,
    OtherFilterService,
    TripFilterService,
    NewFormService,
    PassengerDetailsService,
    InternalNoteDetailsService,
    ReservationDetailsService,
    AdvanceDetailsService,
    SettledRateDetailsService,
    KamCardService,
    DiscountDetailsService,
    LumpsumRateDetailsService,
    BillingInstructionsDetailsService,
    OtherDetailsService,
    StopDetailsService,
    SpecialInstructionDetailsService,
    SpecialInstructionService,
    CustomerSpecificDetailsService,
    AdditionalSMSDetailsService,
    AdditionalSMSEmailWhatsappService,
    BillToOtherDetailsService,
    BillToOtherService,
    FeedBackService,
    TripFeedBackService,
    FeedBackAttachmentService,
    PickUpByExecutiveService, DropOffByExecutiveService,
    FetchDataFromAppService,
    DispatchByExecutiveService,
    DispatchFetchDataService,
    PrintDutySlipService,
    ReservationMessagingService,
    SendEmsAndEmailService,
    SingleDutySingleBillForOutstationService,
    SingleDutySingleBillForLocalService,
    SingleDutySingleBillService,
    GarageInService,
    PickUpDetailShowService,
    LocationInDetailShowService,
    DropOffDetailShowService,
    DriverRemarkService,
    NextDayInstructionService,
    ClossingOneService,
    DutySlipImageDetailsShowService,
    DutySlipImageService,
    PasswordService,
    ReservationService,
    ReservationStopDetailsService,
    ReservationLocationTransferLogService,
    SendSmsWhatsappMailService,
    VendorDetailsService,
    LocationDetailsService,
    CarMovingStatusByAppService,
    AppDataMissingStatusService, IncidenceService,
    ResolutionService,
    TrackOnMapInfoService,
    TotalBookingCountDetailsService,
    InterstateTaxEntryService,
    LifeCycleStatusService,
    PassToSupplierService,
    MailSupplierService,
    DutyTrackingService,
    DutyPostPickUPCallService,
    CancelAllotmentService,
    ControlPanelDialogeService,
    CancelReservationAndAllotmentService ,
    EmailInfoService,
    SpecialInstructionDetailsService,
    PrintBlankDutySlipService,
    DutySlipAccentureService,
    PrintDutySlipWithoutMapService,
    IntegrationLogService 
  ]
})
export class ControlPanelDesignModule {}



