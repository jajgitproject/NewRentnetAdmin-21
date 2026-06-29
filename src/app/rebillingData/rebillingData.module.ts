// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RebillingDataRoutingModule } from './rebillingData-routing.module';
import { RebillingDataService } from './rebillingData.service';
import { RebillingDataComponent } from './rebillingData.component';

@NgModule({
  declarations: [
    RebillingDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RebillingDataRoutingModule,
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [RebillingDataService]
})
export class RebillingDataModule {}
