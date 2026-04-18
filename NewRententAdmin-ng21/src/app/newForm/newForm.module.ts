// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewFormComponent } from './newForm.component';

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
import { NewFormService } from './newForm.service';
import { NewFormRoutingModule } from './newForm-routing.module';
import { ImageUploaderComponent } from '../imageUploader/imageUploader.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AddPassengersService } from '../addPassengers/addPassengers.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomerDetailsEditComponent } from './dialogs/customer-details-edit/customer-details-edit.component';
import { PickupDialogComponent } from './dialogs/pickup-dialog/pickup-dialog.component';
import { DropOffDialogComponent } from './dialogs/dropoff-dialog/dropoff-dialog.component';
import { AddStopsDialogComponent } from './dialogs/add-stops-dialog/add-stops-dialog.component';
import { AddDiscountService } from '../addDiscount/addDiscount.service';
import { AdvanceService } from '../advance/advance.service';
import { SettledRatesService } from '../settledRates/settledRates.service';
import { AdditionalSMSEmailWhatsappService } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.service';
import { BillToOtherService } from '../billToOther/billToOther.service';
import { KamDetailsService } from '../kamDetails/kamDetails.service';
import { CustomerSpecificDetailsModule } from '../customerSpecificDetails/customerSpecificDetails.module';
import { CustomerSpecificDetailsComponent } from '../customerSpecificDetails/customerSpecificDetails.component';
import { DiscountDetailsModule } from '../discountDetails/discountDetails.module';
import { AdvanceDetailsModule } from '../advanceDetails/advanceDetails.module';
import { AdvanceDetailsComponent } from '../advanceDetails/advanceDetails.component';
import { LumpsumRateDetailsComponent } from '../lumpsumRateDetails/lumpsumRateDetails.component';
import { LumpsumRateDetailsModule } from '../lumpsumRateDetails/lumpsumRateDetails.module';
import { SettledRateDetailsModule } from '../settledRateDetails/settledRateDetails.module';
import { SettledRateDetailsComponent } from '../settledRateDetails/settledRateDetails.component';
import { AdditionalSMSDetailsComponent } from '../additionalSMSDetails/additionalSMSDetails.component';
import { AdditionalSMSDetailsModule } from '../additionalSMSDetails/additionalSMSDetails.module';
import { BillToOtherDetailsModule } from '../billToOtherDetails/billToOtherDetails.module';
import { BillToOtherDetailsComponent } from '../billToOtherDetails/billToOtherDetails.component';
import { KamCardComponent } from '../kamCard/kamCard.component';
import { KamCardModule } from '../kamCard/kamCard.module';
import { ReservationDetailsComponent } from '../reservationDetails/reservationDetails.component';
import { ReservationDetailsModule } from '../reservationDetails/reservationDetails.module';
import { StopDetailsModule } from '../stopDetails/stopDetails.module';
import { StopDetailsComponent } from '../stopDetails/stopDetails.component';
import { PassengerDetailsComponent } from '../passengerDetails/passengerDetails.component';
import { PassengerDetailsModule } from '../passengerDetails/passengerDetails.module';
import { OtherDetailsModule } from '../otherDetails/otherDetails.module';
import { OtherDetailsComponent } from '../otherDetails/otherDetails.component';
import { SpecialInstructionDetailsComponent } from '../specialInstructionDetails/specialInstructionDetails.component';
import { SpecialInstructionDetailsModule } from '../specialInstructionDetails/specialInstructionDetails.module';
import { InternalNoteDetailsModule } from '../internalNoteDetails/internalNoteDetails.module';
import { InternalNoteDetailsComponent } from '../internalNoteDetails/internalNoteDetails.component';
import { BillingInstructionsDetailsComponent } from '../billingInstructionsDetails/billingInstructionsDetails.component';
import { BillingInstructionsDetailsModule } from '../billingInstructionsDetails/billingInstructionsDetails.module';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { ReservationStopDetailsService } from '../reservationStopDetails/reservationStopDetails.service';
import { AdvanceDetailsService } from '../advanceDetails/advanceDetails.service';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { KamCardService } from '../kamCard/kamCard.service';
import { SpecialInstructionService } from '../specialInstruction/specialInstruction.service';
import { BillingInstructionsDetailsService } from '../billingInstructionsDetails/billingInstructionsDetails.service';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { LumpsumRateDetailsService } from '../lumpsumRateDetails/lumpsumRateDetails.service';
import { CustomerDepartmentService } from '../customerDepartment/customerDepartment.service';
import { CustomerDesignationService } from '../customerDesignation/customerDesignation.service';
import { CustomerSpecificDetailsService } from '../customerSpecificDetails/customerSpecificDetails.service';
import { MOPDetailsService } from '../MOPDetailsShow/mopDetailsShow.service';
import { MOPDetailsModule } from '../MOPDetailsShow/mopDetailsShow.module';
import { MOPDetailsComponent } from '../MOPDetailsShow/mopDetailsShow.component';
import { CancelReservationService } from '../cancelReservation/cancelReservation.service';
import { ModeOfPaymentChangeService } from '../modeOfPaymentChanges/modeOfPaymentChanges.service';
import { DiscountDetailsComponent } from '../discountDetails/discountDetails.component';
import { ClossingOneService } from '../clossingOne/clossingOne.service';
import { ClossingOneModule } from '../clossingOne/clossingOne.module';
import { AddPassengersModule } from '../addPassengers/addPassengers.module';
import { AddDiscountModule } from '../addDiscount/addDiscount.module';
import { AdvanceModule } from '../advance/advance.module';
import { AdditionalSMSEmailWhatsappModule } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.module';
import { BillToOtherModule } from '../billToOther/billToOther.module';
import { KamDetailsModule } from '../kamDetails/kamDetails.module';
import { ReservationStopDetailsModule } from '../reservationStopDetails/reservationStopDetails.module';
import { SpecialInstructionModule } from '../specialInstruction/specialInstruction.module';
import { CancelReservationModule } from '../cancelReservation/cancelReservation.module';
import { ModeOfPaymentChangeModule } from '../modeOfPaymentChanges/modeOfPaymentChanges.module';
@NgModule({
  declarations: [
    NewFormComponent,
    CustomerDetailsEditComponent,
    PickupDialogComponent,
    DropOffDialogComponent,
    AddStopsDialogComponent
  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NewFormRoutingModule,
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
    MaterialFileInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ImageUploaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CustomerSpecificDetailsModule,
    DiscountDetailsModule,
    AdvanceDetailsModule,
    LumpsumRateDetailsModule,
    SettledRateDetailsModule,
    AdditionalSMSDetailsModule,
    BillToOtherDetailsModule,
    KamCardModule,
    ReservationDetailsModule,
    StopDetailsModule,
    PassengerDetailsModule,
    OtherDetailsModule,
    SpecialInstructionDetailsModule,
    InternalNoteDetailsModule,
    BillingInstructionsDetailsModule,
    MOPDetailsModule,
    ClossingOneModule,
    AddPassengersModule,
    AddDiscountModule,
    AdvanceModule,
    AdditionalSMSEmailWhatsappModule,
    BillToOtherModule,
    KamDetailsModule,
    ReservationStopDetailsModule,
    SpecialInstructionModule,
    CancelReservationModule,
    ModeOfPaymentChangeModule
  ],
  exports:[NewFormComponent],
  providers: [
              NewFormService,
              AddPassengersService,
              AddDiscountService,
              AdvanceService,
              SettledRatesService,
              AdditionalSMSEmailWhatsappService,
              BillToOtherService,
              KamDetailsService,
              InternalNoteDetailsService,
              PassengerDetailsService,
              ReservationStopDetailsService,
              AdvanceDetailsService,
              SettledRateDetailsService,
              KamCardService,
              ReservationStopDetailsService,
              SpecialInstructionService,
              BillingInstructionsDetailsService,
              DiscountDetailsService,
              LumpsumRateDetailsService,
              CustomerDepartmentService,
              CustomerDesignationService,
              CustomerSpecificDetailsService,
              MOPDetailsService,              
              CancelReservationService,
              ModeOfPaymentChangeService,
               ClossingOneService,
            ]
})
export class NewFormModule {}



