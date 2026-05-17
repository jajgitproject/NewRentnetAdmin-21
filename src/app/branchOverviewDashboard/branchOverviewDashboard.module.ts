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
import { MatNativeDateModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BranchOverviewDashboardComponent } from './branchOverviewDashboard.component';
import { BranchOverviewDashboardRoutingModule } from './branchOverviewDashboard-routing.module';

@NgModule({
  declarations: [BranchOverviewDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BranchOverviewDashboardRoutingModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    NgApexchartsModule,
  ],
})
export class BranchOverviewDashboardModule {}
