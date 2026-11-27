// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CappingFacilityConfigComponent } from './cappingFacilityConfig.component';
import { CappingFacilityConfigService } from './cappingFacilityConfig.service';
import { CappingFacilityConfigRoutingModule } from './cappingFacilityConfig-routing.module';

@NgModule({
  declarations: [CappingFacilityConfigComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CappingFacilityConfigRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTableModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  providers: [CappingFacilityConfigService]
})
export class CappingFacilityConfigModule {}
