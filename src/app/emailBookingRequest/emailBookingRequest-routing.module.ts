import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailBookingRequestComponent } from './emailBookingRequest.component';

const routes: Routes = [{ path: '', component: EmailBookingRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailBookingRequestRoutingModule {}
