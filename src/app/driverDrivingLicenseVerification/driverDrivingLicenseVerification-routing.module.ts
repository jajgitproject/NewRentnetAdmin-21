// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverDrivingLicenseVerificationComponent } from './driverDrivingLicenseVerification.component';

const routes: Routes = [
  {
    path: '',
    component: DriverDrivingLicenseVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverDrivingLicenseVerificationRoutingModule {}

