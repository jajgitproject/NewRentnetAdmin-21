// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateViewForVendorLocalComponent } from './rateViewForVendorLocal.component';

const routes: Routes = [
  {
    path: '',
    component: RateViewForVendorLocalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateViewForVendorLocalRoutingModule {}

