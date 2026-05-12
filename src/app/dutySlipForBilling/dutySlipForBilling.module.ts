// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DutySlipForBillingComponent } from './dutySlipForBilling.component';
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
import { DutySlipForBillingService } from './dutySlipForBilling.service';
import { DutySlipForBillingRoutingModule } from './dutySlipForBilling-routing.module';
import { ImageUploaderComponent } from '../imageUploader/imageUploader.component';
import { ImageUploaderModule } from '../imageUploader/imageUploader.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { SingleDutySingleBillForLocalService } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ControlPanelDialogeService } from '../controlPanelDialoge/controlPanelDialoge.service';
import { SummaryOfDutyModule } from '../summaryOfDuty/summary-of-duty.module';


@NgModule({
  declarations: [
    DutySlipForBillingComponent,
    ],
  imports: [
    MatTabsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DutySlipForBillingRoutingModule,
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
    SummaryOfDutyModule,
  ],
  exports:[DutySlipForBillingComponent],
  providers: [
    DutySlipForBillingService,ControlPanelDialogeService
            ]
})
export class DutySlipForBillingModule {}



