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
import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadModule } from '../myupload/myupload.module';
import { ControlPanelDialogeComponent } from './controlPanelDialoge.component';
import { ControlPanelDialogeRoutingModule } from './controlPanelDialoge-routing.module';
import { CancelReservationAndAllotmentService } from '../cancelReservationAndAllotment/cancelReservationAndAllotment.service';
import { EmailInfoService } from '../EmailInfo/EmailInfo.service';
import { IntegrationLogService } from '../integrationLog/integrationLog.service';
import { ControlPanelDialogEntriesModule } from './control-panel-dialog-entries.module';

@NgModule({
  declarations: [
    ControlPanelDialogeComponent
  ],
  exports: [ControlPanelDialogeComponent, ControlPanelDialogEntriesModule],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ControlPanelDialogeRoutingModule,
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
    MyUploadModule,
    ControlPanelDialogEntriesModule
  ],
  providers: [CancelReservationAndAllotmentService,EmailInfoService ]
})
export class ControlPanelDialogeModule {}


