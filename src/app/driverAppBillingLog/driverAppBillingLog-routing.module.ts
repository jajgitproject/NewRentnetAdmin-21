import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverAppBillingLogComponent } from './driverAppBillingLog.component';

const routes: Routes = [
  { path: '', component: DriverAppBillingLogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverAppBillingLogRoutingModule {}
