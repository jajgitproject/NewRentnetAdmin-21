// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SendDataToDynamicsComponent } from './sendDataToDynamics.component';
import { SendDataToDynamicsRoutingModule } from './sendDataToDynamics-routing.module';
import { SendDataToDynamicsService } from './sendDataToDynamics.service';

@NgModule({
  declarations: [SendDataToDynamicsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendDataToDynamicsRoutingModule,
    MatAutocompleteModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatSortModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [SendDataToDynamicsService]
})
export class SendDataToDynamicsModule {}
