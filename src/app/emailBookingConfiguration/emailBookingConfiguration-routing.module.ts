import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailBookingConfigurationComponent } from './emailBookingConfiguration.component';

const routes: Routes = [{ path: '', component: EmailBookingConfigurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailBookingConfigurationRoutingModule {}
