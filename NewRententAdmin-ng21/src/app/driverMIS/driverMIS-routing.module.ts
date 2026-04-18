// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DriverMISComponent } from './driverMIS.component'


const routes: Routes = [
  {
    path: '',
    component: DriverMISComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverMISRoutingModule {}

