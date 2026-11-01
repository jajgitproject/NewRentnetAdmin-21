// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerPaymentMappingComponent } from './customerPaymentMapping.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPaymentMappingRoutingModule {}
