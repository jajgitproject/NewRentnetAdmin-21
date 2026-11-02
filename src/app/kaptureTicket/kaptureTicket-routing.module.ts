import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KaptureTicketComponent } from './kaptureTicket.component';

const routes: Routes = [
  {
    path: '',
    component: KaptureTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KaptureTicketRoutingModule {}
