// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerCallMaskingComponent } from './customerCallMasking.component';
import { CustomerCallMaskingRoutingModule } from './customerCallMasking-routing.module';
import { CustomerCallMaskingService } from './customerCallMasking.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CustomerCallMaskingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomerCallMaskingRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [CustomerCallMaskingService]
})
export class CustomerCallMaskingModule {}
