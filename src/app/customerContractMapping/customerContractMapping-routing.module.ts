// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerContractMappingComponent } from './customerContractMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerContractMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerContractMappingRoutingModule {}

