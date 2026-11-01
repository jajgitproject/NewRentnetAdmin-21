// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleComplianceComponent } from './vehicleCompliance.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleComplianceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleComplianceRoutingModule {}
