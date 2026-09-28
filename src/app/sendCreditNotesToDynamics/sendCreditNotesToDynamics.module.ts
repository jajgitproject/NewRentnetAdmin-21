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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SendCreditNotesToDynamicsComponent } from './sendCreditNotesToDynamics.component';
import { SendCreditNotesToDynamicsRoutingModule } from './sendCreditNotesToDynamics-routing.module';
import { SendCreditNotesToDynamicsService } from './sendCreditNotesToDynamics.service';

@NgModule({
  declarations: [SendCreditNotesToDynamicsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SendCreditNotesToDynamicsRoutingModule,
    MatAutocompleteModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatSortModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [SendCreditNotesToDynamicsService]
})
export class SendCreditNotesToDynamicsModule {}
