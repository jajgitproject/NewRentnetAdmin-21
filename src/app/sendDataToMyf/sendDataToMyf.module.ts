// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { SendDataToMyfComponent } from './sendDataToMyf.component';
import { SendDataToMyfRoutingModule } from './sendDataToMyf-routing.module';
import { SendDataToMyfService } from './sendDataToMyf.service';
import { MyfPayloadDialogComponent } from './myf-payload-dialog.component';

@NgModule({
  declarations: [SendDataToMyfComponent, MyfPayloadDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    SendDataToMyfRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  providers: [SendDataToMyfService]
})
export class SendDataToMyfModule {}
