// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierContractCityPercentageComponent } from './supplierContractCityPercentage.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierContractCityPercentageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierContractCityPercentageRoutingModule {}

