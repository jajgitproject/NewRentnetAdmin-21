import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CdpBookingRequestComponent } from './cdpBookingRequest.component';

const routes: Routes = [
  {
    path: '',
    component: CdpBookingRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CdpBookingRequestRoutingModule {}
