import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailBookingClerkMISComponent } from './emailBookingClerkMIS.component';

const routes: Routes = [{ path: '', component: EmailBookingClerkMISComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailBookingClerkMISRoutingModule {}
