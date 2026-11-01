// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketListComponent } from './ticket-list.component';
import { TicketRaiseComponent } from './ticket-raise.component';
import { TicketDetailComponent } from './ticket-detail.component';
import { TicketDashboardComponent } from './ticket-dashboard.component';
import { TicketPerformanceComponent } from './ticket-performance.component';
import { TicketMastersComponent } from './ticket-masters.component';

const routes: Routes = [
  { path: '', component: TicketListComponent },
  { path: 'raise', component: TicketRaiseComponent },
  { path: 'dashboard', component: TicketDashboardComponent },
  { path: 'performance', component: TicketPerformanceComponent },
  { path: 'masters', component: TicketMastersComponent },
  { path: ':id', component: TicketDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule {}
