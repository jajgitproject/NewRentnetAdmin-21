// @ts-nocheck
/**
 * Change-password form dialog for use outside the lazy ChangePassword route
 * (e.g. AppModule / HeaderComponent → MatDialog.open(FormDialogComponent)).
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ChangePasswordService } from './changePassword.service';

@NgModule({
  declarations: [FormDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [FormDialogComponent],
  providers: [ChangePasswordService],
})
export class ChangePasswordDialogModule {}
