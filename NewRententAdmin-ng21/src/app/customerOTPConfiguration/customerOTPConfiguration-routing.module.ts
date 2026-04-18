// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerOTPConfigurationComponent } from './customerOTPConfiguration.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerOTPConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOTPConfigurationRoutingModule {}

