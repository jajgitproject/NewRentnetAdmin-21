// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { KamInfoDialogComponent } from './kam-info-dialog.component';

@NgModule({
  declarations: [KamInfoDialogComponent],
  imports: [CommonModule, MatButtonModule, MatCardModule, MatDialogModule, MatIconModule],
  exports: [KamInfoDialogComponent]
})
export class KamInfoDialogModule {}
