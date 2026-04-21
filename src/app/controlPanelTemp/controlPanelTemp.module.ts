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
import { MyUploadModule } from '../myupload/myupload.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { PassengerService } from '../passenger/passenger.service';
import { ControlPanelTempService } from './controlPanelTemp.service';
import { ControlPanelTempRoutingModule } from './controlPanelTemp-routing.module';
import { ControlPanelTempComponent } from './controlPanelTemp.component';
import { OtherFilterService } from '../otherFilter/otherFilter.service';
import { TripFilterService } from '../tripFilter/tripFilter.service';
// import { BookerInfoService } from '../BookerInfo/BookerInfo.service';
// import { VehicleCategoryInfoService } from '../VehicleCategoryInfo/VehicleCategoryInfo.service';
// import { VehicleInfoService } from '../VehicleInfo/VehicleInfo.service';
// import { PackageInfoService } from '../PackageInfo/PackageInfo.service';
// import { PassengerInfoService } from '../PassengerInfo/PassengerInfo.service';
// import { SpecialInstructionInfoService } from '../SpecialInstructionInfo/SpecialInstructionInfo.service';
// import { StopDetailsInfoService } from '../StopDetailsInfo/StopDetailsInfo.service';
// import { TimeAndAddressInfoService } from '../TimeAndAddressInfo/TimeAndAddressInfo.service';
// import { BookingDetailsService } from '../bookingDetails/bookingDetails.service';
import { MatProgressBarModule } from "@angular/material/progress-bar";
// import { VendorAssignmentService } from '../VendorAssignment/VendorAssignment.service';
// import { VendorAcceptanceService } from '../VendorAcceptance/VendorAcceptance.service';
// import { VendorInfoService } from '../VendorInfo/vendorInfo.service';
// import { VehicleAssignmentService } from '../VehicleAssignment/VehicleAssignment.service';
// import { GarageOutInfoService } from '../GarageOutInfo/GarageOutInfo.service';
// import { VehicleSuppliedInfoService } from '../VehicleSuppliedInfo/VehicleSuppliedInfo.service';
import { PrintDutySlipService } from '../PrintDutySlip/PrintDutySlip.service';
// import { ReachedInfoService } from '../ReachedInfo/ReachedInfo.service';
// import { ChauffeurInfoService } from '../ChauffeurInfo/ChauffeurInfo.service';
// import { TripStartInfoService } from '../TripStartInfo/TripStartInfo.service';
// import { TripEndInfoService } from '../TripEndInfo/TripEndInfo.service';
// import { GarageInInfoService } from '../GarageInInfo/GarageInInfo.service';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [ControlPanelTempComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ControlPanelTempRoutingModule,
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MyUploadModule,
    MatProgressBarModule
  ],
  providers: [
    ControlPanelTempService,
    //PassengerService,
    OtherFilterService,
    TripFilterService,
    // BookerInfoService,
    // VehicleCategoryInfoService,
    // VehicleInfoService,
    // VehicleSuppliedInfoService,
    // ChauffeurInfoService,
    // PackageInfoService,
    // PassengerInfoService,
    // SpecialInstructionInfoService,
    // StopDetailsInfoService,
    // TimeAndAddressInfoService,
    // BookingDetailsService,
    // VendorAssignmentService,
    // VendorAcceptanceService,
    // VendorInfoService,
    // VehicleAssignmentService,
    // GarageOutInfoService,
    PrintDutySlipService,
    // ReachedInfoService,
    // TripStartInfoService,
    // TripEndInfoService,
    // GarageInInfoService
  ]
})
export class ControlPanelTempModule {}


