import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaxGarageInOutKMMinutesComponent } from './maxGarageInOutKMMinutes.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MaxGarageInOutKMMinutesService } from './maxGarageInOutKMMinutes.service';
import { MaxGarageInOutKMMinutesRoutingModule } from './maxGarageInOutKMMinutes-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MaxGarageInOutKMMinutesComponent, FormDialogComponent, DeleteDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaxGarageInOutKMMinutesRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [MaxGarageInOutKMMinutesService]
})
export class MaxGarageInOutKMMinutesModule {}
