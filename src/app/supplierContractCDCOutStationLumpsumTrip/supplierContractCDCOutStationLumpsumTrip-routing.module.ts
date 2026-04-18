// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCDCOutStationLumpsumTripComponent } from './supplierContractCDCOutStationLumpsumTrip.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCDCOutStationLumpsumTripComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCDCOutStationLumpsumTripRoutingModule {}

