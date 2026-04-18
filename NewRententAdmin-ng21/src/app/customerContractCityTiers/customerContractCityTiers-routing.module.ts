// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractCityTiersComponent } from './customerContractCityTiers.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractCityTiersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractCityTiersRoutingModule {}

