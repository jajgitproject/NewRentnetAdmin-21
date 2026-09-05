// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { RejectedQCDriverPhotoRoutingModule } from './rejectedQCDriverPhoto-routing.module';
import { RejectedQCDriverPhotoComponent } from './rejectedQCDriverPhoto.component';
import { RejectedQCDriverPhotoService } from './rejectedQCDriverPhoto.service';

@NgModule({
  declarations: [RejectedQCDriverPhotoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RejectedQCDriverPhotoRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  providers: [
    RejectedQCDriverPhotoService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class RejectedQCDriverPhotoModule {}
