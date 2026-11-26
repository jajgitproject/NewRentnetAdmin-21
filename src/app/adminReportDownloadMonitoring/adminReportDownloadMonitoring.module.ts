// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminReportDownloadMonitoringComponent } from './adminReportDownloadMonitoring.component';
import { AdminReportDownloadMonitoringRoutingModule } from './adminReportDownloadMonitoring-routing.module';
import { AdminReportDownloadMonitoringService } from './adminReportDownloadMonitoring.service';
import { ShowFieldsDialogComponent } from './show-fields-dialog.component';

@NgModule({
  declarations: [
    AdminReportDownloadMonitoringComponent,
    ShowFieldsDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminReportDownloadMonitoringRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatPaginatorModule
  ],
  providers: [AdminReportDownloadMonitoringService]
})
export class AdminReportDownloadMonitoringModule {}
