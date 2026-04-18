// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCDCOutStationOnewayTripComponent } from './supplierContractCDCOutStationOnewayTrip.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCDCOutStationOnewayTripComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCDCOutStationOnewayTripRoutingModule {}

