// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCDCOutStationRoundTripComponent } from './supplierContractCDCOutStationRoundTrip.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCDCOutStationRoundTripComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCDCOutStationRoundTripRoutingModule {}

