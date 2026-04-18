// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverDrivingLicenseComponent } from './driverDrivingLicense.component';

const routes: Routes = [
  {
    path: '',
    component: DriverDrivingLicenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverDrivingLicenseRoutingModule {}

