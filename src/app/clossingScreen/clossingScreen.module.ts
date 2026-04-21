// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClossingScreenComponent } from './clossingScreen.component';
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
import { ClossingScreenService } from './clossingScreen.service';
import { ClossingScreenRoutingModule } from './clossingScreen-routing.module';
import { ImageUploaderComponent } from '../imageUploader/imageUploader.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AddPassengersService } from '../addPassengers/addPassengers.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CurrentDutyService } from '../currentDuty/currentDuty.service';
import { CurrentDutyComponent } from '../currentDuty/currentDuty.component';
import { CurrentDutyModule } from '../currentDuty/currentDuty.module';
import { CustomerInfoComponent } from '../customerInfo/customerInfo.component';
import { CustomerInfoModule } from '../customerInfo/customerInfo.module';
import { CustomerInfoService } from '../customerInfo/customerInfo.service';
import { ReservationClosingDetailsComponent } from '../reservationClosingDetails/reservationClosingDetails.component';
import { ReservationDetailsModule } from '../reservationDetails/reservationDetails.module';
import { ReservationClosingDetailsModule } from '../reservationClosingDetails/reservationClosingDetails.module';
import { ReservationClosingDetailsService } from '../reservationClosingDetails/reservationClosingDetails.service';
import { ClosingDetailShowComponent } from '../closingDetailShow/closingDetailShow.component';
import { ClosingDetailShowService } from '../closingDetailShow/closingDetailShow.service';
import { ClosingDetailShowModule } from '../closingDetailShow/closingDetailShow.module';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import { DutyInterstateTaxService } from '../dutyInterstateTax/dutyInterstateTax.service';
import { DutyInterstateTaxApprovalService } from '../dutyInterstateTaxApproval/dutyInterstateTaxApproval.service';
import { DutyTollParkingEntryModule } from '../dutyTollParkingEntry/dutyTollParkingEntry.module';
import { DutyTollParkingEntryService } from '../dutyTollParkingEntry/dutyTollParkingEntry.service';
import { InterstateTaxEntryService } from '../interstateTaxEntry/interstateTaxEntry.service';
import { DurationPipe } from './duration.pipe';
import { DisputeService } from '../dispute/dispute.service';
import { DisputeComponent } from '../dispute/dispute.component';
import { DisputeModule } from '../dispute/dispute.module';

//import { AdditionalDialogComponent } from './dialogs/additional-dialog/additional-dialog.component';
import { DutyTollParkingEntryComponent } from '../dutyTollParkingEntry/dutyTollParkingEntry.component';
import { AdditionalKmsDetailsService } from '../additionalKmsDetails/additionalKmsDetails.service';
import { AdditionalKmsDetailsModule } from '../additionalKmsDetails/additionalKmsDetails.module';
import { AdditionalKmsDetailsComponent } from '../additionalKmsDetails/additionalKmsDetails.component';
import { DutyInterstateTaxComponent } from '../dutyInterstateTax/dutyInterstateTax.component';
import { DutyInterstateTaxModule } from '../dutyInterstateTax/dutyInterstateTax.module';
import { DutyExpenseService } from '../dutyExpense/dutyExpense.service';
import { DutyExpenseModule } from '../dutyExpense/dutyExpense.module';
import { DutyExpenseComponent } from '../dutyExpense/dutyExpense.component';
import { KamCardService } from '../kamCard/kamCard.service';
import { KamCardModule } from '../kamCard/kamCard.module';
import { KamCardComponent } from '../kamCard/kamCard.component';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialInstructionDetailsModule } from '../specialInstructionDetails/specialInstructionDetails.module';
import { SpecialInstructionDetailsComponent } from '../specialInstructionDetails/specialInstructionDetails.component';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { InternalNoteDetailsModule } from '../internalNoteDetails/internalNoteDetails.module';
import { InternalNoteDetailsComponent } from '../internalNoteDetails/internalNoteDetails.component';
import { AdvanceDetailsService } from '../advanceDetails/advanceDetails.service';
import { AdvanceDetailsModule } from '../advanceDetails/advanceDetails.module';
import { AdvanceDetailsComponent } from '../advanceDetails/advanceDetails.component';
import { LumpsumRateDetailsService } from '../lumpsumRateDetails/lumpsumRateDetails.service';
import { LumpsumRateDetailsModule } from '../lumpsumRateDetails/lumpsumRateDetails.module';
import { LumpsumRateDetailsComponent } from '../lumpsumRateDetails/lumpsumRateDetails.component';
import { AdditionalSMSDetailsService } from '../additionalSMSDetails/additionalSMSDetails.service';
import { AdditionalSMSDetailsModule } from '../additionalSMSDetails/additionalSMSDetails.module';
import { AdditionalSMSDetailsComponent } from '../additionalSMSDetails/additionalSMSDetails.component';
import { BillToOtherService } from '../billToOther/billToOther.service';
import { BillToOtherModule } from '../billToOther/billToOther.module';
import { BillToOtherComponent } from '../billToOther/billToOther.component';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { SettledRateDetailsModule } from '../settledRateDetails/settledRateDetails.module';
import { SettledRateDetailsComponent } from '../settledRateDetails/settledRateDetails.component';
import { DutyGSTPercentageService } from '../dutyGSTPercentage/dutyGSTPercentage.service';
import { DutyGSTPercentageModule } from '../dutyGSTPercentage/dutyGSTPercentage.module';
import { DutyGSTPercentageComponent } from '../dutyGSTPercentage/dutyGSTPercentage.component';
import { DutyStateModule } from '../dutyState/dutyState.module';
import { DutyStateService } from '../dutyState/dutyState.service';
import { DutyStateComponent } from '../dutyState/dutyState.component';
import { DutySACService } from '../dutySAC/dutySAC.service';
import { DutySACModule } from '../dutySAC/dutySAC.module';
import { DutySACComponent } from '../dutySAC/dutySAC.component';
import { SingleDutySingleBillForLocalService } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DutySlipLTRStatementService } from '../dutySlipLTRStatement/dutySlipLTRStatement.service';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { RSPFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { RSPDeleteDialogComponent } from './dialogs/delete/delete.component';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { BillingHistoryModule } from '../billingHistory/billingHistory.module';
import { BillingHistoryService } from '../billingHistory/billingHistory.service';
import { DisputeHistoryService } from '../disputeHistory/disputeHistory.service';

@NgModule({
  declarations: [
    ClossingScreenComponent,
    DurationPipe,
    RSPFormDialogComponent,
    RSPDeleteDialogComponent,
    ],
  imports: [
    MatTabsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClossingScreenRoutingModule,
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
    CurrentDutyModule,
    CustomerInfoModule,
    ReservationClosingDetailsModule,
    ClosingDetailShowModule,
    AdditionalKmsDetailsModule,
    DutyTollParkingEntryModule,
    DutyInterstateTaxModule,
    DisputeModule,
    DutyExpenseModule,
    KamCardModule,
    SpecialInstructionDetailsModule,
    InternalNoteDetailsModule,
    AdvanceDetailsModule,
    LumpsumRateDetailsModule,
    AdditionalSMSDetailsModule,
    BillToOtherModule,
    SettledRateDetailsModule,
    DutyGSTPercentageModule,
    DutyStateModule,
    DutySACModule,
    MatTooltipModule,
    BillingHistoryModule
  ],
  exports:[ClossingScreenComponent],
  providers: [KamCardService,
              DutyExpenseService,
              DutyInterstateTaxApprovalService,
              DutyInterstateTaxService,
              ClosingDetailShowService,
              ClossingScreenService,
              InterstateTaxEntryService,
              CurrentDutyService,
              CustomerInfoService,
              DisputeService,
              ReservationClosingDetailsService,
              DutyTollParkingEntryService,
              AdditionalKmsDetailsService,
              SpecialInstructionDetailsService,
              InternalNoteDetailsService,
              AdvanceDetailsService,
              LumpsumRateDetailsService,
              AdditionalSMSDetailsService,
              BillToOtherService,
              SettledRateDetailsService,
              DutyGSTPercentageService,
              DutyStateService,
              DutySACService,
              SingleDutySingleBillForLocalService,
              DutySlipLTRStatementService,
              DiscountDetailsService,
              DispatchByExecutiveService,
              BillingHistoryService,
              DisputeHistoryService
            ]
})
export class ClossingScreenModule {}



