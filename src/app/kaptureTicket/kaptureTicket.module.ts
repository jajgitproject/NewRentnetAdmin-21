import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { KaptureTicketService } from './kaptureTicket.service';
import { KaptureTicketComponent } from './kaptureTicket.component';
import { KaptureTicketRoutingModule } from './kaptureTicket-routing.module';

@NgModule({
  declarations: [KaptureTicketComponent],
  imports: [
    CommonModule,
    FormsModule,
    KaptureTicketRoutingModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [KaptureTicketService]
})
export class KaptureTicketModule {}
