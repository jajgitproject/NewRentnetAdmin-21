// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverRemarkComponent } from './driverRemark.component';

const routes: Routes = [
  {
    path: '',
    component: DriverRemarkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRemarkRoutingModule {}

