// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerAllowedCarsInCDPComponent } from './customerAllowedCarsInCDP.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerAllowedCarsInCDPComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAllowedCarsInCDPRoutingModule {}

