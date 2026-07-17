// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FinanceDashboardComponent } from './financeDashboard.component';
import { FinanceDashboardDrilldownDialogComponent } from './financeDashboard-drilldown-dialog.component';
import { FinanceDashboardRoutingModule } from './financeDashboard-routing.module';
import { FinanceDashboardService } from './financeDashboard.service';

@NgModule({
  declarations: [FinanceDashboardComponent, FinanceDashboardDrilldownDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FinanceDashboardRoutingModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  providers: [FinanceDashboardService],
})
export class FinanceDashboardModule {}
