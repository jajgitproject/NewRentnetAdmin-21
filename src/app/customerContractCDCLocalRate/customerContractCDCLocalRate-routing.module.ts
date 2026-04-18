// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractCDCLocalRateComponent } from './customerContractCDCLocalRate.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractCDCLocalRateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractCDCLocalRateRoutingModule {}

