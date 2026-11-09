// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ClosingImageViewDialogComponent } from '../../clossingOne/dialog/closingImageViewDialog/closingImageViewDialog.component';
import { StaticImageComponent } from '../static-image/static-image.component';

@NgModule({
  declarations: [ClosingImageViewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    StaticImageComponent
  ],
  exports: [ClosingImageViewDialogComponent]
})
export class ClosingImageViewModule {}
