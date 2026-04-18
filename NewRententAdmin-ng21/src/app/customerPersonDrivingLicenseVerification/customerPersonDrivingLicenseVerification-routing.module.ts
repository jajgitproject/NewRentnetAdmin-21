// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonDrivingLicenseVerificationComponent } from './customerPersonDrivingLicenseVerification.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonDrivingLicenseVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonDrivingLicenseVerificationRoutingModule {}

