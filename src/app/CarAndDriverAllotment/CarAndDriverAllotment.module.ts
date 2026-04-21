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
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MyUploadComponent } from '../myupload/myupload.component';
//import { PassengerModule } from '../passenger/passenger.module';
import { MyUploadModule } from '../myupload/myupload.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { PassengerService } from '../passenger/passenger.service';
import { CarAndDriverAllotmentService } from './CarAndDriverAllotment.service';
import { CarAndDriverAllotmentRoutingModule } from './CarAndDriverAllotment-routing.module';
import { CarAndDriverAllotmentComponent } from './CarAndDriverAllotment.component';
import { OtherFilterService } from '../otherFilter/otherFilter.service';
import { DriverInventoryAssociationService } from '../driverInventoryAssociation/driverInventoryAssociation.service';
import { AllotCarAndDriverService } from '../allotCarAndDriver/allotCarAndDriver.service';
import { CancelAllotmentService } from '../cancelAllotment/cancelAllotment.service';
import { DriverFeedbackInfoService } from '../DriverFeedbackInfo/DriverFeedbackInfo.service';
import { PassengerHistoryService } from '../PassengerHistory/PassengerHistory.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormDialogNotificationComponent } from './form-dialog/form-dialog.component';
import { AllotmentNotificationDialogComponent } from './allotmentNotification/allotmentNotification.component';
import { AllotmentNotificationReplyDialogComponent } from './allotmentNotificationReply/allotmentNotificationReply.component';
import { SearchDriverByLocationService } from '../searchDriverByLocation/searchDriverByLocation.service';
import { GooglePlaceModule } from '@compat/google-places-shim';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
// import { VisitorsService } from './visitor.service';
import { VendorDetailsService } from '../vendorDetails/vendorDetails.service';
import { LocationDetailsService } from '../locationDetails/locationDetails.service';
//import { AgmCoreModule } from '@agm/core';
import { FeedBackDetailsService } from '../feedBackDetails/feedBackDetails.service';
import { PickUpDetailShowService } from '../pickUpDetailShow/pickUpDetailShow.service';
import { DropOffDetailShowService } from '../dropOffDetailShow/dropOffDetailShow.service';
import { LocationInDetailShowService } from '../locationInDetailShow/locationInDetailShow.service';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { ControlPanelDesignService } from '../controlPanelDesign/controlPanelDesign.service';
import { ReservationLocationTransferLogService } from '../reservationLocationTransferLog/reservationLocationTransferLog.service';
import { ReservationLocationTransferLogModule } from '../reservationLocationTransferLog/reservationLocationTransferLog.module';
import { ReservationLocationTransferLogComponent } from '../reservationLocationTransferLog/reservationLocationTransferLog.component';
import { AdhocCarAndDriverService } from '../adhocCarAndDriver/adhocCarAndDriver.service';

@NgModule({
  declarations: [
    CarAndDriverAllotmentComponent,
    FormDialogNotificationComponent,
    AllotmentNotificationDialogComponent,
    AllotmentNotificationReplyDialogComponent,
  ],
  imports: [
    HttpClientJsonpModule,
    HttpClientModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    GooglePlaceModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    CarAndDriverAllotmentRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    ReservationLocationTransferLogModule
  ],
  providers: [CarAndDriverAllotmentService,
              OtherFilterService,
              DriverInventoryAssociationService,
              AllotCarAndDriverService,CancelAllotmentService,DriverFeedbackInfoService,PassengerHistoryService,VendorDetailsService,
              LocationDetailsService,FeedBackDetailsService,PickUpDetailShowService,
                  LocationInDetailShowService,
                  DropOffDetailShowService,DispatchByExecutiveService ,ControlPanelDesignService,ReservationLocationTransferLogService,AdhocCarAndDriverService]
})
export class CarAndDriverAllotmentModule { }



