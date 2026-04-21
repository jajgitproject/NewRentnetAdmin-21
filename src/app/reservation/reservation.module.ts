// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationComponent } from './reservation.component';

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
import { ReservationService } from './reservation.service';
//import { ReservationRoutingModule } from './reservation-routing.module';
import { ImageUploaderComponent } from '../imageUploader/imageUploader.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { AddPassengersService } from '../addPassengers/addPassengers.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomerShortService } from '../customerShort/customerShort.service';
import { PersonShortService } from '../personShort/personShort.service';
//import { SavedAddressService } from '../savedAddress/savedAddress.service';
//import { AddPassengerService } from '../addPassenger/addPassenger.service';
import { ViewKAMService } from '../viewKAM/viewKAM.service';
import { GooglePlaceModule } from '@compat/google-places-shim';
import { SavedAddressComponent } from './dialogs/saved-address/saved-address.component';
import { CustomerPersonService } from '../customerPerson/customerPerson.service';
import { CustomerPersonAddressService } from '../customerPersonAddress/customerPersonAddress.service';
import { ReservationRoutingModule } from './reservation-routing.module';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { PassengerDetailsComponent } from '../passengerDetails/passengerDetails.component';
import { ReservationStopDetailsService } from '../reservationStopDetails/reservationStopDetails.service';
import { StopDetailsService } from '../stopDetails/stopDetails.service';
import { SpotInCityService } from '../spotInCity/spotInCity.service';
import { CityBasedSpotsService } from '../CityBasedSpots/CityBasedSpots.service';
import { ReservationGroupService } from '../reservationGroup/reservationGroup.service';
import { NewFormService } from '../newForm/newForm.service';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { SpecialInstructionService } from '../specialInstruction/specialInstruction.service';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialInstructionDetailsModule } from '../specialInstructionDetails/specialInstructionDetails.module';
import { SpecialInstructionDetailsComponent } from '../specialInstructionDetails/specialInstructionDetails.component';
import { InternalNoteDetailsModule } from '../internalNoteDetails/internalNoteDetails.module';
import { InternalNoteDetailsComponent } from '../internalNoteDetails/internalNoteDetails.component';
import { SettledRateDetailsModule } from '../settledRateDetails/settledRateDetails.module';
import { SettledRateDetailsComponent } from '../settledRateDetails/settledRateDetails.component';
import { EmailInfoService } from '../EmailInfo/EmailInfo.service';
import { EmailInfoModule } from '../EmailInfo/EmailInfo.module';
@NgModule({
  declarations: [
    ReservationComponent,
    SavedAddressComponent,
    FormDialogComponent
  ],
  imports: [
    GooglePlaceModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReservationRoutingModule,
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
    SpecialInstructionDetailsModule,
    InternalNoteDetailsModule,
    SettledRateDetailsModule,
    EmailInfoModule
  ],
  exports: [ReservationComponent, FormDialogComponent],
  providers: [ReservationService,AddPassengersService,CustomerShortService,PersonShortService,ViewKAMService,
              CustomerPersonService,CustomerPersonAddressService, PassengerDetailsService,ReservationStopDetailsService,StopDetailsService,
              SpotInCityService,CityBasedSpotsService,ReservationGroupService,NewFormService,
            SpecialInstructionService,InternalNoteDetailsService,SettledRateDetailsService,SpecialInstructionDetailsService,EmailInfoService]
})
export class ReservationModule {}



