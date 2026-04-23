// @ts-nocheck
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerAddressComponent } from './customerAddress.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerAddressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerAddressRoutingModule {}

