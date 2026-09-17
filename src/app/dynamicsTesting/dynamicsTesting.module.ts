// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DynamicsTestingComponent } from './dynamicsTesting.component';
import { DynamicsTestingRoutingModule } from './dynamicsTesting-routing.module';
import { DynamicsTestingService } from './dynamicsTesting.service';

@NgModule({
  declarations: [DynamicsTestingComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DynamicsTestingRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [DynamicsTestingService]
})
export class DynamicsTestingModule {}
