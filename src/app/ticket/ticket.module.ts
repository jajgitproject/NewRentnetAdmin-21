// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TicketRoutingModule } from './ticket-routing.module';
import { TicketService } from './ticket.service';
import { TicketListComponent } from './ticket-list.component';
import { TicketRaiseComponent } from './ticket-raise.component';
import { TicketDetailComponent } from './ticket-detail.component';
import { TicketDashboardComponent } from './ticket-dashboard.component';
import { TicketPerformanceComponent } from './ticket-performance.component';
import { TicketMastersComponent } from './ticket-masters.component';

@NgModule({
  declarations: [
    TicketListComponent,
    TicketRaiseComponent,
    TicketDetailComponent,
    TicketDashboardComponent,
    TicketPerformanceComponent,
    TicketMastersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TicketRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  providers: [TicketService]
})
export class TicketModule {}
