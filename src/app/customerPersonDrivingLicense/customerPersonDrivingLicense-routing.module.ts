// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPersonDrivingLicenseComponent } from './customerPersonDrivingLicense.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPersonDrivingLicenseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPersonDrivingLicenseRoutingModule {}

