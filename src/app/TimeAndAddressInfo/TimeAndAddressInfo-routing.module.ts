// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeAndAddressInfoComponent } from './TimeAndAddressInfo.component';

const routes: Routes = [
  {
    path: '',
    component: TimeAndAddressInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeAndAddressInfoRoutingModule {}

