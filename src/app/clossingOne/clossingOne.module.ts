// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClossingOneComponent } from './clossingOne.component';
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
import { MatMenuModule } from '@angular/material/menu';
import { ClossingOneService } from './clossingOne.service';
import { ClossingOneRoutingModule } from './clossingOne-routing.module';
import { ImageUploaderComponent } from '../imageUploader/imageUploader.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SingleDutySingleBillForLocalService } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { CurrentDutyDetailsService } from '../currentDutyDetails/currentDutyDetails.service';
import { CurrentDutyDetailsModule } from '../currentDutyDetails/currentDutyDetails.module';
import { CurrentDutyDetailsComponent } from '../currentDutyDetails/currentDutyDetails.component';
import { ReservationClosingDetailsModule } from '../reservationClosingDetails/reservationClosingDetails.module';
import { CurrentdataInformationService } from '../currentdata-information/currentdata-information.service';
import { CustomerInformationService } from '../customer-information/customer-information.service';
import { CustomerInformationModule } from '../customer-information/customer-information.module';
import { CurrentDataInformationModule } from '../currentdata-information/currentdata-information.module';
import { CustomerInformationComponent } from '../customer-information/customer-information.component';
import { CurrentdataInformationComponent } from '../currentdata-information/currentdata-information.component';
// import { CustomerInformationComponent } from '../customer-information/customer-information.component';
// import { CurrentdataInformationComponent } from '../currentdata-information/currentdata-information.component';
import { DutyTollParkingEntryModule } from '../dutyTollParkingEntry/dutyTollParkingEntry.module';
import { DutyTollParkingEntryComponent } from '../dutyTollParkingEntry/dutyTollParkingEntry.component';
import { DisputeModule } from '../dispute/dispute.module';
import { DisputeComponent } from '../dispute/dispute.component';
import { DisputeHistoryService } from '../disputeHistory/disputeHistory.service';
import { DutyInterstateTaxModule } from '../dutyInterstateTax/dutyInterstateTax.module';
import { DutyInterstateTaxComponent } from '../dutyInterstateTax/dutyInterstateTax.component';
import { DutyInterstateTaxService } from '../dutyInterstateTax/dutyInterstateTax.service';
import { InterstateTaxEntryService } from '../interstateTaxEntry/interstateTaxEntry.service';
import { DutyExpenseModule } from '../dutyExpense/dutyExpense.module';
import { DutyGSTPercentageModule } from '../dutyGSTPercentage/dutyGSTPercentage.module';
import { DutyStateModule } from '../dutyState/dutyState.module';
import { DutyExpenseService } from '../dutyExpense/dutyExpense.service';
import { DutyGSTPercentageService } from '../dutyGSTPercentage/dutyGSTPercentage.service';
import { DutyStateService } from '../dutyState/dutyState.service';
import { AdditionalKmsDetailsComponent } from '../additionalKmsDetails/additionalKmsDetails.component';
import { AdditionalDialogComponent } from '../additionalKmsDetails/dialogs/form-dialog/form-dialog.component';
import { DiscountDetailsComponent } from '../discountDetails/discountDetails.component';
import { DutySACComponent } from '../dutySAC/dutySAC.component';
import { AdditionalKmsDetailsService } from '../additionalKmsDetails/additionalKmsDetails.service';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { DutySACService } from '../dutySAC/dutySAC.service';
import { DutySlipForBillingModule } from '../dutySlipForBilling/dutySlipForBilling.module';
import { DutySlipForBillingComponent } from '../dutySlipForBilling/dutySlipForBilling.component';
import { SalesPersonService } from '../salesPerson/salesPerson.service';
import { SalesPersonModule } from '../salesPerson/salesPerson.module';
import { SpecialInstructionDetailsModule } from '../specialInstructionDetails/specialInstructionDetails.module';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialInstructionService } from '../specialInstruction/specialInstruction.service';
import { SpecialinformationService } from '../special-information/special-information.service';
import { SpecialinformationComponent } from '../special-information/special-information.component';
import { SpecialinformationModule } from '../special-information/special-information.module';
import { IternallinformationService } from '../internal-information/internal-information.service';
import { IternallinformationModule } from '../internal-information/internal-information.module';
import { LumpsuminformationService } from '../lumpsum-information/lumpsum-information.service';
import { LumpsuminformationModule } from '../lumpsum-information/lumpsum-information.module';
import { AdvanceDetailsClosingService } from '../advanceDetailsClosing/advanceDetailsClosing.service';
import { SettledRateClosingService } from '../settledRateClosing/settledRateClosing.service';
import { AdvanceDetailsClosingModule } from '../advanceDetailsClosing/advanceDetailsClosing.module';
import { SettledRateClosingModule } from '../settledRateClosing/settledRateClosing.module';
import { KAMDetailsClosingModule } from '../kamDetailsClosing/kamDetailsClosing.module';
import { KAMDetailsClosingService } from '../kamDetailsClosing/kamDetailsClosing.service';
import { AdditionalSMSEmailWhatsappModule } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.module';
import { AdditionalSMSEmailWhatsappComponent } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.component';
import { BillToOtherModule } from '../billToOther/billToOther.module';
import { BillToOtherComponent } from '../billToOther/billToOther.component';
import { BillingHistoryService } from '../billingHistory/billingHistory.service';
import { BillingHistoryModule } from '../billingHistory/billingHistory.module';
import { DiscountDetailsModule } from '../discountDetails/discountDetails.module';
import { DutyStateCustomerService } from '../dutyStateCustomer/dutyStateCustomer.service';
import { DutyStateCustomerModule } from '../dutyStateCustomer/dutyStateCustomer.module';
import { DisputeService } from '../dispute/dispute.service';
import { PackageRateDetailsForClosingModule } from '../packageRateDetailsForClosing/packageRateDetailsForClosing.module';
import { PackageRateDetailsForClosingService } from '../packageRateDetailsForClosing/packageRateDetailsForClosing.service';
import { MOPDetailsModule } from '../MOPDetailsShow/mopDetailsShow.module';
import { MOPDetailsService } from '../MOPDetailsShow/mopDetailsShow.service';
import { ControlPanelDialogeService } from '../controlPanelDialoge/controlPanelDialoge.service';
import { ReservationDutyslipSearchService } from '../reservationDutyslipSearch/reservationDutyslipSearch.service';
import { ReservationDutyslipSearchModule } from '../reservationDutyslipSearch/reservationDutyslipSearch.module';
import { DutySlipImageService } from '../dutySlipImage/dutySlipImage.service';
import { OdoMeterAndManualDutySlipImageService } from '../odoMeterAndManualDutySlipImage/odoMeterAndManualDutySlipImage.service';
import { OdoMeterAndManualDutySlipImageModule } from '../odoMeterAndManualDutySlipImage/odoMeterAndManualDutySlipImage.module';
import { OdoMeterAndManualDutySlipImageComponent } from '../odoMeterAndManualDutySlipImage/odoMeterAndManualDutySlipImage.component';

@NgModule({
  declarations: [
    ClossingOneComponent,
    CurrentDutyDetailsComponent,
    CustomerInformationComponent,
    CurrentdataInformationComponent,
    DutySACComponent,
    AdditionalKmsDetailsComponent,
    AdditionalDialogComponent,

    ],
  imports: [
    MatTabsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClossingOneRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ImageUploaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatTooltipModule,
    CurrentDutyDetailsModule,
    ReservationClosingDetailsModule,
    DutyTollParkingEntryModule,
    DisputeModule,
    DutyInterstateTaxModule,
    DutyExpenseModule,
    DutyGSTPercentageModule,
    DutyStateModule,
    DutySlipForBillingModule,
    SalesPersonModule,
    SpecialInstructionDetailsModule,
    SpecialinformationModule,
    IternallinformationModule,
    LumpsuminformationModule,
    AdvanceDetailsClosingModule,
    SettledRateClosingModule,
    KAMDetailsClosingModule,
    AdditionalSMSEmailWhatsappModule,
    DutyStateCustomerModule,
    BillToOtherModule,
    BillingHistoryModule,
    DiscountDetailsModule,
    PackageRateDetailsForClosingModule,
    MOPDetailsModule,
    ReservationDutyslipSearchModule,
    OdoMeterAndManualDutySlipImageModule

  ],
  exports:[ClossingOneComponent],
  providers: [ClossingOneService,
              CurrentDutyDetailsService,
              CustomerInformationService,
              CurrentdataInformationService,
              DisputeHistoryService,
              DutyInterstateTaxService,
              InterstateTaxEntryService,
              DutyExpenseService,
              DutyGSTPercentageService,
              DutyStateService,
              DutySACService,
              AdditionalKmsDetailsService,
              DiscountDetailsService,
              SalesPersonService,
              SpecialinformationService,
              IternallinformationService ,
              LumpsuminformationService,
              AdvanceDetailsClosingService,
              SettledRateClosingService,
              KAMDetailsClosingService,
              BillingHistoryService,
              DutyStateCustomerService,
              DisputeService,
              SingleDutySingleBillForLocalService,
              PackageRateDetailsForClosingService ,
               MOPDetailsService, ControlPanelDialogeService,
               ReservationDutyslipSearchService ,DutySlipImageService,OdoMeterAndManualDutySlipImageService  
                       ]
})
export class ClossingOneModule {}



