// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractPaymentMappingComponent } from './contractPaymentMapping.component';



const routes: Routes = [
  {
    path: '',
    component: ContractPaymentMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractPaymentMappingRoutingModule {}

